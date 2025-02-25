/**
 * This is an implementation of a generic std::function factory that can produce
 * C++ functions from JS functions.
 *
 * It will be included in the standard library in SWIG JSE in a near future.
 *
 * The C++ functions support being called both synchronously and asynchronously.
 *
 * When called asynchronously, they support automatically resolving Promises returned from
 * JavaScript async callbacks.
 */
%fragment("remove_void", "header") %{
template <class T> struct remove_void { using type = T; };
template <> struct remove_void<void> { using type = int; };
%}

%fragment("SWIG_NAPI_Callback", "header", fragment="<memory>", fragment="remove_void") %{
  #include <thread>
  #include <condition_variable>
  #include <exception>

  // An object of this class is a JS trampoline that is compatible
  // with a C++ std::function. It can be kept on the C++ side, can
  // be called and destroyed both from the JS thread (sync) and the
  // background threads (async). It must be constructed on the
  // JS thread. It does not support reentrancy, the C++ code must
  // make multiple parallel calls. The object is trivially
  // copy-constructible but it will always keep the same V8 context
  // which will be destroyed when the last copy is destroyed.
  //
  // Sync mode sequence, everything runs in the JS thread:
  //   * The object is constructed from JS context
  //   * JS runs and calls the C++ code which needs the callback
  //   * C++ calls operator() which calls do_call to enter JS, then
  //     processes the returned value, then lifts the barrier
  //   * The barrier is already open when the outer lambda reaches the end
  //
  // Async mode sequence:
  //   * [JS thread] The object is constructed from JS context
  //   * [JS thread] JS runs and calls the C++ code which needs the callback
  //   * [Background thread] C++ calls operator() which schedules
  //     do_call via TSFN to run on the main thread and stops on the barrier
  //   * [JS thread] do_call runs, calls JS and handles the returned value
  //     If the JS callback is not async, it unblocks the barrier
  //     If the JS callback is async, do_call schedules the two innermost
  //     lambdas to run on .then() and on .catch()
  //     The innermost lambdas process the values and unblock the outer
  //     lambda
  //   * [Background thread] C++ is unblocked, everything else must have
  //     finished running and destructing, the outer lambda that contains
  //     the local variables is destroyed
  //
  template <typename RET, typename ...ARGS> class SWIG_NAPI_JS_Trampoline : public std::function<RET(ARGS...)> {
    Napi::Env env;
    // These perform argument and return value conversions and
    // can be called only on the JS thread
    std::function<void(Napi::Env, std::vector<napi_value> &, ARGS...)> tmaps_in;
    std::function<RET(Napi::Env, Napi::Value)> tmap_out;
    // The V8 context can be created and destroyed only
    // in the JS thread
    struct NAPIContext {
      std::thread::id main_thread_id;
      // Used when calling from a background thread
      Napi::ThreadSafeFunction tsfn;
      // Used when calling from the JS thread
      Napi::Reference<Napi::Function> jsfn_ref;
      // The this value inside the JS callback
      Napi::Reference<Napi::Value> this_value_ref;
    };
    std::shared_ptr<NAPIContext> napi_context;

  public:
    // Construction always happen on the JS thread
    SWIG_NAPI_JS_Trampoline(Napi::Function js_callback,
        std::function<void(Napi::Env, std::vector<napi_value> &, ARGS...)> in,
        std::function<RET(Napi::Env, Napi::Value)> out,
        Napi::Value this_value) :
      std::function<RET(ARGS...)>{},
      env{js_callback.Env()},
      tmaps_in{in},
      tmap_out{out},
      napi_context{new NAPIContext{}, DestroyContext}
    {
      napi_context->main_thread_id = std::this_thread::get_id();
      napi_context->tsfn = Napi::ThreadSafeFunction::New(env,
        js_callback.As<Napi::Function>(),
        Napi::Object::New(env),
        "SWIG_callback_task",
        0,
        1
      );
      napi_context->jsfn_ref = Napi::Persistent(js_callback);
      napi_context->this_value_ref = Napi::Persistent(this_value);
    }

    // The custom shared_ptr deleter
    static void DestroyContext(SWIG_NAPI_JS_Trampoline::NAPIContext *context) {
      if (std::this_thread::get_id() == context->main_thread_id) {
        // Sync deletion - actually delete
        context->tsfn.Release();
        delete context;
      } else {
        // Async deletion - reschedule on the JS thread
        context->tsfn.BlockingCall(context, DestroyContextTSFN);
      }
    }

    // The bottom half of the deleter that runs on the main thread
    static void DestroyContextTSFN(Napi::Env, Napi::Function, NAPIContext *context) {
      context->tsfn.Release();
      delete context;
    }

    // Destruction can happen both on the JS thread and
    // in a background thread
    virtual ~SWIG_NAPI_JS_Trampoline() {}

    virtual RET operator()(ARGS... args) {
      // Here we are called by the C++ code - we might be in a the main thread (synchronous call)
      // or a background thread (asynchronous call).
      auto worker_thread_id = std::this_thread::get_id();
      typename remove_void<RET>::type c_ret;
      std::string error_msg;
      std::mutex m;
      std::condition_variable cv;
      bool ready = false;
      bool error = false;

      {
        // This is the actual trampoline that allows call into JS
        auto do_call = [&c_ret, &error_msg, &m, &cv, &ready, &error,
                        context = napi_context.get(), worker_thread_id,
                        this, &args...] (Napi::Env env, Napi::Function js_callback) {
          // Here we are back in the main V8 thread, potentially from an async context
          Napi::HandleScope store{env};

          // Convert the C++ arguments to JS
          std::vector<napi_value> js_args{sizeof...(args)};
          this->tmaps_in(env, js_args, args...);

          // Call the JS callback
          try {
            Napi::Value js_ret = js_callback.Call(env.Global(), js_args);

            // You don't need this part if you are not going to support async functions
  #ifdef ASYNC_CALLBACK_SUPPORT
            // Handle the Promise in case the function was async
            if (js_ret.IsPromise()) {
              if (context->main_thread_id == worker_thread_id) {
                throw std::runtime_error{"Can't resolve a Promise when called synchronously"};
              }
              napi_value on_resolve = Napi::Function::New(env, [env, this, &c_ret, &error_msg, &m, &cv, &ready, &error]
                  (const Napi::CallbackInfo &info) {
                  // Handle the JS return value
                  try {
                    if constexpr (!std::is_void<RET>::value)
                      c_ret = this->tmap_out(env, info[0]);
                    else {
                      (void)env;
                      (void)c_ret;
                      (void)this;
                    }
                  } catch (const std::exception &e) {
                    error = true;
                    error_msg = e.what();
                  }

                  // Unblock the C++ thread
                  // This is very tricky and it is not the officially recommended
                  // C++ locking sequence. We are running in a lambda inside the
                  // main lambda and as soon as we unblock it, it can potentially
                  // exit and start calling the destructors to the local variables
                  // on the stack this lambda references - which means that this
                  // lambda will cease to exist, leading to very hard to debug
                  // crashes. Keep the mutex until the last possible moment.
                  std::lock_guard<std::mutex> lock{m};
                  ready = true;
                  cv.notify_one();
                });
              napi_value on_reject = Napi::Function::New(env, [&error_msg, &m, &cv, &ready, &error]
                  (const Napi::CallbackInfo &info) {
                  // Handle exceptions
                  error = true;
                  error_msg = info[0].ToString();

                  // Unblock the C++ thread
                  std::lock_guard<std::mutex> lock{m};
                  ready = true;
                  cv.notify_one();
                });
              js_ret.ToObject().Get("then").As<Napi::Function>().Call(js_ret, 1, &on_resolve);
              js_ret.ToObject().Get("catch").As<Napi::Function>().Call(js_ret, 1, &on_reject);
              return;
            }
  #endif

            // Handle the JS return value
            if constexpr (!std::is_void<RET>::value)
              c_ret = this->tmap_out(env, js_ret);
          } catch (const std::exception &err) {
            // Handle exceptions
            error = true;
            error_msg = err.what();
          }

          // Unblock the C++ thread
          std::lock_guard<std::mutex> lock{m};
          ready = true;
          cv.notify_one();
        };

        // Are we in the thread pool background thread (V8 is not accessible) or not?
        // (this is what allows this typemap to work in both sync and async mode)
        if (worker_thread_id == napi_context->main_thread_id) {
          // Synchronous call
          Napi::Function js_cb = napi_context->jsfn_ref.Value();
          do_call(js_cb.Env(), js_cb);
        } else {
          // Asynchronous call
          napi_context->tsfn.BlockingCall(do_call);
        }

        // This is a barrier
        std::unique_lock<std::mutex> lock{m};
        cv.wait(lock, [&ready]{ return ready; });
      }

      if (error) throw std::runtime_error{error_msg};
      if constexpr (!std::is_void<RET>::value)
        return c_ret;
      else
        return;
    }
  };

  template <typename RET, typename ...ARGS>
  std::function<RET(ARGS...)> SWIG_NAPI_Callback(
      Napi::Value js_callback,
      std::function<void(Napi::Env, std::vector<napi_value> &, ARGS...)> tmaps_in,
      std::function<RET(Napi::Env, Napi::Value)> tmap_out,
      Napi::Value this_value
    ) {
      if (!js_callback.IsFunction()) throw Napi::Error::New(js_callback.Env(), "Passed argument is not a function");
      return SWIG_NAPI_JS_Trampoline<RET, ARGS...>{js_callback.As<Napi::Function>(), tmaps_in, tmap_out, this_value};
  }
%}
