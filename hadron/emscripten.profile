include(default)

[buildenv]
CC={{ os.getenv("EMCC") or "emcc" }}
CXX={{ os.getenv("EMCXX") or "em++" }}

[settings]
os=Emscripten
arch=wasm
compiler=clang
compiler.libcxx=libc++
compiler.version=17

[conf]
# Here normally you would use either always -pthread or never -pthread
# depending on whether your application requires async
# The template expression allows for conditional -pthread 
tools.build:cflags=[ '{{ "-pthread" if not os.getenv("npm_config_disable_async") else ""  }}' ]
tools.build:cxxflags=[ '{{ "-pthread" if not os.getenv("npm_config_disable_async") else ""  }}' ]
tools.cmake.cmaketoolchain:user_toolchain=['{{ os.getenv("EMSDK") }}/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake']
# In the emscripten world, there is no virtual memory, Elvis is still alive and -O2 is still risky business
# As a rule of thumb, the first thing to do when encountering weird WASM errors is to disable the binaryen optrimization
# In this particular case zlib-ng compiled without -pthread will produce garbled output with -O2
# Still waiting for Google to refocus their priorities from human anatomy to binaryen to try to fix this issue
tools.cmake.cmaketoolchain:extra_variables={{ {} if not os.getenv("npm_config_disable_async") else {"CMAKE_C_FLAGS_RELEASE": "-O0 -DNDEBUG"} }}

[options]

[tool_requires]
# Alas we need 3.1.53 which is not yet on conan
#emsdk/3.1.50
