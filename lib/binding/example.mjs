
var example = (() => {
  var _scriptDir = import.meta.url;
  
  return (
async function(moduleArg = {}) {

// Support for growable heap + pthreads, where the buffer may change, so JS views
// must be updated.
function GROWABLE_HEAP_I8() {
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
  return HEAP8;
}
function GROWABLE_HEAP_U8() {
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
  return HEAPU8;
}
function GROWABLE_HEAP_I16() {
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
  return HEAP16;
}
function GROWABLE_HEAP_U16() {
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
  return HEAPU16;
}
function GROWABLE_HEAP_I32() {
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
  return HEAP32;
}
function GROWABLE_HEAP_U32() {
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
  return HEAPU32;
}
function GROWABLE_HEAP_F32() {
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
  return HEAPF32;
}
function GROWABLE_HEAP_F64() {
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
  return HEAPF64;
}

var Module = moduleArg;

var readyPromiseResolve, readyPromiseReject;

Module["ready"] = new Promise((resolve, reject) => {
 readyPromiseResolve = resolve;
 readyPromiseReject = reject;
});

[ "_napi_register_wasm_v1", "_malloc", "_free", "__emscripten_thread_init", "__emscripten_thread_exit", "__emscripten_thread_crashed", "__emscripten_thread_mailbox_await", "__emscripten_tls_init", "_pthread_self", "checkMailbox", "__embind_initialize_bindings", "establishStackSpace", "invokeEntryPoint", "PThread", "getExceptionMessage", "$incrementExceptionRefcount", "$decrementExceptionRefcount", "___indirect_function_table", "onRuntimeInitialized" ].forEach(prop => {
 if (!Object.getOwnPropertyDescriptor(Module["ready"], prop)) {
  Object.defineProperty(Module["ready"], prop, {
   get: () => abort("You are getting " + prop + " on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js"),
   set: () => abort("You are setting " + prop + " on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")
  });
 }
});

var moduleOverrides = Object.assign({}, Module);

var arguments_ = [];

var thisProgram = "./this.program";

var quit_ = (status, toThrow) => {
 throw toThrow;
};

var ENVIRONMENT_IS_WEB = typeof window == "object";

var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";

var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";

var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

if (Module["ENVIRONMENT"]) {
 throw new Error("Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)");
}

var ENVIRONMENT_IS_PTHREAD = Module["ENVIRONMENT_IS_PTHREAD"] || false;

var scriptDirectory = "";

function locateFile(path) {
 if (Module["locateFile"]) {
  return Module["locateFile"](path, scriptDirectory);
 }
 return scriptDirectory + path;
}

var read_, readAsync, readBinary;

if (ENVIRONMENT_IS_NODE) {
 if (typeof process == "undefined" || !process.release || process.release.name !== "node") throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
 var nodeVersion = process.versions.node;
 var numericVersion = nodeVersion.split(".").slice(0, 3);
 numericVersion = (numericVersion[0] * 1e4) + (numericVersion[1] * 100) + (numericVersion[2].split("-")[0] * 1);
 var minVersion = 16e4;
 if (numericVersion < 16e4) {
  throw new Error("This emscripten-generated code requires node v16.0.0 (detected v" + nodeVersion + ")");
 }
 const {createRequire: createRequire} = await import("module");
 /** @suppress{duplicate} */ var require = createRequire(import.meta.url);
 var fs = require("fs");
 var nodePath = require("path");
 if (ENVIRONMENT_IS_WORKER) {
  scriptDirectory = nodePath.dirname(scriptDirectory) + "/";
 } else {
  scriptDirectory = require("url").fileURLToPath(new URL("./", import.meta.url));
 }
 read_ = (filename, binary) => {
  filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
  return fs.readFileSync(filename, binary ? undefined : "utf8");
 };
 readBinary = filename => {
  var ret = read_(filename, true);
  if (!ret.buffer) {
   ret = new Uint8Array(ret);
  }
  assert(ret.buffer);
  return ret;
 };
 readAsync = (filename, onload, onerror, binary = true) => {
  filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
  fs.readFile(filename, binary ? undefined : "utf8", (err, data) => {
   if (err) onerror(err); else onload(binary ? data.buffer : data);
  });
 };
 if (!Module["thisProgram"] && process.argv.length > 1) {
  thisProgram = process.argv[1].replace(/\\/g, "/");
 }
 arguments_ = process.argv.slice(2);
 quit_ = (status, toThrow) => {
  process.exitCode = status;
  throw toThrow;
 };
 global.Worker = require("worker_threads").Worker;
} else if (ENVIRONMENT_IS_SHELL) {
 if ((typeof process == "object" && typeof require === "function") || typeof window == "object" || typeof importScripts == "function") throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
 if (typeof read != "undefined") {
  read_ = read;
 }
 readBinary = f => {
  if (typeof readbuffer == "function") {
   return new Uint8Array(readbuffer(f));
  }
  let data = read(f, "binary");
  assert(typeof data == "object");
  return data;
 };
 readAsync = (f, onload, onerror) => {
  setTimeout(() => onload(readBinary(f)));
 };
 if (typeof clearTimeout == "undefined") {
  globalThis.clearTimeout = id => {};
 }
 if (typeof setTimeout == "undefined") {
  globalThis.setTimeout = f => (typeof f == "function") ? f() : abort();
 }
 if (typeof scriptArgs != "undefined") {
  arguments_ = scriptArgs;
 } else if (typeof arguments != "undefined") {
  arguments_ = arguments;
 }
 if (typeof quit == "function") {
  quit_ = (status, toThrow) => {
   setTimeout(() => {
    if (!(toThrow instanceof ExitStatus)) {
     let toLog = toThrow;
     if (toThrow && typeof toThrow == "object" && toThrow.stack) {
      toLog = [ toThrow, toThrow.stack ];
     }
     err(`exiting due to exception: ${toLog}`);
    }
    quit(status);
   });
   throw toThrow;
  };
 }
 if (typeof print != "undefined") {
  if (typeof console == "undefined") console = /** @type{!Console} */ ({});
  console.log = /** @type{!function(this:Console, ...*): undefined} */ (print);
  console.warn = console.error = /** @type{!function(this:Console, ...*): undefined} */ (typeof printErr != "undefined" ? printErr : print);
 }
} else  if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
 if (ENVIRONMENT_IS_WORKER) {
  scriptDirectory = self.location.href;
 } else if (typeof document != "undefined" && document.currentScript) {
  scriptDirectory = document.currentScript.src;
 }
 if (_scriptDir) {
  scriptDirectory = _scriptDir;
 }
 if (scriptDirectory.startsWith("blob:")) {
  scriptDirectory = "";
 } else {
  scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
 }
 if (!(typeof window == "object" || typeof importScripts == "function")) throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
 if (!ENVIRONMENT_IS_NODE) {
  read_ = url => {
   var xhr = new XMLHttpRequest;
   xhr.open("GET", url, false);
   xhr.send(null);
   return xhr.responseText;
  };
  if (ENVIRONMENT_IS_WORKER) {
   readBinary = url => {
    var xhr = new XMLHttpRequest;
    xhr.open("GET", url, false);
    xhr.responseType = "arraybuffer";
    xhr.send(null);
    return new Uint8Array(/** @type{!ArrayBuffer} */ (xhr.response));
   };
  }
  readAsync = (url, onload, onerror) => {
   var xhr = new XMLHttpRequest;
   xhr.open("GET", url, true);
   xhr.responseType = "arraybuffer";
   xhr.onload = () => {
    if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
     onload(xhr.response);
     return;
    }
    onerror();
   };
   xhr.onerror = onerror;
   xhr.send(null);
  };
 }
} else  {
 throw new Error("environment detection error");
}

if (ENVIRONMENT_IS_NODE) {
 if (typeof performance == "undefined") {
  global.performance = require("perf_hooks").performance;
 }
}

var defaultPrint = console.log.bind(console);

var defaultPrintErr = console.error.bind(console);

if (ENVIRONMENT_IS_NODE) {
 defaultPrint = (...args) => fs.writeSync(1, args.join(" ") + "\n");
 defaultPrintErr = (...args) => fs.writeSync(2, args.join(" ") + "\n");
}

var out = Module["print"] || defaultPrint;

var err = Module["printErr"] || defaultPrintErr;

Object.assign(Module, moduleOverrides);

moduleOverrides = null;

checkIncomingModuleAPI();

if (Module["arguments"]) arguments_ = Module["arguments"];

legacyModuleProp("arguments", "arguments_");

if (Module["thisProgram"]) thisProgram = Module["thisProgram"];

legacyModuleProp("thisProgram", "thisProgram");

if (Module["quit"]) quit_ = Module["quit"];

legacyModuleProp("quit", "quit_");

assert(typeof Module["memoryInitializerPrefixURL"] == "undefined", "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead");

assert(typeof Module["pthreadMainPrefixURL"] == "undefined", "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead");

assert(typeof Module["cdInitializerPrefixURL"] == "undefined", "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead");

assert(typeof Module["filePackagePrefixURL"] == "undefined", "Module.filePackagePrefixURL option was removed, use Module.locateFile instead");

assert(typeof Module["read"] == "undefined", "Module.read option was removed (modify read_ in JS)");

assert(typeof Module["readAsync"] == "undefined", "Module.readAsync option was removed (modify readAsync in JS)");

assert(typeof Module["readBinary"] == "undefined", "Module.readBinary option was removed (modify readBinary in JS)");

assert(typeof Module["setWindowTitle"] == "undefined", "Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)");

assert(typeof Module["TOTAL_MEMORY"] == "undefined", "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY");

legacyModuleProp("asm", "wasmExports");

legacyModuleProp("read", "read_");

legacyModuleProp("readAsync", "readAsync");

legacyModuleProp("readBinary", "readBinary");

legacyModuleProp("setWindowTitle", "setWindowTitle");

var IDBFS = "IDBFS is no longer included by default; build with -lidbfs.js";

var PROXYFS = "PROXYFS is no longer included by default; build with -lproxyfs.js";

var WORKERFS = "WORKERFS is no longer included by default; build with -lworkerfs.js";

var FETCHFS = "FETCHFS is no longer included by default; build with -lfetchfs.js";

var ICASEFS = "ICASEFS is no longer included by default; build with -licasefs.js";

var JSFILEFS = "JSFILEFS is no longer included by default; build with -ljsfilefs.js";

var OPFS = "OPFS is no longer included by default; build with -lopfs.js";

var NODEFS = "NODEFS is no longer included by default; build with -lnodefs.js";

assert(ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER || ENVIRONMENT_IS_NODE, "Pthreads do not work in this environment yet (need Web Workers, or an alternative to them)");

assert(!ENVIRONMENT_IS_SHELL, "shell environment detected but not enabled at build time.  Add `shell` to `-sENVIRONMENT` to enable.");

var wasmBinary;

if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];

legacyModuleProp("wasmBinary", "wasmBinary");

if (typeof WebAssembly != "object") {
 abort("no native wasm support detected");
}

var wasmMemory;

var wasmModule;

var ABORT = false;

var EXITSTATUS;

/** @type {function(*, string=)} */ function assert(condition, text) {
 if (!condition) {
  abort("Assertion failed" + (text ? ": " + text : ""));
 }
}

var HEAP, /** @type {!Int8Array} */ HEAP8, /** @type {!Uint8Array} */ HEAPU8, /** @type {!Int16Array} */ HEAP16, /** @type {!Uint16Array} */ HEAPU16, /** @type {!Int32Array} */ HEAP32, /** @type {!Uint32Array} */ HEAPU32, /** @type {!Float32Array} */ HEAPF32, /** @type {!Float64Array} */ HEAPF64;

function updateMemoryViews() {
 var b = wasmMemory.buffer;
 Module["HEAP8"] = HEAP8 = new Int8Array(b);
 Module["HEAP16"] = HEAP16 = new Int16Array(b);
 Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
 Module["HEAPU16"] = HEAPU16 = new Uint16Array(b);
 Module["HEAP32"] = HEAP32 = new Int32Array(b);
 Module["HEAPU32"] = HEAPU32 = new Uint32Array(b);
 Module["HEAPF32"] = HEAPF32 = new Float32Array(b);
 Module["HEAPF64"] = HEAPF64 = new Float64Array(b);
}

assert(!Module["STACK_SIZE"], "STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time");

assert(typeof Int32Array != "undefined" && typeof Float64Array !== "undefined" && Int32Array.prototype.subarray != undefined && Int32Array.prototype.set != undefined, "JS engine does not provide full typed array support");

var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;

legacyModuleProp("INITIAL_MEMORY", "INITIAL_MEMORY");

assert(INITIAL_MEMORY >= 1048576, "INITIAL_MEMORY should be larger than STACK_SIZE, was " + INITIAL_MEMORY + "! (STACK_SIZE=" + 1048576 + ")");

if (ENVIRONMENT_IS_PTHREAD) {
 wasmMemory = Module["wasmMemory"];
} else {
 if (Module["wasmMemory"]) {
  wasmMemory = Module["wasmMemory"];
 } else {
  wasmMemory = new WebAssembly.Memory({
   "initial": INITIAL_MEMORY / 65536,
   "maximum": 2147483648 / 65536,
   "shared": true
  });
  if (!(wasmMemory.buffer instanceof SharedArrayBuffer)) {
   err("requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag");
   if (ENVIRONMENT_IS_NODE) {
    err("(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and/or recent version)");
   }
   throw Error("bad memory");
  }
 }
}

updateMemoryViews();

INITIAL_MEMORY = wasmMemory.buffer.byteLength;

assert(INITIAL_MEMORY % 65536 === 0);

function writeStackCookie() {
 var max = _emscripten_stack_get_end();
 assert((max & 3) == 0);
 if (max == 0) {
  max += 4;
 }
 GROWABLE_HEAP_U32()[((max) >> 2)] = 34821223;
 GROWABLE_HEAP_U32()[(((max) + (4)) >> 2)] = 2310721022;
 GROWABLE_HEAP_U32()[((0) >> 2)] = 1668509029;
}

function checkStackCookie() {
 if (ABORT) return;
 var max = _emscripten_stack_get_end();
 if (max == 0) {
  max += 4;
 }
 var cookie1 = GROWABLE_HEAP_U32()[((max) >> 2)];
 var cookie2 = GROWABLE_HEAP_U32()[(((max) + (4)) >> 2)];
 if (cookie1 != 34821223 || cookie2 != 2310721022) {
  abort(`Stack overflow! Stack cookie has been overwritten at ${ptrToString(max)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${ptrToString(cookie2)} ${ptrToString(cookie1)}`);
 }
 if (GROWABLE_HEAP_U32()[((0) >> 2)] != 1668509029) /* 'emsc' */ {
  abort("Runtime error: The application has corrupted its heap memory area (address zero)!");
 }
}

(function() {
 var h16 = new Int16Array(1);
 var h8 = new Int8Array(h16.buffer);
 h16[0] = 25459;
 if (h8[0] !== 115 || h8[1] !== 99) throw "Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)";
})();

var __ATPRERUN__ = [];

var __ATINIT__ = [];

var __ATEXIT__ = [];

var __ATPOSTRUN__ = [];

var runtimeInitialized = false;

function preRun() {
 assert(!ENVIRONMENT_IS_PTHREAD);
 if (Module["preRun"]) {
  if (typeof Module["preRun"] == "function") Module["preRun"] = [ Module["preRun"] ];
  while (Module["preRun"].length) {
   addOnPreRun(Module["preRun"].shift());
  }
 }
 callRuntimeCallbacks(__ATPRERUN__);
}

function initRuntime() {
 assert(!runtimeInitialized);
 runtimeInitialized = true;
 if (ENVIRONMENT_IS_PTHREAD) return;
 checkStackCookie();
 callRuntimeCallbacks(__ATINIT__);
}

function postRun() {
 checkStackCookie();
 if (ENVIRONMENT_IS_PTHREAD) return;
 if (Module["postRun"]) {
  if (typeof Module["postRun"] == "function") Module["postRun"] = [ Module["postRun"] ];
  while (Module["postRun"].length) {
   addOnPostRun(Module["postRun"].shift());
  }
 }
 callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
 __ATPRERUN__.unshift(cb);
}

function addOnInit(cb) {
 __ATINIT__.unshift(cb);
}

function addOnExit(cb) {}

function addOnPostRun(cb) {
 __ATPOSTRUN__.unshift(cb);
}

assert(Math.imul, "This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");

assert(Math.fround, "This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");

assert(Math.clz32, "This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");

assert(Math.trunc, "This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");

var runDependencies = 0;

var runDependencyWatcher = null;

var dependenciesFulfilled = null;

var runDependencyTracking = {};

function getUniqueRunDependency(id) {
 var orig = id;
 while (1) {
  if (!runDependencyTracking[id]) return id;
  id = orig + Math.random();
 }
}

function addRunDependency(id) {
 runDependencies++;
 Module["monitorRunDependencies"]?.(runDependencies);
 if (id) {
  assert(!runDependencyTracking[id]);
  runDependencyTracking[id] = 1;
  if (runDependencyWatcher === null && typeof setInterval != "undefined") {
   runDependencyWatcher = setInterval(() => {
    if (ABORT) {
     clearInterval(runDependencyWatcher);
     runDependencyWatcher = null;
     return;
    }
    var shown = false;
    for (var dep in runDependencyTracking) {
     if (!shown) {
      shown = true;
      err("still waiting on run dependencies:");
     }
     err(`dependency: ${dep}`);
    }
    if (shown) {
     err("(end of list)");
    }
   }, 1e4);
  }
 } else {
  err("warning: run dependency added without ID");
 }
}

function removeRunDependency(id) {
 runDependencies--;
 Module["monitorRunDependencies"]?.(runDependencies);
 if (id) {
  assert(runDependencyTracking[id]);
  delete runDependencyTracking[id];
 } else {
  err("warning: run dependency removed without ID");
 }
 if (runDependencies == 0) {
  if (runDependencyWatcher !== null) {
   clearInterval(runDependencyWatcher);
   runDependencyWatcher = null;
  }
  if (dependenciesFulfilled) {
   var callback = dependenciesFulfilled;
   dependenciesFulfilled = null;
   callback();
  }
 }
}

/** @param {string|number=} what */ function abort(what) {
 Module["onAbort"]?.(what);
 what = "Aborted(" + what + ")";
 err(what);
 ABORT = true;
 EXITSTATUS = 1;
 /** @suppress {checkTypes} */ var e = new WebAssembly.RuntimeError(what);
 readyPromiseReject(e);
 throw e;
}

var FS = {
 error() {
  abort("Filesystem support (FS) was not included. The problem is that you are using files from JS, but files were not used from C/C++, so filesystem support was not auto-included. You can force-include filesystem support with -sFORCE_FILESYSTEM");
 },
 init() {
  FS.error();
 },
 createDataFile() {
  FS.error();
 },
 createPreloadedFile() {
  FS.error();
 },
 createLazyFile() {
  FS.error();
 },
 open() {
  FS.error();
 },
 mkdev() {
  FS.error();
 },
 registerDevice() {
  FS.error();
 },
 analyzePath() {
  FS.error();
 },
 ErrnoError() {
  FS.error();
 }
};

Module["FS_createDataFile"] = FS.createDataFile;

Module["FS_createPreloadedFile"] = FS.createPreloadedFile;

var dataURIPrefix = "data:application/octet-stream;base64,";

/**
 * Indicates whether filename is a base64 data URI.
 * @noinline
 */ var isDataURI = filename => filename.startsWith(dataURIPrefix);

/**
 * Indicates whether filename is delivered via file protocol (as opposed to http/https)
 * @noinline
 */ var isFileURI = filename => filename.startsWith("file://");

function createExportWrapper(name) {
 return function() {
  assert(runtimeInitialized, `native function \`${name}\` called before runtime initialization`);
  var f = wasmExports[name];
  assert(f, `exported native function \`${name}\` not found`);
  return f.apply(null, arguments);
 };
}

class EmscriptenEH extends Error {}

class EmscriptenSjLj extends EmscriptenEH {}

class CppException extends EmscriptenEH {
 constructor(excPtr) {
  super(excPtr);
  this.excPtr = excPtr;
  const excInfo = getExceptionMessage(excPtr);
  this.name = excInfo[0];
  this.message = excInfo[1];
 }
}

var wasmBinaryFile;

if (Module["locateFile"]) {
 wasmBinaryFile = "example.wasm";
 if (!isDataURI(wasmBinaryFile)) {
  wasmBinaryFile = locateFile(wasmBinaryFile);
 }
} else {
 wasmBinaryFile = new URL("example.wasm", import.meta.url).href;
}

function getBinarySync(file) {
 if (file == wasmBinaryFile && wasmBinary) {
  return new Uint8Array(wasmBinary);
 }
 if (readBinary) {
  return readBinary(file);
 }
 throw "both async and sync fetching of the wasm failed";
}

function getBinaryPromise(binaryFile) {
 if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
  if (typeof fetch == "function" && !isFileURI(binaryFile)) {
   return fetch(binaryFile, {
    credentials: "same-origin"
   }).then(response => {
    if (!response["ok"]) {
     throw `failed to load wasm binary file at '${binaryFile}'`;
    }
    return response["arrayBuffer"]();
   }).catch(() => getBinarySync(binaryFile));
  } else if (readAsync) {
   return new Promise((resolve, reject) => {
    readAsync(binaryFile, response => resolve(new Uint8Array(/** @type{!ArrayBuffer} */ (response))), reject);
   });
  }
 }
 return Promise.resolve().then(() => getBinarySync(binaryFile));
}

function instantiateArrayBuffer(binaryFile, imports, receiver) {
 return getBinaryPromise(binaryFile).then(binary => WebAssembly.instantiate(binary, imports)).then(instance => instance).then(receiver, reason => {
  err(`failed to asynchronously prepare wasm: ${reason}`);
  if (isFileURI(wasmBinaryFile)) {
   err(`warning: Loading from a file URI (${wasmBinaryFile}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`);
  }
  abort(reason);
 });
}

function instantiateAsync(binary, binaryFile, imports, callback) {
 if (!binary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(binaryFile) &&  !isFileURI(binaryFile) &&  !ENVIRONMENT_IS_NODE && typeof fetch == "function") {
  return fetch(binaryFile, {
   credentials: "same-origin"
  }).then(response => {
   /** @suppress {checkTypes} */ var result = WebAssembly.instantiateStreaming(response, imports);
   return result.then(callback, function(reason) {
    err(`wasm streaming compile failed: ${reason}`);
    err("falling back to ArrayBuffer instantiation");
    return instantiateArrayBuffer(binaryFile, imports, callback);
   });
  });
 }
 return instantiateArrayBuffer(binaryFile, imports, callback);
}

function createWasm() {
 var info = {
  "env": wasmImports,
  "wasi_snapshot_preview1": wasmImports
 };
 /** @param {WebAssembly.Module=} module*/ function receiveInstance(instance, module) {
  wasmExports = instance.exports;
  registerTLSInit(wasmExports["_emscripten_tls_init"]);
  wasmTable = wasmExports["__indirect_function_table"];
  assert(wasmTable, "table not found in wasm exports");
  addOnInit(wasmExports["__wasm_call_ctors"]);
  wasmModule = module;
  removeRunDependency("wasm-instantiate");
  return wasmExports;
 }
 addRunDependency("wasm-instantiate");
 var trueModule = Module;
 function receiveInstantiationResult(result) {
  assert(Module === trueModule, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?");
  trueModule = null;
  receiveInstance(result["instance"], result["module"]);
 }
 if (Module["instantiateWasm"]) {
  try {
   return Module["instantiateWasm"](info, receiveInstance);
  } catch (e) {
   err(`Module.instantiateWasm callback failed with error: ${e}`);
   readyPromiseReject(e);
  }
 }
 instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject);
 return {};
}

var tempDouble;

var tempI64;

function legacyModuleProp(prop, newName, incomming = true) {
 if (!Object.getOwnPropertyDescriptor(Module, prop)) {
  Object.defineProperty(Module, prop, {
   configurable: true,
   get() {
    let extra = incomming ? " (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)" : "";
    abort(`\`Module.${prop}\` has been replaced by \`${newName}\`` + extra);
   }
  });
 }
}

function ignoredModuleProp(prop) {
 if (Object.getOwnPropertyDescriptor(Module, prop)) {
  abort(`\`Module.${prop}\` was supplied but \`${prop}\` not included in INCOMING_MODULE_JS_API`);
 }
}

function isExportedByForceFilesystem(name) {
 return name === "FS_createPath" || name === "FS_createDataFile" || name === "FS_createPreloadedFile" || name === "FS_unlink" || name === "addRunDependency" ||  name === "FS_createLazyFile" || name === "FS_createDevice" || name === "removeRunDependency";
}

function missingGlobal(sym, msg) {
 if (typeof globalThis !== "undefined") {
  Object.defineProperty(globalThis, sym, {
   configurable: true,
   get() {
    warnOnce(`\`${sym}\` is not longer defined by emscripten. ${msg}`);
    return undefined;
   }
  });
 }
}

missingGlobal("buffer", "Please use HEAP8.buffer or wasmMemory.buffer");

missingGlobal("asm", "Please use wasmExports instead");

function missingLibrarySymbol(sym) {
 if (typeof globalThis !== "undefined" && !Object.getOwnPropertyDescriptor(globalThis, sym)) {
  Object.defineProperty(globalThis, sym, {
   configurable: true,
   get() {
    var msg = `\`${sym}\` is a library symbol and not included by default; add it to your library.js __deps or to DEFAULT_LIBRARY_FUNCS_TO_INCLUDE on the command line`;
    var librarySymbol = sym;
    if (!librarySymbol.startsWith("_")) {
     librarySymbol = "$" + sym;
    }
    msg += ` (e.g. -sDEFAULT_LIBRARY_FUNCS_TO_INCLUDE='${librarySymbol}')`;
    if (isExportedByForceFilesystem(sym)) {
     msg += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you";
    }
    warnOnce(msg);
    return undefined;
   }
  });
 }
 unexportedRuntimeSymbol(sym);
}

function unexportedRuntimeSymbol(sym) {
 if (!Object.getOwnPropertyDescriptor(Module, sym)) {
  Object.defineProperty(Module, sym, {
   configurable: true,
   get() {
    var msg = `'${sym}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
    if (isExportedByForceFilesystem(sym)) {
     msg += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you";
    }
    abort(msg);
   }
  });
 }
}

function dbg(text) {
 if (ENVIRONMENT_IS_NODE) {
  fs.writeSync(2, Array.from(arguments).join(" ") + "\n");
 } else  console.warn.apply(console, arguments);
}

/** @constructor */ function ExitStatus(status) {
 this.name = "ExitStatus";
 this.message = `Program terminated with exit(${status})`;
 this.status = status;
}

var terminateWorker = worker => {
 worker.terminate();
 worker.onmessage = e => {
  var cmd = e["data"]["cmd"];
  err(`received "${cmd}" command from terminated worker: ${worker.workerID}`);
 };
};

var killThread = pthread_ptr => {
 assert(!ENVIRONMENT_IS_PTHREAD, "Internal Error! killThread() can only ever be called from main application thread!");
 assert(pthread_ptr, "Internal Error! Null pthread_ptr in killThread!");
 var worker = PThread.pthreads[pthread_ptr];
 delete PThread.pthreads[pthread_ptr];
 terminateWorker(worker);
 __emscripten_thread_free_data(pthread_ptr);
 PThread.runningWorkers.splice(PThread.runningWorkers.indexOf(worker), 1);
 worker.pthread_ptr = 0;
};

var cancelThread = pthread_ptr => {
 assert(!ENVIRONMENT_IS_PTHREAD, "Internal Error! cancelThread() can only ever be called from main application thread!");
 assert(pthread_ptr, "Internal Error! Null pthread_ptr in cancelThread!");
 var worker = PThread.pthreads[pthread_ptr];
 worker.postMessage({
  "cmd": "cancel"
 });
};

var cleanupThread = pthread_ptr => {
 assert(!ENVIRONMENT_IS_PTHREAD, "Internal Error! cleanupThread() can only ever be called from main application thread!");
 assert(pthread_ptr, "Internal Error! Null pthread_ptr in cleanupThread!");
 var worker = PThread.pthreads[pthread_ptr];
 assert(worker);
 PThread.returnWorkerToPool(worker);
};

var zeroMemory = (address, size) => {
 GROWABLE_HEAP_U8().fill(0, address, address + size);
 return address;
};

var spawnThread = threadParams => {
 assert(!ENVIRONMENT_IS_PTHREAD, "Internal Error! spawnThread() can only ever be called from main application thread!");
 assert(threadParams.pthread_ptr, "Internal error, no pthread ptr!");
 var worker = PThread.getNewWorker();
 if (!worker) {
  return 6;
 }
 assert(!worker.pthread_ptr, "Internal error!");
 PThread.runningWorkers.push(worker);
 PThread.pthreads[threadParams.pthread_ptr] = worker;
 worker.pthread_ptr = threadParams.pthread_ptr;
 var msg = {
  "cmd": "run",
  "start_routine": threadParams.startRoutine,
  "arg": threadParams.arg,
  "pthread_ptr": threadParams.pthread_ptr
 };
 if (ENVIRONMENT_IS_NODE) {
  worker.unref();
 }
 worker.postMessage(msg, threadParams.transferList);
 return 0;
};

var runtimeKeepaliveCounter = 0;

var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;

var withStackSave = f => {
 var stack = stackSave();
 var ret = f();
 stackRestore(stack);
 return ret;
};

var convertI32PairToI53Checked = (lo, hi) => {
 assert(lo == (lo >>> 0) || lo == (lo | 0));
 assert(hi === (hi | 0));
 return ((hi + 2097152) >>> 0 < 4194305 - !!lo) ? (lo >>> 0) + hi * 4294967296 : NaN;
};

/** @type{function(number, (number|boolean), ...(number|boolean))} */ var proxyToMainThread = function(index, sync) {
 var numCallArgs = arguments.length - 2;
 var outerArgs = arguments;
 return withStackSave(() => {
  var serializedNumCallArgs = numCallArgs;
  var args = stackAlloc(serializedNumCallArgs * 8);
  var b = ((args) >> 3);
  for (var i = 0; i < numCallArgs; i++) {
   var arg = outerArgs[2 + i];
   GROWABLE_HEAP_F64()[b + i] = arg;
  }
  return __emscripten_run_on_main_thread_js(index, serializedNumCallArgs, args, sync);
 });
};

function _proc_exit(code) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(0, 1, code);
 EXITSTATUS = code;
 if (!keepRuntimeAlive()) {
  PThread.terminateAllThreads();
  Module["onExit"]?.(code);
  ABORT = true;
 }
 quit_(code, new ExitStatus(code));
}

/** @param {boolean|number=} implicit */ var exitJS = (status, implicit) => {
 EXITSTATUS = status;
 checkUnflushedContent();
 if (ENVIRONMENT_IS_PTHREAD) {
  assert(!implicit);
  exitOnMainThread(status);
  throw "unwind";
 }
 if (keepRuntimeAlive() && !implicit) {
  var msg = `program exited (with status: ${status}), but keepRuntimeAlive() is set (counter=${runtimeKeepaliveCounter}) due to an async operation, so halting execution but not exiting the runtime or preventing further async execution (you can use emscripten_force_exit, if you want to force a true shutdown)`;
  readyPromiseReject(msg);
  err(msg);
 }
 _proc_exit(status);
};

var _exit = exitJS;

var ptrToString = ptr => {
 assert(typeof ptr === "number");
 ptr >>>= 0;
 return "0x" + ptr.toString(16).padStart(8, "0");
};

var handleException = e => {
 if (e instanceof ExitStatus || e == "unwind") {
  return EXITSTATUS;
 }
 checkStackCookie();
 if (e instanceof WebAssembly.RuntimeError) {
  if (_emscripten_stack_get_current() <= 0) {
   err("Stack overflow detected.  You can try increasing -sSTACK_SIZE (currently set to 1048576)");
  }
 }
 quit_(1, e);
};

var PThread = {
 unusedWorkers: [],
 runningWorkers: [],
 tlsInitFunctions: [],
 pthreads: {},
 nextWorkerID: 1,
 debugInit() {
  function pthreadLogPrefix() {
   var t = 0;
   if (runtimeInitialized && typeof _pthread_self != "undefined") {
    t = _pthread_self();
   }
   return "w:" + (Module["workerID"] || 0) + ",t:" + ptrToString(t) + ": ";
  }
  var origDbg = dbg;
  dbg = message => origDbg(pthreadLogPrefix() + message);
 },
 init() {
  PThread.debugInit();
  if (ENVIRONMENT_IS_PTHREAD) {
   PThread.initWorker();
  } else {
   PThread.initMainThread();
  }
 },
 initMainThread() {
  var pthreadPoolSize = 4;
  while (pthreadPoolSize--) {
   PThread.allocateUnusedWorker();
  }
  addOnPreRun(() => {
   addRunDependency("loading-workers");
   PThread.loadWasmModuleToAllWorkers(() => removeRunDependency("loading-workers"));
  });
 },
 initWorker() {
  PThread["receiveObjectTransfer"] = PThread.receiveObjectTransfer;
  PThread["threadInitTLS"] = PThread.threadInitTLS;
  PThread["setExitStatus"] = PThread.setExitStatus;
  noExitRuntime = false;
 },
 setExitStatus: status => EXITSTATUS = status,
 terminateAllThreads__deps: [ "$terminateWorker" ],
 terminateAllThreads: () => {
  assert(!ENVIRONMENT_IS_PTHREAD, "Internal Error! terminateAllThreads() can only ever be called from main application thread!");
  for (var worker of PThread.runningWorkers) {
   terminateWorker(worker);
  }
  for (var worker of PThread.unusedWorkers) {
   terminateWorker(worker);
  }
  PThread.unusedWorkers = [];
  PThread.runningWorkers = [];
  PThread.pthreads = [];
 },
 returnWorkerToPool: worker => {
  var pthread_ptr = worker.pthread_ptr;
  delete PThread.pthreads[pthread_ptr];
  PThread.unusedWorkers.push(worker);
  PThread.runningWorkers.splice(PThread.runningWorkers.indexOf(worker), 1);
  worker.pthread_ptr = 0;
  __emscripten_thread_free_data(pthread_ptr);
 },
 receiveObjectTransfer(data) {},
 threadInitTLS() {
  PThread.tlsInitFunctions.forEach(f => f());
 },
 loadWasmModuleToWorker: worker => new Promise(onFinishedLoading => {
  worker.onmessage = e => {
   var d = e["data"];
   var cmd = d["cmd"];
   if (d["targetThread"] && d["targetThread"] != _pthread_self()) {
    var targetWorker = PThread.pthreads[d["targetThread"]];
    if (targetWorker) {
     targetWorker.postMessage(d, d["transferList"]);
    } else {
     err(`Internal error! Worker sent a message "${cmd}" to target pthread ${d["targetThread"]}, but that thread no longer exists!`);
    }
    return;
   }
   if (cmd === "checkMailbox") {
    checkMailbox();
   } else if (cmd === "spawnThread") {
    spawnThread(d);
   } else if (cmd === "cleanupThread") {
    cleanupThread(d["thread"]);
   } else if (cmd === "killThread") {
    killThread(d["thread"]);
   } else if (cmd === "cancelThread") {
    cancelThread(d["thread"]);
   } else if (cmd === "loaded") {
    worker.loaded = true;
    if (ENVIRONMENT_IS_NODE && !worker.pthread_ptr) {
     worker.unref();
    }
    onFinishedLoading(worker);
   } else if (cmd === "alert") {
    alert(`Thread ${d["threadId"]}: ${d["text"]}`);
   } else if (d.target === "setimmediate") {
    worker.postMessage(d);
   } else if (cmd === "callHandler") {
    Module[d["handler"]](...d["args"]);
   } else if (cmd) {
    err(`worker sent an unknown command ${cmd}`);
   }
  };
  worker.onerror = e => {
   var message = "worker sent an error!";
   if (worker.pthread_ptr) {
    message = `Pthread ${ptrToString(worker.pthread_ptr)} sent an error!`;
   }
   err(`${message} ${e.filename}:${e.lineno}: ${e.message}`);
   throw e;
  };
  if (ENVIRONMENT_IS_NODE) {
   worker.on("message", data => worker.onmessage({
    data: data
   }));
   worker.on("error", e => worker.onerror(e));
  }
  assert(wasmMemory instanceof WebAssembly.Memory, "WebAssembly memory should have been loaded by now!");
  assert(wasmModule instanceof WebAssembly.Module, "WebAssembly Module should have been loaded by now!");
  var handlers = [];
  var knownHandlers = [ "onExit", "onAbort", "print", "printErr" ];
  for (var handler of knownHandlers) {
   if (Module.hasOwnProperty(handler)) {
    handlers.push(handler);
   }
  }
  worker.workerID = PThread.nextWorkerID++;
  worker.postMessage({
   "cmd": "load",
   "handlers": handlers,
   "urlOrBlob": Module["mainScriptUrlOrBlob"],
   "wasmMemory": wasmMemory,
   "wasmModule": wasmModule,
   "workerID": worker.workerID
  });
 }),
 loadWasmModuleToAllWorkers(onMaybeReady) {
  if (ENVIRONMENT_IS_PTHREAD) {
   return onMaybeReady();
  }
  let pthreadPoolReady = Promise.all(PThread.unusedWorkers.map(PThread.loadWasmModuleToWorker));
  pthreadPoolReady.then(onMaybeReady);
 },
 allocateUnusedWorker() {
  var worker;
  if (!Module["locateFile"]) {
   worker = new Worker(new URL("example.worker.mjs", import.meta.url), {
    type: "module"
   });
  } else {
   var pthreadMainJs = locateFile("example.worker.mjs");
   worker = new Worker(pthreadMainJs, {
    type: "module"
   });
  }
  PThread.unusedWorkers.push(worker);
 },
 getNewWorker() {
  if (PThread.unusedWorkers.length == 0) {
   if (!ENVIRONMENT_IS_NODE) {
    err("Tried to spawn a new thread, but the thread pool is exhausted.\n" + "This might result in a deadlock unless some threads eventually exit or the code explicitly breaks out to the event loop.\n" + "If you want to increase the pool size, use setting `-sPTHREAD_POOL_SIZE=...`." + "\nIf you want to throw an explicit error instead of the risk of deadlocking in those cases, use setting `-sPTHREAD_POOL_SIZE_STRICT=2`.");
   }
   PThread.allocateUnusedWorker();
   PThread.loadWasmModuleToWorker(PThread.unusedWorkers[0]);
  }
  return PThread.unusedWorkers.pop();
 }
};

Module["PThread"] = PThread;

var callRuntimeCallbacks = callbacks => {
 while (callbacks.length > 0) {
  callbacks.shift()(Module);
 }
};

var decrementExceptionRefcount = ptr => ___cxa_decrement_exception_refcount(ptr);

var establishStackSpace = () => {
 var pthread_ptr = _pthread_self();
 var stackHigh = GROWABLE_HEAP_U32()[(((pthread_ptr) + (52)) >> 2)];
 var stackSize = GROWABLE_HEAP_U32()[(((pthread_ptr) + (56)) >> 2)];
 var stackLow = stackHigh - stackSize;
 assert(stackHigh != 0);
 assert(stackLow != 0);
 assert(stackHigh > stackLow, "stackHigh must be higher then stackLow");
 _emscripten_stack_set_limits(stackHigh, stackLow);
 stackRestore(stackHigh);
 writeStackCookie();
};

Module["establishStackSpace"] = establishStackSpace;

function exitOnMainThread(returnCode) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(1, 0, returnCode);
 _exit(returnCode);
}

var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : undefined;

/**
     * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
     * array that contains uint8 values, returns a copy of that string as a
     * Javascript String object.
     * heapOrArray is either a regular array, or a JavaScript typed array view.
     * @param {number} idx
     * @param {number=} maxBytesToRead
     * @return {string}
     */ var UTF8ArrayToString = (heapOrArray, idx, maxBytesToRead) => {
 var endIdx = idx + maxBytesToRead;
 var endPtr = idx;
 while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
 if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
  return UTF8Decoder.decode(heapOrArray.buffer instanceof SharedArrayBuffer ? heapOrArray.slice(idx, endPtr) : heapOrArray.subarray(idx, endPtr));
 }
 var str = "";
 while (idx < endPtr) {
  var u0 = heapOrArray[idx++];
  if (!(u0 & 128)) {
   str += String.fromCharCode(u0);
   continue;
  }
  var u1 = heapOrArray[idx++] & 63;
  if ((u0 & 224) == 192) {
   str += String.fromCharCode(((u0 & 31) << 6) | u1);
   continue;
  }
  var u2 = heapOrArray[idx++] & 63;
  if ((u0 & 240) == 224) {
   u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
  } else {
   if ((u0 & 248) != 240) warnOnce("Invalid UTF-8 leading byte " + ptrToString(u0) + " encountered when deserializing a UTF-8 string in wasm memory to a JS string!");
   u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
  }
  if (u0 < 65536) {
   str += String.fromCharCode(u0);
  } else {
   var ch = u0 - 65536;
   str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
  }
 }
 return str;
};

/**
     * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
     * emscripten HEAP, returns a copy of that string as a Javascript String object.
     *
     * @param {number} ptr
     * @param {number=} maxBytesToRead - An optional length that specifies the
     *   maximum number of bytes to read. You can omit this parameter to scan the
     *   string until the first 0 byte. If maxBytesToRead is passed, and the string
     *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
     *   string will cut short at that byte index (i.e. maxBytesToRead will not
     *   produce a string of exact length [ptr, ptr+maxBytesToRead[) N.B. mixing
     *   frequent uses of UTF8ToString() with and without maxBytesToRead may throw
     *   JS JIT optimizations off, so it is worth to consider consistently using one
     * @return {string}
     */ var UTF8ToString = (ptr, maxBytesToRead) => {
 assert(typeof ptr == "number", `UTF8ToString expects a number (got ${typeof ptr})`);
 return ptr ? UTF8ArrayToString(GROWABLE_HEAP_U8(), ptr, maxBytesToRead) : "";
};

var getExceptionMessageCommon = ptr => withStackSave(() => {
 var type_addr_addr = stackAlloc(4);
 var message_addr_addr = stackAlloc(4);
 ___get_exception_message(ptr, type_addr_addr, message_addr_addr);
 var type_addr = GROWABLE_HEAP_U32()[((type_addr_addr) >> 2)];
 var message_addr = GROWABLE_HEAP_U32()[((message_addr_addr) >> 2)];
 var type = UTF8ToString(type_addr);
 _free(type_addr);
 var message;
 if (message_addr) {
  message = UTF8ToString(message_addr);
  _free(message_addr);
 }
 return [ type, message ];
});

var getExceptionMessage = ptr => getExceptionMessageCommon(ptr);

Module["getExceptionMessage"] = getExceptionMessage;

/**
     * @param {number} ptr
     * @param {string} type
     */ function getValue(ptr, type = "i8") {
 if (type.endsWith("*")) type = "*";
 switch (type) {
 case "i1":
  return GROWABLE_HEAP_I8()[((ptr) >> 0)];

 case "i8":
  return GROWABLE_HEAP_I8()[((ptr) >> 0)];

 case "i16":
  return GROWABLE_HEAP_I16()[((ptr) >> 1)];

 case "i32":
  return GROWABLE_HEAP_I32()[((ptr) >> 2)];

 case "i64":
  abort("to do getValue(i64) use WASM_BIGINT");

 case "float":
  return GROWABLE_HEAP_F32()[((ptr) >> 2)];

 case "double":
  return GROWABLE_HEAP_F64()[((ptr) >> 3)];

 case "*":
  return GROWABLE_HEAP_U32()[((ptr) >> 2)];

 default:
  abort(`invalid type for getValue: ${type}`);
 }
}

var incrementExceptionRefcount = ptr => ___cxa_increment_exception_refcount(ptr);

var wasmTableMirror = [];

var wasmTable;

var getWasmTableEntry = funcPtr => {
 var func = wasmTableMirror[funcPtr];
 if (!func) {
  if (funcPtr >= wasmTableMirror.length) wasmTableMirror.length = funcPtr + 1;
  wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
 }
 assert(wasmTable.get(funcPtr) == func, "JavaScript-side Wasm function table mirror is out of date!");
 return func;
};

var invokeEntryPoint = (ptr, arg) => {
 var result = getWasmTableEntry(ptr)(arg);
 checkStackCookie();
 function finish(result) {
  if (keepRuntimeAlive()) {
   PThread.setExitStatus(result);
  } else {
   __emscripten_thread_exit(result);
  }
 }
 finish(result);
};

Module["invokeEntryPoint"] = invokeEntryPoint;

var noExitRuntime = Module["noExitRuntime"] || true;

var registerTLSInit = tlsInitFunc => PThread.tlsInitFunctions.push(tlsInitFunc);

/**
     * @param {number} ptr
     * @param {number} value
     * @param {string} type
     */ function setValue(ptr, value, type = "i8") {
 if (type.endsWith("*")) type = "*";
 switch (type) {
 case "i1":
  GROWABLE_HEAP_I8()[((ptr) >> 0)] = value;
  break;

 case "i8":
  GROWABLE_HEAP_I8()[((ptr) >> 0)] = value;
  break;

 case "i16":
  GROWABLE_HEAP_I16()[((ptr) >> 1)] = value;
  break;

 case "i32":
  GROWABLE_HEAP_I32()[((ptr) >> 2)] = value;
  break;

 case "i64":
  abort("to do setValue(i64) use WASM_BIGINT");

 case "float":
  GROWABLE_HEAP_F32()[((ptr) >> 2)] = value;
  break;

 case "double":
  GROWABLE_HEAP_F64()[((ptr) >> 3)] = value;
  break;

 case "*":
  GROWABLE_HEAP_U32()[((ptr) >> 2)] = value;
  break;

 default:
  abort(`invalid type for setValue: ${type}`);
 }
}

var warnOnce = text => {
 warnOnce.shown ||= {};
 if (!warnOnce.shown[text]) {
  warnOnce.shown[text] = 1;
  if (ENVIRONMENT_IS_NODE) text = "warning: " + text;
  err(text);
 }
};

var ___assert_fail = (condition, filename, line, func) => {
 abort(`Assertion failed: ${UTF8ToString(condition)}, at: ` + [ filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function" ]);
};

var exceptionCaught = [];

var uncaughtExceptionCount = 0;

var ___cxa_begin_catch = ptr => {
 var info = new ExceptionInfo(ptr);
 if (!info.get_caught()) {
  info.set_caught(true);
  uncaughtExceptionCount--;
 }
 info.set_rethrown(false);
 exceptionCaught.push(info);
 ___cxa_increment_exception_refcount(info.excPtr);
 return info.get_exception_ptr();
};

var ___cxa_current_primary_exception = () => {
 if (!exceptionCaught.length) {
  return 0;
 }
 var info = exceptionCaught[exceptionCaught.length - 1];
 ___cxa_increment_exception_refcount(info.excPtr);
 return info.excPtr;
};

var exceptionLast = 0;

var ___cxa_end_catch = () => {
 _setThrew(0, 0);
 assert(exceptionCaught.length > 0);
 var info = exceptionCaught.pop();
 ___cxa_decrement_exception_refcount(info.excPtr);
 exceptionLast = 0;
};

class ExceptionInfo {
 constructor(excPtr) {
  this.excPtr = excPtr;
  this.ptr = excPtr - 24;
 }
 set_type(type) {
  GROWABLE_HEAP_U32()[(((this.ptr) + (4)) >> 2)] = type;
 }
 get_type() {
  return GROWABLE_HEAP_U32()[(((this.ptr) + (4)) >> 2)];
 }
 set_destructor(destructor) {
  GROWABLE_HEAP_U32()[(((this.ptr) + (8)) >> 2)] = destructor;
 }
 get_destructor() {
  return GROWABLE_HEAP_U32()[(((this.ptr) + (8)) >> 2)];
 }
 set_caught(caught) {
  caught = caught ? 1 : 0;
  GROWABLE_HEAP_I8()[(((this.ptr) + (12)) >> 0)] = caught;
 }
 get_caught() {
  return GROWABLE_HEAP_I8()[(((this.ptr) + (12)) >> 0)] != 0;
 }
 set_rethrown(rethrown) {
  rethrown = rethrown ? 1 : 0;
  GROWABLE_HEAP_I8()[(((this.ptr) + (13)) >> 0)] = rethrown;
 }
 get_rethrown() {
  return GROWABLE_HEAP_I8()[(((this.ptr) + (13)) >> 0)] != 0;
 }
 init(type, destructor) {
  this.set_adjusted_ptr(0);
  this.set_type(type);
  this.set_destructor(destructor);
 }
 set_adjusted_ptr(adjustedPtr) {
  GROWABLE_HEAP_U32()[(((this.ptr) + (16)) >> 2)] = adjustedPtr;
 }
 get_adjusted_ptr() {
  return GROWABLE_HEAP_U32()[(((this.ptr) + (16)) >> 2)];
 }
 get_exception_ptr() {
  var isPointer = ___cxa_is_pointer_type(this.get_type());
  if (isPointer) {
   return GROWABLE_HEAP_U32()[((this.excPtr) >> 2)];
  }
  var adjusted = this.get_adjusted_ptr();
  if (adjusted !== 0) return adjusted;
  return this.excPtr;
 }
}

var ___resumeException = ptr => {
 if (!exceptionLast) {
  exceptionLast = new CppException(ptr);
 }
 throw exceptionLast;
};

var findMatchingCatch = args => {
 var thrown = exceptionLast?.excPtr;
 if (!thrown) {
  setTempRet0(0);
  return 0;
 }
 var info = new ExceptionInfo(thrown);
 info.set_adjusted_ptr(thrown);
 var thrownType = info.get_type();
 if (!thrownType) {
  setTempRet0(0);
  return thrown;
 }
 for (var arg in args) {
  var caughtType = args[arg];
  if (caughtType === 0 || caughtType === thrownType) {
   break;
  }
  var adjusted_ptr_addr = info.ptr + 16;
  if (___cxa_can_catch(caughtType, thrownType, adjusted_ptr_addr)) {
   setTempRet0(caughtType);
   return thrown;
  }
 }
 setTempRet0(thrownType);
 return thrown;
};

var ___cxa_find_matching_catch_2 = () => findMatchingCatch([]);

var ___cxa_find_matching_catch_3 = arg0 => findMatchingCatch([ arg0 ]);

var ___cxa_find_matching_catch_4 = (arg0, arg1) => findMatchingCatch([ arg0, arg1 ]);

var ___cxa_rethrow = () => {
 var info = exceptionCaught.pop();
 if (!info) {
  abort("no exception to throw");
 }
 var ptr = info.excPtr;
 if (!info.get_rethrown()) {
  exceptionCaught.push(info);
  info.set_rethrown(true);
  info.set_caught(false);
  uncaughtExceptionCount++;
 }
 exceptionLast = new CppException(ptr);
 throw exceptionLast;
};

var ___cxa_rethrow_primary_exception = ptr => {
 if (!ptr) return;
 var info = new ExceptionInfo(ptr);
 exceptionCaught.push(info);
 info.set_rethrown(true);
 ___cxa_rethrow();
};

var ___cxa_throw = (ptr, type, destructor) => {
 var info = new ExceptionInfo(ptr);
 info.init(type, destructor);
 exceptionLast = new CppException(ptr);
 uncaughtExceptionCount++;
 throw exceptionLast;
};

var ___emscripten_init_main_thread_js = tb => {
 __emscripten_thread_init(tb, /*is_main=*/ !ENVIRONMENT_IS_WORKER, /*is_runtime=*/ 1, /*can_block=*/ !ENVIRONMENT_IS_WEB, /*default_stacksize=*/ 1048576, /*start_profiling=*/ false);
 PThread.threadInitTLS();
};

var ___emscripten_thread_cleanup = thread => {
 if (!ENVIRONMENT_IS_PTHREAD) cleanupThread(thread); else postMessage({
  "cmd": "cleanupThread",
  "thread": thread
 });
};

function pthreadCreateProxied(pthread_ptr, attr, startRoutine, arg) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(2, 1, pthread_ptr, attr, startRoutine, arg);
 return ___pthread_create_js(pthread_ptr, attr, startRoutine, arg);
}

var ___pthread_create_js = (pthread_ptr, attr, startRoutine, arg) => {
 if (typeof SharedArrayBuffer == "undefined") {
  err("Current environment does not support SharedArrayBuffer, pthreads are not available!");
  return 6;
 }
 var transferList = [];
 var error = 0;
 if (ENVIRONMENT_IS_PTHREAD && (transferList.length === 0 || error)) {
  return pthreadCreateProxied(pthread_ptr, attr, startRoutine, arg);
 }
 if (error) return error;
 var threadParams = {
  startRoutine: startRoutine,
  pthread_ptr: pthread_ptr,
  arg: arg,
  transferList: transferList
 };
 if (ENVIRONMENT_IS_PTHREAD) {
  threadParams.cmd = "spawnThread";
  postMessage(threadParams, transferList);
  return 0;
 }
 return spawnThread(threadParams);
};

var __embind_register_bigint = (primitiveType, name, size, minRange, maxRange) => {};

var embind_init_charCodes = () => {
 var codes = new Array(256);
 for (var i = 0; i < 256; ++i) {
  codes[i] = String.fromCharCode(i);
 }
 embind_charCodes = codes;
};

var embind_charCodes;

var readLatin1String = ptr => {
 var ret = "";
 var c = ptr;
 while (GROWABLE_HEAP_U8()[c]) {
  ret += embind_charCodes[GROWABLE_HEAP_U8()[c++]];
 }
 return ret;
};

var awaitingDependencies = {};

var registeredTypes = {};

var typeDependencies = {};

var BindingError;

var throwBindingError = message => {
 throw new BindingError(message);
};

var InternalError;

var throwInternalError = message => {
 throw new InternalError(message);
};

var whenDependentTypesAreResolved = (myTypes, dependentTypes, getTypeConverters) => {
 myTypes.forEach(function(type) {
  typeDependencies[type] = dependentTypes;
 });
 function onComplete(typeConverters) {
  var myTypeConverters = getTypeConverters(typeConverters);
  if (myTypeConverters.length !== myTypes.length) {
   throwInternalError("Mismatched type converter count");
  }
  for (var i = 0; i < myTypes.length; ++i) {
   registerType(myTypes[i], myTypeConverters[i]);
  }
 }
 var typeConverters = new Array(dependentTypes.length);
 var unregisteredTypes = [];
 var registered = 0;
 dependentTypes.forEach((dt, i) => {
  if (registeredTypes.hasOwnProperty(dt)) {
   typeConverters[i] = registeredTypes[dt];
  } else {
   unregisteredTypes.push(dt);
   if (!awaitingDependencies.hasOwnProperty(dt)) {
    awaitingDependencies[dt] = [];
   }
   awaitingDependencies[dt].push(() => {
    typeConverters[i] = registeredTypes[dt];
    ++registered;
    if (registered === unregisteredTypes.length) {
     onComplete(typeConverters);
    }
   });
  }
 });
 if (0 === unregisteredTypes.length) {
  onComplete(typeConverters);
 }
};

/** @param {Object=} options */ function sharedRegisterType(rawType, registeredInstance, options = {}) {
 var name = registeredInstance.name;
 if (!rawType) {
  throwBindingError(`type "${name}" must have a positive integer typeid pointer`);
 }
 if (registeredTypes.hasOwnProperty(rawType)) {
  if (options.ignoreDuplicateRegistrations) {
   return;
  } else {
   throwBindingError(`Cannot register type '${name}' twice`);
  }
 }
 registeredTypes[rawType] = registeredInstance;
 delete typeDependencies[rawType];
 if (awaitingDependencies.hasOwnProperty(rawType)) {
  var callbacks = awaitingDependencies[rawType];
  delete awaitingDependencies[rawType];
  callbacks.forEach(cb => cb());
 }
}

/** @param {Object=} options */ function registerType(rawType, registeredInstance, options = {}) {
 if (!("argPackAdvance" in registeredInstance)) {
  throw new TypeError("registerType registeredInstance requires argPackAdvance");
 }
 return sharedRegisterType(rawType, registeredInstance, options);
}

var GenericWireTypeSize = 8;

/** @suppress {globalThis} */ var __embind_register_bool = (rawType, name, trueValue, falseValue) => {
 name = readLatin1String(name);
 registerType(rawType, {
  name: name,
  "fromWireType": function(wt) {
   return !!wt;
  },
  "toWireType": function(destructors, o) {
   return o ? trueValue : falseValue;
  },
  "argPackAdvance": GenericWireTypeSize,
  "readValueFromPointer": function(pointer) {
   return this["fromWireType"](GROWABLE_HEAP_U8()[pointer]);
  },
  destructorFunction: null
 });
};

class HandleAllocator {
 constructor() {
  this.allocated = [ undefined ];
  this.freelist = [];
 }
 get(id) {
  assert(this.allocated[id] !== undefined, `invalid handle: ${id}`);
  return this.allocated[id];
 }
 has(id) {
  return this.allocated[id] !== undefined;
 }
 allocate(handle) {
  var id = this.freelist.pop() || this.allocated.length;
  this.allocated[id] = handle;
  return id;
 }
 free(id) {
  assert(this.allocated[id] !== undefined);
  this.allocated[id] = undefined;
  this.freelist.push(id);
 }
}

var emval_handles = new HandleAllocator;

var __emval_decref = handle => {
 if (handle >= emval_handles.reserved && 0 === --emval_handles.get(handle).refcount) {
  emval_handles.free(handle);
 }
};

var count_emval_handles = () => {
 var count = 0;
 for (var i = emval_handles.reserved; i < emval_handles.allocated.length; ++i) {
  if (emval_handles.allocated[i] !== undefined) {
   ++count;
  }
 }
 return count;
};

var init_emval = () => {
 emval_handles.allocated.push({
  value: undefined
 }, {
  value: null
 }, {
  value: true
 }, {
  value: false
 });
 Object.assign(emval_handles, /** @lends {emval_handles} */ {
  reserved: emval_handles.allocated.length
 }), Module["count_emval_handles"] = count_emval_handles;
};

var Emval = {
 toValue: handle => {
  if (!handle) {
   throwBindingError("Cannot use deleted val. handle = " + handle);
  }
  return emval_handles.get(handle).value;
 },
 toHandle: value => {
  switch (value) {
  case undefined:
   return 1;

  case null:
   return 2;

  case true:
   return 3;

  case false:
   return 4;

  default:
   {
    return emval_handles.allocate({
     refcount: 1,
     value: value
    });
   }
  }
 }
};

/** @suppress {globalThis} */ function simpleReadValueFromPointer(pointer) {
 return this["fromWireType"](GROWABLE_HEAP_I32()[((pointer) >> 2)]);
}

var EmValType = {
 name: "emscripten::val",
 "fromWireType": handle => {
  var rv = Emval.toValue(handle);
  __emval_decref(handle);
  return rv;
 },
 "toWireType": (destructors, value) => Emval.toHandle(value),
 "argPackAdvance": GenericWireTypeSize,
 "readValueFromPointer": simpleReadValueFromPointer,
 destructorFunction: null
};

var __embind_register_emval = rawType => registerType(rawType, EmValType);

var embindRepr = v => {
 if (v === null) {
  return "null";
 }
 var t = typeof v;
 if (t === "object" || t === "array" || t === "function") {
  return v.toString();
 } else {
  return "" + v;
 }
};

var floatReadValueFromPointer = (name, width) => {
 switch (width) {
 case 4:
  return function(pointer) {
   return this["fromWireType"](GROWABLE_HEAP_F32()[((pointer) >> 2)]);
  };

 case 8:
  return function(pointer) {
   return this["fromWireType"](GROWABLE_HEAP_F64()[((pointer) >> 3)]);
  };

 default:
  throw new TypeError(`invalid float width (${width}): ${name}`);
 }
};

var __embind_register_float = (rawType, name, size) => {
 name = readLatin1String(name);
 registerType(rawType, {
  name: name,
  "fromWireType": value => value,
  "toWireType": (destructors, value) => {
   if (typeof value != "number" && typeof value != "boolean") {
    throw new TypeError(`Cannot convert ${embindRepr(value)} to ${this.name}`);
   }
   return value;
  },
  "argPackAdvance": GenericWireTypeSize,
  "readValueFromPointer": floatReadValueFromPointer(name, size),
  destructorFunction: null
 });
};

var integerReadValueFromPointer = (name, width, signed) => {
 switch (width) {
 case 1:
  return signed ? pointer => GROWABLE_HEAP_I8()[((pointer) >> 0)] : pointer => GROWABLE_HEAP_U8()[((pointer) >> 0)];

 case 2:
  return signed ? pointer => GROWABLE_HEAP_I16()[((pointer) >> 1)] : pointer => GROWABLE_HEAP_U16()[((pointer) >> 1)];

 case 4:
  return signed ? pointer => GROWABLE_HEAP_I32()[((pointer) >> 2)] : pointer => GROWABLE_HEAP_U32()[((pointer) >> 2)];

 default:
  throw new TypeError(`invalid integer width (${width}): ${name}`);
 }
};

/** @suppress {globalThis} */ var __embind_register_integer = (primitiveType, name, size, minRange, maxRange) => {
 name = readLatin1String(name);
 if (maxRange === -1) {
  maxRange = 4294967295;
 }
 var fromWireType = value => value;
 if (minRange === 0) {
  var bitshift = 32 - 8 * size;
  fromWireType = value => (value << bitshift) >>> bitshift;
 }
 var isUnsignedType = (name.includes("unsigned"));
 var checkAssertions = (value, toTypeName) => {
  if (typeof value != "number" && typeof value != "boolean") {
   throw new TypeError(`Cannot convert "${embindRepr(value)}" to ${toTypeName}`);
  }
  if (value < minRange || value > maxRange) {
   throw new TypeError(`Passing a number "${embindRepr(value)}" from JS side to C/C++ side to an argument of type "${name}", which is outside the valid range [${minRange}, ${maxRange}]!`);
  }
 };
 var toWireType;
 if (isUnsignedType) {
  toWireType = function(destructors, value) {
   checkAssertions(value, this.name);
   return value >>> 0;
  };
 } else {
  toWireType = function(destructors, value) {
   checkAssertions(value, this.name);
   return value;
  };
 }
 registerType(primitiveType, {
  name: name,
  "fromWireType": fromWireType,
  "toWireType": toWireType,
  "argPackAdvance": GenericWireTypeSize,
  "readValueFromPointer": integerReadValueFromPointer(name, size, minRange !== 0),
  destructorFunction: null
 });
};

var __embind_register_memory_view = (rawType, dataTypeIndex, name) => {
 var typeMapping = [ Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array ];
 var TA = typeMapping[dataTypeIndex];
 function decodeMemoryView(handle) {
  var size = GROWABLE_HEAP_U32()[((handle) >> 2)];
  var data = GROWABLE_HEAP_U32()[(((handle) + (4)) >> 2)];
  return new TA(GROWABLE_HEAP_I8().buffer, data, size);
 }
 name = readLatin1String(name);
 registerType(rawType, {
  name: name,
  "fromWireType": decodeMemoryView,
  "argPackAdvance": GenericWireTypeSize,
  "readValueFromPointer": decodeMemoryView
 }, {
  ignoreDuplicateRegistrations: true
 });
};

/** @suppress {globalThis} */ function readPointer(pointer) {
 return this["fromWireType"](GROWABLE_HEAP_U32()[((pointer) >> 2)]);
}

var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
 assert(typeof str === "string", `stringToUTF8Array expects a string (got ${typeof str})`);
 if (!(maxBytesToWrite > 0)) return 0;
 var startIdx = outIdx;
 var endIdx = outIdx + maxBytesToWrite - 1;
 for (var i = 0; i < str.length; ++i) {
  var u = str.charCodeAt(i);
  if (u >= 55296 && u <= 57343) {
   var u1 = str.charCodeAt(++i);
   u = 65536 + ((u & 1023) << 10) | (u1 & 1023);
  }
  if (u <= 127) {
   if (outIdx >= endIdx) break;
   heap[outIdx++] = u;
  } else if (u <= 2047) {
   if (outIdx + 1 >= endIdx) break;
   heap[outIdx++] = 192 | (u >> 6);
   heap[outIdx++] = 128 | (u & 63);
  } else if (u <= 65535) {
   if (outIdx + 2 >= endIdx) break;
   heap[outIdx++] = 224 | (u >> 12);
   heap[outIdx++] = 128 | ((u >> 6) & 63);
   heap[outIdx++] = 128 | (u & 63);
  } else {
   if (outIdx + 3 >= endIdx) break;
   if (u > 1114111) warnOnce("Invalid Unicode code point " + ptrToString(u) + " encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).");
   heap[outIdx++] = 240 | (u >> 18);
   heap[outIdx++] = 128 | ((u >> 12) & 63);
   heap[outIdx++] = 128 | ((u >> 6) & 63);
   heap[outIdx++] = 128 | (u & 63);
  }
 }
 heap[outIdx] = 0;
 return outIdx - startIdx;
};

var stringToUTF8 = (str, outPtr, maxBytesToWrite) => {
 assert(typeof maxBytesToWrite == "number", "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
 return stringToUTF8Array(str, GROWABLE_HEAP_U8(), outPtr, maxBytesToWrite);
};

var lengthBytesUTF8 = str => {
 var len = 0;
 for (var i = 0; i < str.length; ++i) {
  var c = str.charCodeAt(i);
  if (c <= 127) {
   len++;
  } else if (c <= 2047) {
   len += 2;
  } else if (c >= 55296 && c <= 57343) {
   len += 4;
   ++i;
  } else {
   len += 3;
  }
 }
 return len;
};

var __embind_register_std_string = (rawType, name) => {
 name = readLatin1String(name);
 var stdStringIsUTF8 =  (name === "std::string");
 registerType(rawType, {
  name: name,
  "fromWireType"(value) {
   var length = GROWABLE_HEAP_U32()[((value) >> 2)];
   var payload = value + 4;
   var str;
   if (stdStringIsUTF8) {
    var decodeStartPtr = payload;
    for (var i = 0; i <= length; ++i) {
     var currentBytePtr = payload + i;
     if (i == length || GROWABLE_HEAP_U8()[currentBytePtr] == 0) {
      var maxRead = currentBytePtr - decodeStartPtr;
      var stringSegment = UTF8ToString(decodeStartPtr, maxRead);
      if (str === undefined) {
       str = stringSegment;
      } else {
       str += String.fromCharCode(0);
       str += stringSegment;
      }
      decodeStartPtr = currentBytePtr + 1;
     }
    }
   } else {
    var a = new Array(length);
    for (var i = 0; i < length; ++i) {
     a[i] = String.fromCharCode(GROWABLE_HEAP_U8()[payload + i]);
    }
    str = a.join("");
   }
   _free(value);
   return str;
  },
  "toWireType"(destructors, value) {
   if (value instanceof ArrayBuffer) {
    value = new Uint8Array(value);
   }
   var length;
   var valueIsOfTypeString = (typeof value == "string");
   if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) {
    throwBindingError("Cannot pass non-string to std::string");
   }
   if (stdStringIsUTF8 && valueIsOfTypeString) {
    length = lengthBytesUTF8(value);
   } else {
    length = value.length;
   }
   var base = _malloc(4 + length + 1);
   var ptr = base + 4;
   GROWABLE_HEAP_U32()[((base) >> 2)] = length;
   if (stdStringIsUTF8 && valueIsOfTypeString) {
    stringToUTF8(value, ptr, length + 1);
   } else {
    if (valueIsOfTypeString) {
     for (var i = 0; i < length; ++i) {
      var charCode = value.charCodeAt(i);
      if (charCode > 255) {
       _free(ptr);
       throwBindingError("String has UTF-16 code units that do not fit in 8 bits");
      }
      GROWABLE_HEAP_U8()[ptr + i] = charCode;
     }
    } else {
     for (var i = 0; i < length; ++i) {
      GROWABLE_HEAP_U8()[ptr + i] = value[i];
     }
    }
   }
   if (destructors !== null) {
    destructors.push(_free, base);
   }
   return base;
  },
  "argPackAdvance": GenericWireTypeSize,
  "readValueFromPointer": readPointer,
  destructorFunction(ptr) {
   _free(ptr);
  }
 });
};

var UTF16Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf-16le") : undefined;

var UTF16ToString = (ptr, maxBytesToRead) => {
 assert(ptr % 2 == 0, "Pointer passed to UTF16ToString must be aligned to two bytes!");
 var endPtr = ptr;
 var idx = endPtr >> 1;
 var maxIdx = idx + maxBytesToRead / 2;
 while (!(idx >= maxIdx) && GROWABLE_HEAP_U16()[idx]) ++idx;
 endPtr = idx << 1;
 if (endPtr - ptr > 32 && UTF16Decoder) return UTF16Decoder.decode(GROWABLE_HEAP_U8().slice(ptr, endPtr));
 var str = "";
 for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
  var codeUnit = GROWABLE_HEAP_I16()[(((ptr) + (i * 2)) >> 1)];
  if (codeUnit == 0) break;
  str += String.fromCharCode(codeUnit);
 }
 return str;
};

var stringToUTF16 = (str, outPtr, maxBytesToWrite) => {
 assert(outPtr % 2 == 0, "Pointer passed to stringToUTF16 must be aligned to two bytes!");
 assert(typeof maxBytesToWrite == "number", "stringToUTF16(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
 maxBytesToWrite ??= 2147483647;
 if (maxBytesToWrite < 2) return 0;
 maxBytesToWrite -= 2;
 var startPtr = outPtr;
 var numCharsToWrite = (maxBytesToWrite < str.length * 2) ? (maxBytesToWrite / 2) : str.length;
 for (var i = 0; i < numCharsToWrite; ++i) {
  var codeUnit = str.charCodeAt(i);
  GROWABLE_HEAP_I16()[((outPtr) >> 1)] = codeUnit;
  outPtr += 2;
 }
 GROWABLE_HEAP_I16()[((outPtr) >> 1)] = 0;
 return outPtr - startPtr;
};

var lengthBytesUTF16 = str => str.length * 2;

var UTF32ToString = (ptr, maxBytesToRead) => {
 assert(ptr % 4 == 0, "Pointer passed to UTF32ToString must be aligned to four bytes!");
 var i = 0;
 var str = "";
 while (!(i >= maxBytesToRead / 4)) {
  var utf32 = GROWABLE_HEAP_I32()[(((ptr) + (i * 4)) >> 2)];
  if (utf32 == 0) break;
  ++i;
  if (utf32 >= 65536) {
   var ch = utf32 - 65536;
   str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
  } else {
   str += String.fromCharCode(utf32);
  }
 }
 return str;
};

var stringToUTF32 = (str, outPtr, maxBytesToWrite) => {
 assert(outPtr % 4 == 0, "Pointer passed to stringToUTF32 must be aligned to four bytes!");
 assert(typeof maxBytesToWrite == "number", "stringToUTF32(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
 maxBytesToWrite ??= 2147483647;
 if (maxBytesToWrite < 4) return 0;
 var startPtr = outPtr;
 var endPtr = startPtr + maxBytesToWrite - 4;
 for (var i = 0; i < str.length; ++i) {
  var codeUnit = str.charCodeAt(i);
  if (codeUnit >= 55296 && codeUnit <= 57343) {
   var trailSurrogate = str.charCodeAt(++i);
   codeUnit = 65536 + ((codeUnit & 1023) << 10) | (trailSurrogate & 1023);
  }
  GROWABLE_HEAP_I32()[((outPtr) >> 2)] = codeUnit;
  outPtr += 4;
  if (outPtr + 4 > endPtr) break;
 }
 GROWABLE_HEAP_I32()[((outPtr) >> 2)] = 0;
 return outPtr - startPtr;
};

var lengthBytesUTF32 = str => {
 var len = 0;
 for (var i = 0; i < str.length; ++i) {
  var codeUnit = str.charCodeAt(i);
  if (codeUnit >= 55296 && codeUnit <= 57343) ++i;
  len += 4;
 }
 return len;
};

var __embind_register_std_wstring = (rawType, charSize, name) => {
 name = readLatin1String(name);
 var decodeString, encodeString, getHeap, lengthBytesUTF, shift;
 if (charSize === 2) {
  decodeString = UTF16ToString;
  encodeString = stringToUTF16;
  lengthBytesUTF = lengthBytesUTF16;
  getHeap = () => GROWABLE_HEAP_U16();
  shift = 1;
 } else if (charSize === 4) {
  decodeString = UTF32ToString;
  encodeString = stringToUTF32;
  lengthBytesUTF = lengthBytesUTF32;
  getHeap = () => GROWABLE_HEAP_U32();
  shift = 2;
 }
 registerType(rawType, {
  name: name,
  "fromWireType": value => {
   var length = GROWABLE_HEAP_U32()[((value) >> 2)];
   var HEAP = getHeap();
   var str;
   var decodeStartPtr = value + 4;
   for (var i = 0; i <= length; ++i) {
    var currentBytePtr = value + 4 + i * charSize;
    if (i == length || HEAP[currentBytePtr >> shift] == 0) {
     var maxReadBytes = currentBytePtr - decodeStartPtr;
     var stringSegment = decodeString(decodeStartPtr, maxReadBytes);
     if (str === undefined) {
      str = stringSegment;
     } else {
      str += String.fromCharCode(0);
      str += stringSegment;
     }
     decodeStartPtr = currentBytePtr + charSize;
    }
   }
   _free(value);
   return str;
  },
  "toWireType": (destructors, value) => {
   if (!(typeof value == "string")) {
    throwBindingError(`Cannot pass non-string to C++ string type ${name}`);
   }
   var length = lengthBytesUTF(value);
   var ptr = _malloc(4 + length + charSize);
   GROWABLE_HEAP_U32()[((ptr) >> 2)] = length >> shift;
   encodeString(value, ptr + 4, length + charSize);
   if (destructors !== null) {
    destructors.push(_free, ptr);
   }
   return ptr;
  },
  "argPackAdvance": GenericWireTypeSize,
  "readValueFromPointer": simpleReadValueFromPointer,
  destructorFunction(ptr) {
   _free(ptr);
  }
 });
};

var __embind_register_void = (rawType, name) => {
 name = readLatin1String(name);
 registerType(rawType, {
  isVoid: true,
  name: name,
  "argPackAdvance": 0,
  "fromWireType": () => undefined,
  "toWireType": (destructors, o) => undefined
 });
};

var emnapiCtx = undefined;

function __emnapi_call_finalizer(forceUncaught, env, callback, data, hint) {
 var envObject = emnapiCtx.envStore.get(env);
 envObject.callFinalizerInternal(forceUncaught, callback, data, hint);
}

function __emnapi_callback_into_module(forceUncaught, env, callback, data, close_scope_if_throw) {
 var envObject = emnapiCtx.envStore.get(env);
 var scope = emnapiCtx.openScope(envObject);
 try {
  envObject.callbackIntoModule(Boolean(forceUncaught), function() {
   getWasmTableEntry(callback)(env, data);
  });
 } catch (err) {
  emnapiCtx.closeScope(envObject, scope);
  if (close_scope_if_throw) {
   emnapiCtx.closeScope(envObject);
  }
  throw err;
 }
 emnapiCtx.closeScope(envObject, scope);
}

function __emnapi_ctx_decrease_waiting_request_counter() {
 emnapiCtx.decreaseWaitingRequestCounter();
}

function __emnapi_ctx_increase_waiting_request_counter() {
 emnapiCtx.increaseWaitingRequestCounter();
}

function __emnapi_env_check_gc_access(env) {
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
}

function __emnapi_env_ref(env) {
 var envObject = emnapiCtx.envStore.get(env);
 envObject.ref();
}

function __emnapi_env_unref(env) {
 var envObject = emnapiCtx.envStore.get(env);
 envObject.unref();
}

function __emnapi_get_last_error_info(env, error_code, engine_error_code, engine_reserved) {
 var envObject = emnapiCtx.envStore.get(env);
 var lastError = envObject.lastError;
 var errorCode = lastError.errorCode;
 var engineErrorCode = lastError.engineErrorCode >>> 0;
 var engineReserved = lastError.engineReserved;
 GROWABLE_HEAP_I32()[((error_code) >> 2)] = errorCode;
 GROWABLE_HEAP_U32()[((engine_error_code) >> 2)] = engineErrorCode;
 GROWABLE_HEAP_U32()[((engine_reserved) >> 2)] = engineReserved;
}

var emnapiNodeBinding = undefined;

function __emnapi_node_emit_async_destroy(async_id, trigger_async_id) {
 if (!emnapiNodeBinding) return;
 emnapiNodeBinding.node.emitAsyncDestroy({
  asyncId: async_id,
  triggerAsyncId: trigger_async_id
 });
}

function __emnapi_node_emit_async_init(async_resource, async_resource_name, trigger_async_id, result) {
 if (!emnapiNodeBinding) return;
 var resource = emnapiCtx.handleStore.get(async_resource).value;
 var resource_name = emnapiCtx.handleStore.get(async_resource_name).value;
 var asyncContext = emnapiNodeBinding.node.emitAsyncInit(resource, resource_name, trigger_async_id);
 var asyncId = asyncContext.asyncId;
 var triggerAsyncId = asyncContext.triggerAsyncId;
 if (result) {
  GROWABLE_HEAP_F64()[((result) >> 3)] = asyncId;
  GROWABLE_HEAP_F64()[(((result) + (8)) >> 3)] = triggerAsyncId;
 }
}

function __emnapi_node_make_callback(env, async_resource, cb, argv, size, async_id, trigger_async_id, result) {
 var i = 0;
 var v;
 if (!emnapiNodeBinding) return;
 var resource = emnapiCtx.handleStore.get(async_resource).value;
 var callback = emnapiCtx.handleStore.get(cb).value;
 size = size >>> 0;
 var arr = Array(size);
 for (;i < size; i++) {
  var argVal = GROWABLE_HEAP_U32()[(((argv) + (i * 4)) >> 2)];
  arr[i] = emnapiCtx.handleStore.get(argVal).value;
 }
 var ret = emnapiNodeBinding.node.makeCallback(resource, callback, arr, {
  asyncId: async_id,
  triggerAsyncId: trigger_async_id
 });
 if (result) {
  var envObject = emnapiCtx.envStore.get(env);
  v = envObject.ensureHandleId(ret);
  GROWABLE_HEAP_U32()[((result) >> 2)] = v;
 }
}

function __emnapi_set_immediate(callback, data) {
 emnapiCtx.feature.setImmediate(function() {
  getWasmTableEntry(callback)(data);
 });
}

function __emnapi_worker_unref(pid) {
 var worker = PThread.pthreads[pid];
 worker = worker.worker || worker;
 if (typeof worker.unref === "function") {
  worker.unref();
 }
}

var nowIsMonotonic = 1;

var __emscripten_get_now_is_monotonic = () => nowIsMonotonic;

var maybeExit = () => {
 if (!keepRuntimeAlive()) {
  try {
   if (ENVIRONMENT_IS_PTHREAD) __emscripten_thread_exit(EXITSTATUS); else _exit(EXITSTATUS);
  } catch (e) {
   handleException(e);
  }
 }
};

var callUserCallback = func => {
 if (ABORT) {
  err("user callback triggered after runtime exited or application aborted.  Ignoring.");
  return;
 }
 try {
  func();
  maybeExit();
 } catch (e) {
  handleException(e);
 }
};

var __emscripten_thread_mailbox_await = pthread_ptr => {
 if (typeof Atomics.waitAsync === "function") {
  var wait = Atomics.waitAsync(GROWABLE_HEAP_I32(), ((pthread_ptr) >> 2), pthread_ptr);
  assert(wait.async);
  wait.value.then(checkMailbox);
  var waitingAsync = pthread_ptr + 128;
  Atomics.store(GROWABLE_HEAP_I32(), ((waitingAsync) >> 2), 1);
 }
};

Module["__emscripten_thread_mailbox_await"] = __emscripten_thread_mailbox_await;

var checkMailbox = () => {
 var pthread_ptr = _pthread_self();
 if (pthread_ptr) {
  __emscripten_thread_mailbox_await(pthread_ptr);
  callUserCallback(__emscripten_check_mailbox);
 }
};

Module["checkMailbox"] = checkMailbox;

var __emscripten_notify_mailbox_postmessage = (targetThreadId, currThreadId, mainThreadId) => {
 if (targetThreadId == currThreadId) {
  setTimeout(checkMailbox);
 } else if (ENVIRONMENT_IS_PTHREAD) {
  postMessage({
   "targetThread": targetThreadId,
   "cmd": "checkMailbox"
  });
 } else {
  var worker = PThread.pthreads[targetThreadId];
  if (!worker) {
   err(`Cannot send message to thread with ID ${targetThreadId}, unknown thread ID!`);
   return;
  }
  worker.postMessage({
   "cmd": "checkMailbox"
  });
 }
};

var proxiedJSCallArgs = [];

var __emscripten_receive_on_main_thread_js = (index, callingThread, numCallArgs, args) => {
 proxiedJSCallArgs.length = numCallArgs;
 var b = ((args) >> 3);
 for (var i = 0; i < numCallArgs; i++) {
  proxiedJSCallArgs[i] = GROWABLE_HEAP_F64()[b + i];
 }
 var func = proxiedFunctionTable[index];
 assert(func.length == numCallArgs, "Call args mismatch in _emscripten_receive_on_main_thread_js");
 PThread.currentProxiedOperationCallerThread = callingThread;
 var rtn = func.apply(null, proxiedJSCallArgs);
 PThread.currentProxiedOperationCallerThread = 0;
 assert(typeof rtn != "bigint");
 return rtn;
};

var __emscripten_thread_set_strongref = thread => {
 if (ENVIRONMENT_IS_NODE) {
  PThread.pthreads[thread].ref();
 }
};

var _abort = () => {
 abort("native code called abort()");
};

function _emnapi_is_node_binding_available() {
 return emnapiNodeBinding ? 1 : 0;
}

var emnapiExternalMemory = {
 registry: {},
 table: {},
 wasmMemoryViewTable: {},
 init: function() {
  emnapiExternalMemory.registry = typeof FinalizationRegistry === "function" ? new FinalizationRegistry(function(_pointer) {
   _free(_pointer);
  }) : undefined;
  emnapiExternalMemory.table = new WeakMap;
  emnapiExternalMemory.wasmMemoryViewTable = new WeakMap;
 },
 isDetachedArrayBuffer: function(arrayBuffer) {
  if (arrayBuffer.byteLength === 0) {
   try {
    new Uint8Array(arrayBuffer);
   } catch (_) {
    return true;
   }
  }
  return false;
 },
 getArrayBufferPointer: function(arrayBuffer, shouldCopy) {
  var _a;
  var info = {
   address: 0,
   ownership: 0,
   /* Ownership.kRuntime */ runtimeAllocated: 0
  };
  if (arrayBuffer === wasmMemory.buffer) {
   return info;
  }
  var isDetached = emnapiExternalMemory.isDetachedArrayBuffer(arrayBuffer);
  if (emnapiExternalMemory.table.has(arrayBuffer)) {
   var cachedInfo = emnapiExternalMemory.table.get(arrayBuffer);
   if (isDetached) {
    cachedInfo.address = 0;
    return cachedInfo;
   }
   if (shouldCopy && cachedInfo.ownership === 0 && /* Ownership.kRuntime */ cachedInfo.runtimeAllocated === 1) {
    new Uint8Array(wasmMemory.buffer).set(new Uint8Array(arrayBuffer), cachedInfo.address);
   }
   return cachedInfo;
  }
  if (isDetached || (arrayBuffer.byteLength === 0)) {
   return info;
  }
  if (!shouldCopy) {
   return info;
  }
  var pointer = _malloc(arrayBuffer.byteLength);
  if (!pointer) throw new Error("Out of memory");
  new Uint8Array(wasmMemory.buffer).set(new Uint8Array(arrayBuffer), pointer);
  info.address = pointer;
  info.ownership = emnapiExternalMemory.registry ? 0 : /* Ownership.kRuntime */ 1;
  /* Ownership.kUserland */ info.runtimeAllocated = 1;
  emnapiExternalMemory.table.set(arrayBuffer, info);
  (_a = emnapiExternalMemory.registry) === null || _a === void 0 ? void 0 : _a.register(arrayBuffer, pointer);
  return info;
 },
 getOrUpdateMemoryView: function(view) {
  if (view.buffer === wasmMemory.buffer) {
   if (!emnapiExternalMemory.wasmMemoryViewTable.has(view)) {
    emnapiExternalMemory.wasmMemoryViewTable.set(view, {
     Ctor: view.constructor,
     address: view.byteOffset,
     length: view instanceof DataView ? view.byteLength : view.length,
     ownership: 1,
     runtimeAllocated: 0
    });
   }
   return view;
  }
  var maybeOldWasmMemory = emnapiExternalMemory.isDetachedArrayBuffer(view.buffer) || ((typeof SharedArrayBuffer === "function") && (view.buffer instanceof SharedArrayBuffer));
  if (maybeOldWasmMemory && emnapiExternalMemory.wasmMemoryViewTable.has(view)) {
   var info = emnapiExternalMemory.wasmMemoryViewTable.get(view);
   var Ctor = info.Ctor;
   var newView = void 0;
   var Buffer = emnapiCtx.feature.Buffer;
   if (typeof Buffer === "function" && Ctor === Buffer) {
    newView = Buffer.from(wasmMemory.buffer, info.address, info.length);
   } else {
    newView = new Ctor(wasmMemory.buffer, info.address, info.length);
   }
   emnapiExternalMemory.wasmMemoryViewTable.set(newView, info);
   return newView;
  }
  return view;
 },
 getViewPointer: function(view, shouldCopy) {
  view = emnapiExternalMemory.getOrUpdateMemoryView(view);
  if (view.buffer === wasmMemory.buffer) {
   if (emnapiExternalMemory.wasmMemoryViewTable.has(view)) {
    var _a = emnapiExternalMemory.wasmMemoryViewTable.get(view), address_1 = _a.address, ownership_1 = _a.ownership, runtimeAllocated_1 = _a.runtimeAllocated;
    return {
     address: address_1,
     ownership: ownership_1,
     runtimeAllocated: runtimeAllocated_1,
     view: view
    };
   }
   return {
    address: view.byteOffset,
    ownership: 1,
    /* Ownership.kUserland */ runtimeAllocated: 0,
    view: view
   };
  }
  var _b = emnapiExternalMemory.getArrayBufferPointer(view.buffer, shouldCopy), address = _b.address, ownership = _b.ownership, runtimeAllocated = _b.runtimeAllocated;
  return {
   address: address === 0 ? 0 : (address + view.byteOffset),
   ownership: ownership,
   runtimeAllocated: runtimeAllocated,
   view: view
  };
 }
};

function emnapiSyncMemory(js_to_wasm, arrayBufferOrView, offset, len) {
 offset = offset !== null && offset !== void 0 ? offset : 0;
 offset = offset >>> 0;
 var view;
 if (arrayBufferOrView instanceof ArrayBuffer) {
  var pointer = emnapiExternalMemory.getArrayBufferPointer(arrayBufferOrView, false).address;
  if (!pointer) throw new Error("Unknown ArrayBuffer address");
  if (typeof len !== "number" || len === -1) {
   len = arrayBufferOrView.byteLength - offset;
  }
  len = len >>> 0;
  if (len === 0) return arrayBufferOrView;
  view = new Uint8Array(arrayBufferOrView, offset, len);
  var wasmMemoryU8 = new Uint8Array(wasmMemory.buffer);
  if (!js_to_wasm) {
   view.set(wasmMemoryU8.subarray(pointer, pointer + len));
  } else {
   wasmMemoryU8.set(view, pointer);
  }
  return arrayBufferOrView;
 }
 if (ArrayBuffer.isView(arrayBufferOrView)) {
  var viewPointerInfo = emnapiExternalMemory.getViewPointer(arrayBufferOrView, false);
  var latestView = viewPointerInfo.view;
  var pointer = viewPointerInfo.address;
  if (!pointer) throw new Error("Unknown ArrayBuffer address");
  if (typeof len !== "number" || len === -1) {
   len = latestView.byteLength - offset;
  }
  len = len >>> 0;
  if (len === 0) return latestView;
  view = new Uint8Array(latestView.buffer, latestView.byteOffset + offset, len);
  var wasmMemoryU8 = new Uint8Array(wasmMemory.buffer);
  if (!js_to_wasm) {
   view.set(wasmMemoryU8.subarray(pointer, pointer + len));
  } else {
   wasmMemoryU8.set(view, pointer);
  }
  return latestView;
 }
 throw new TypeError("emnapiSyncMemory expect ArrayBuffer or ArrayBufferView as first parameter");
}

function _emnapi_sync_memory(env, js_to_wasm, arraybuffer_or_view, offset, len) {
 var v;
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
 /* napi_status.napi_pending_exception */ if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion === 2147483647 ? /* Version.NAPI_VERSION_EXPERIMENTAL */ 23 : /* napi_status.napi_cannot_run_js */ 10);
 /* napi_status.napi_pending_exception */ envObject.clearLastError();
 try {
  if (!arraybuffer_or_view) return envObject.setLastError(1);
  var handleId = GROWABLE_HEAP_U32()[((arraybuffer_or_view) >> 2)];
  var handle = envObject.ctx.handleStore.get(handleId);
  if (!handle.isArrayBuffer() && !handle.isTypedArray() && !handle.isDataView()) {
   return envObject.setLastError(1);
  }
  var ret = emnapiSyncMemory(Boolean(js_to_wasm), handle.value, offset, len);
  if (handle.value !== ret) {
   v = envObject.ensureHandleId(ret);
   GROWABLE_HEAP_U32()[((arraybuffer_or_view) >> 2)] = v;
  }
  return envObject.getReturnStatus();
 } catch (err) {
  envObject.tryCatch.setError(err);
  return envObject.setLastError(10);
 }
}

var _emscripten_check_blocking_allowed = () => {
 if (ENVIRONMENT_IS_NODE) return;
 if (ENVIRONMENT_IS_WORKER) return;
 warnOnce("Blocking on the main thread is very dangerous, see https://emscripten.org/docs/porting/pthreads.html#blocking-on-the-main-browser-thread");
};

var _emscripten_date_now = () => Date.now();

var runtimeKeepalivePush = () => {
 runtimeKeepaliveCounter += 1;
};

var _emscripten_exit_with_live_runtime = () => {
 runtimeKeepalivePush();
 throw "unwind";
};

var _emscripten_get_now;

_emscripten_get_now = () => performance.timeOrigin + performance.now();

var getHeapMax = () =>  2147483648;

var growMemory = size => {
 var b = wasmMemory.buffer;
 var pages = (size - b.byteLength + 65535) / 65536;
 try {
  wasmMemory.grow(pages);
  updateMemoryViews();
  return 1;
 } /*success*/ catch (e) {
  err(`growMemory: Attempted to grow heap from ${b.byteLength} bytes to ${size} bytes, but got error: ${e}`);
 }
};

var _emscripten_resize_heap = requestedSize => {
 var oldSize = GROWABLE_HEAP_U8().length;
 requestedSize >>>= 0;
 if (requestedSize <= oldSize) {
  return false;
 }
 var maxHeapSize = getHeapMax();
 if (requestedSize > maxHeapSize) {
  err(`Cannot enlarge memory, requested ${requestedSize} bytes, but the limit is ${maxHeapSize} bytes!`);
  return false;
 }
 var alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;
 for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
  var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
  overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
  var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
  var replacement = growMemory(newSize);
  if (replacement) {
   return true;
  }
 }
 err(`Failed to grow the heap from ${oldSize} bytes to ${newSize} bytes, not enough memory!`);
 return false;
};

/** @suppress {duplicate } */ var runtimeKeepalivePop = () => {
 assert(runtimeKeepaliveCounter > 0);
 runtimeKeepaliveCounter -= 1;
};

var _emscripten_runtime_keepalive_pop = runtimeKeepalivePop;

var _emscripten_runtime_keepalive_push = runtimeKeepalivePush;

var SYSCALLS = {
 varargs: undefined,
 get() {
  assert(SYSCALLS.varargs != undefined);
  var ret = GROWABLE_HEAP_I32()[((+SYSCALLS.varargs) >> 2)];
  SYSCALLS.varargs += 4;
  return ret;
 },
 getp() {
  return SYSCALLS.get();
 },
 getStr(ptr) {
  var ret = UTF8ToString(ptr);
  return ret;
 }
};

function _fd_close(fd) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(3, 1, fd);
 abort("fd_close called without SYSCALLS_REQUIRE_FILESYSTEM");
}

function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(4, 1, fd, offset_low, offset_high, whence, newOffset);
 var offset = convertI32PairToI53Checked(offset_low, offset_high);
 return 70;
}

var printCharBuffers = [ null, [], [] ];

var printChar = (stream, curr) => {
 var buffer = printCharBuffers[stream];
 assert(buffer);
 if (curr === 0 || curr === 10) {
  (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
  buffer.length = 0;
 } else {
  buffer.push(curr);
 }
};

var flush_NO_FILESYSTEM = () => {
 _fflush(0);
 if (printCharBuffers[1].length) printChar(1, 10);
 if (printCharBuffers[2].length) printChar(2, 10);
};

function _fd_write(fd, iov, iovcnt, pnum) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(5, 1, fd, iov, iovcnt, pnum);
 var num = 0;
 for (var i = 0; i < iovcnt; i++) {
  var ptr = GROWABLE_HEAP_U32()[((iov) >> 2)];
  var len = GROWABLE_HEAP_U32()[(((iov) + (4)) >> 2)];
  iov += 8;
  for (var j = 0; j < len; j++) {
   printChar(fd, GROWABLE_HEAP_U8()[ptr + j]);
  }
  num += len;
 }
 GROWABLE_HEAP_U32()[((pnum) >> 2)] = num;
 return 0;
}

var _llvm_eh_typeid_for = type => type;

function _napi_add_env_cleanup_hook(env, fun, arg) {
 if (!env) return 1;
 /* napi_status.napi_invalid_arg */ var envObject = emnapiCtx.envStore.get(env);
 if (!fun) return envObject.setLastError(1);
 emnapiCtx.addCleanupHook(envObject, fun, arg);
 return 0;
}

/* napi_status.napi_ok */ function emnapiGetHandle(js_object) {
 var handle = emnapiCtx.handleStore.get(js_object);
 if (!(handle.isObject() || handle.isFunction())) {
  return {
   status: 1
  };
 }
 /* napi_status.napi_invalid_arg */ if (typeof emnapiExternalMemory !== "undefined" && ArrayBuffer.isView(handle.value)) {
  if (emnapiExternalMemory.wasmMemoryViewTable.has(handle.value)) {
   handle = emnapiCtx.addToCurrentScope(emnapiExternalMemory.wasmMemoryViewTable.get(handle.value));
  }
 }
 return {
  status: 0,
  /* napi_status.napi_ok */ handle: handle
 };
}

function _napi_add_finalizer(env, js_object, finalize_data, finalize_cb, finalize_hint, result) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!emnapiCtx.feature.supportFinalizer) {
  return envObject.setLastError(9);
 }
 /* napi_status.napi_generic_failure */ if (!js_object) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ if (!finalize_cb) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ var handleResult = emnapiGetHandle(js_object);
 if (handleResult.status !== 0) /* napi_status.napi_ok */ {
  return envObject.setLastError(handleResult.status);
 }
 var handle = handleResult.handle;
 var ownership = !result ? 0 : /* Ownership.kRuntime */ 1;
 var reference = emnapiCtx.createReference(envObject, handle.id, 0, ownership, finalize_cb, finalize_data, finalize_hint);
 if (result) {
  var referenceId = reference.id;
  GROWABLE_HEAP_U32()[((result) >> 2)] = referenceId;
 }
 return envObject.clearLastError();
}

function _napi_call_function(env, recv, func, argc, argv, result) {
 var i = 0;
 var v;
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
 /* napi_status.napi_pending_exception */ if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion === 2147483647 ? /* Version.NAPI_VERSION_EXPERIMENTAL */ 23 : /* napi_status.napi_cannot_run_js */ 10);
 /* napi_status.napi_pending_exception */ envObject.clearLastError();
 try {
  if (!recv) return envObject.setLastError(1);
  argc = argc >>> 0;
  if (argc > 0) {
   if (!argv) return envObject.setLastError(1);
  }
  var v8recv = emnapiCtx.handleStore.get(recv).value;
  if (!func) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ var v8func = emnapiCtx.handleStore.get(func).value;
  if (typeof v8func !== "function") return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ var args = [];
  for (;i < argc; i++) {
   var argVal = GROWABLE_HEAP_U32()[(((argv) + (i * 4)) >> 2)];
   args.push(emnapiCtx.handleStore.get(argVal).value);
  }
  var ret = v8func.apply(v8recv, args);
  if (result) {
   v = envObject.ensureHandleId(ret);
   GROWABLE_HEAP_U32()[((result) >> 2)] = v;
  }
  return envObject.clearLastError();
 } catch (err) {
  envObject.tryCatch.setError(err);
  return envObject.setLastError(10);
 }
}

/* napi_status.napi_pending_exception */ function _napi_clear_last_error(env) {
 var envObject = emnapiCtx.envStore.get(env);
 return envObject.clearLastError();
}

function _napi_close_escapable_handle_scope(env, scope) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!scope) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ if ((envObject.openHandleScopes === 0)) {
  return 13;
 }
 /* napi_status.napi_handle_scope_mismatch */ emnapiCtx.closeScope(envObject);
 return envObject.clearLastError();
}

function _napi_close_handle_scope(env, scope) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!scope) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ if ((envObject.openHandleScopes === 0)) {
  return 13;
 }
 /* napi_status.napi_handle_scope_mismatch */ emnapiCtx.closeScope(envObject);
 return envObject.clearLastError();
}

function _napi_coerce_to_number(env, value, result) {
 var v;
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
 /* napi_status.napi_pending_exception */ if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion === 2147483647 ? /* Version.NAPI_VERSION_EXPERIMENTAL */ 23 : /* napi_status.napi_cannot_run_js */ 10);
 /* napi_status.napi_pending_exception */ envObject.clearLastError();
 try {
  if (!value) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ if (!result) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ var handle = emnapiCtx.handleStore.get(value);
  if (handle.isBigInt()) {
   throw new TypeError("Cannot convert a BigInt value to a number");
  }
  v = emnapiCtx.addToCurrentScope(Number(handle.value)).id;
  GROWABLE_HEAP_U32()[((result) >> 2)] = v;
  return envObject.getReturnStatus();
 } catch (err) {
  envObject.tryCatch.setError(err);
  return envObject.setLastError(10);
 }
}

/* napi_status.napi_pending_exception */ function _napi_coerce_to_object(env, value, result) {
 var v;
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
 /* napi_status.napi_pending_exception */ if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion === 2147483647 ? /* Version.NAPI_VERSION_EXPERIMENTAL */ 23 : /* napi_status.napi_cannot_run_js */ 10);
 /* napi_status.napi_pending_exception */ envObject.clearLastError();
 try {
  if (!value) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ if (!result) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ var handle = emnapiCtx.handleStore.get(value);
  if (handle.value == null) {
   throw new TypeError("Cannot convert undefined or null to object");
  }
  v = envObject.ensureHandleId(Object(handle.value));
  GROWABLE_HEAP_U32()[((result) >> 2)] = v;
  return envObject.getReturnStatus();
 } catch (err) {
  envObject.tryCatch.setError(err);
  return envObject.setLastError(10);
 }
}

/* napi_status.napi_pending_exception */ function _napi_coerce_to_string(env, value, result) {
 var v;
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
 /* napi_status.napi_pending_exception */ if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion === 2147483647 ? /* Version.NAPI_VERSION_EXPERIMENTAL */ 23 : /* napi_status.napi_cannot_run_js */ 10);
 /* napi_status.napi_pending_exception */ envObject.clearLastError();
 try {
  if (!value) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ if (!result) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ var handle = emnapiCtx.handleStore.get(value);
  if (handle.isSymbol()) {
   throw new TypeError("Cannot convert a Symbol value to a string");
  }
  v = emnapiCtx.addToCurrentScope(String(handle.value)).id;
  GROWABLE_HEAP_U32()[((result) >> 2)] = v;
  return envObject.getReturnStatus();
 } catch (err) {
  envObject.tryCatch.setError(err);
  return envObject.setLastError(10);
 }
}

/* napi_status.napi_pending_exception */ function _napi_create_array_with_length(env, length, result) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!result) return envObject.setLastError(1);
 length = length >>> 0;
 var value = emnapiCtx.addToCurrentScope(new Array(length)).id;
 GROWABLE_HEAP_U32()[((result) >> 2)] = value;
 return envObject.clearLastError();
}

function emnapiCreateArrayBuffer(byte_length, data) {
 byte_length = byte_length >>> 0;
 var arrayBuffer = new ArrayBuffer(byte_length);
 if (data) {
  var p = emnapiExternalMemory.getArrayBufferPointer(arrayBuffer, true).address;
  GROWABLE_HEAP_U32()[((data) >> 2)] = p;
 }
 return arrayBuffer;
}

function _napi_create_arraybuffer(env, byte_length, data, result) {
 var value;
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
 /* napi_status.napi_pending_exception */ if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion === 2147483647 ? /* Version.NAPI_VERSION_EXPERIMENTAL */ 23 : /* napi_status.napi_cannot_run_js */ 10);
 /* napi_status.napi_pending_exception */ envObject.clearLastError();
 try {
  if (!result) return envObject.setLastError(1);
  var arrayBuffer = emnapiCreateArrayBuffer(byte_length, data);
  value = emnapiCtx.addToCurrentScope(arrayBuffer).id;
  GROWABLE_HEAP_U32()[((result) >> 2)] = value;
  return envObject.getReturnStatus();
 } catch (err) {
  envObject.tryCatch.setError(err);
  return envObject.setLastError(10);
 }
}

/* napi_status.napi_pending_exception */ function _napi_create_double(env, value, result) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!result) return envObject.setLastError(1);
 var v = emnapiCtx.addToCurrentScope(value).id;
 GROWABLE_HEAP_U32()[((result) >> 2)] = v;
 return envObject.clearLastError();
}

function _napi_create_error(env, code, msg, result) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!msg) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ if (!result) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ var msgValue = emnapiCtx.handleStore.get(msg).value;
 if (typeof msgValue !== "string") {
  return envObject.setLastError(3);
 }
 /* napi_status.napi_string_expected */ var error = new Error(msgValue);
 if (code) {
  var codeValue = emnapiCtx.handleStore.get(code).value;
  if (typeof codeValue !== "string") {
   return envObject.setLastError(3);
  }
  error.code = codeValue;
 }
 var value = emnapiCtx.addToCurrentScope(error).id;
 GROWABLE_HEAP_U32()[((result) >> 2)] = value;
 return envObject.clearLastError();
}

function _napi_create_external(env, data, finalize_cb, finalize_hint, result) {
 var value;
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
 /* napi_status.napi_pending_exception */ if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion === 2147483647 ? /* Version.NAPI_VERSION_EXPERIMENTAL */ 23 : /* napi_status.napi_cannot_run_js */ 10);
 /* napi_status.napi_pending_exception */ envObject.clearLastError();
 try {
  if (!result) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ if (!emnapiCtx.feature.supportFinalizer && finalize_cb) {
   throw emnapiCtx.createNotSupportWeakRefError("napi_create_external", 'Parameter "finalize_cb" must be 0(NULL)');
  }
  var externalHandle = emnapiCtx.getCurrentScope().addExternal(envObject, data);
  if (finalize_cb) {
   emnapiCtx.createReference(envObject, externalHandle.id, 0, 0, /* Ownership.kRuntime */ finalize_cb, data, finalize_hint);
  }
  value = externalHandle.id;
  GROWABLE_HEAP_U32()[((result) >> 2)] = value;
  return envObject.clearLastError();
 } catch (err) {
  envObject.tryCatch.setError(err);
  return envObject.setLastError(10);
 }
}

var emnapiString = {
 utf8Decoder: undefined,
 utf16Decoder: undefined,
 init: function() {
  var fallbackDecoder = {
   decode: function(bytes) {
    var inputIndex = 0;
    var pendingSize = Math.min(4096, bytes.length + 1);
    var pending = new Uint16Array(pendingSize);
    var chunks = [];
    var pendingIndex = 0;
    for (;;) {
     var more = inputIndex < bytes.length;
     if (!more || (pendingIndex >= pendingSize - 1)) {
      var subarray = pending.subarray(0, pendingIndex);
      var arraylike = subarray;
      chunks.push(String.fromCharCode.apply(null, arraylike));
      if (!more) {
       return chunks.join("");
      }
      bytes = bytes.subarray(inputIndex);
      inputIndex = 0;
      pendingIndex = 0;
     }
     var byte1 = bytes[inputIndex++];
     if ((byte1 & 128) === 0) {
      pending[pendingIndex++] = byte1;
     } else if ((byte1 & 224) === 192) {
      var byte2 = bytes[inputIndex++] & 63;
      pending[pendingIndex++] = ((byte1 & 31) << 6) | byte2;
     } else if ((byte1 & 240) === 224) {
      var byte2 = bytes[inputIndex++] & 63;
      var byte3 = bytes[inputIndex++] & 63;
      pending[pendingIndex++] = ((byte1 & 31) << 12) | (byte2 << 6) | byte3;
     } else if ((byte1 & 248) === 240) {
      var byte2 = bytes[inputIndex++] & 63;
      var byte3 = bytes[inputIndex++] & 63;
      var byte4 = bytes[inputIndex++] & 63;
      var codepoint = ((byte1 & 7) << 18) | (byte2 << 12) | (byte3 << 6) | byte4;
      if (codepoint > 65535) {
       codepoint -= 65536;
       pending[pendingIndex++] = (codepoint >>> 10) & 1023 | 55296;
       codepoint = 56320 | codepoint & 1023;
      }
      pending[pendingIndex++] = codepoint;
     } else {}
    }
   }
  };
  var utf8Decoder;
  utf8Decoder = typeof TextDecoder === "function" ? new TextDecoder : fallbackDecoder;
  emnapiString.utf8Decoder = utf8Decoder;
  var fallbackDecoder2 = {
   decode: function(input) {
    var bytes = new Uint16Array(input.buffer, input.byteOffset, input.byteLength / 2);
    if (bytes.length <= 4096) {
     return String.fromCharCode.apply(null, bytes);
    }
    var chunks = [];
    var i = 0;
    var len = 0;
    for (;i < bytes.length; i += len) {
     len = Math.min(4096, bytes.length - i);
     chunks.push(String.fromCharCode.apply(null, bytes.subarray(i, i + len)));
    }
    return chunks.join("");
   }
  };
  var utf16Decoder;
  utf16Decoder = typeof TextDecoder === "function" ? new TextDecoder("utf-16le") : fallbackDecoder2;
  emnapiString.utf16Decoder = utf16Decoder;
 },
 lengthBytesUTF8: function(str) {
  var c;
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
   c = str.charCodeAt(i);
   if (c <= 127) {
    len++;
   } else if (c <= 2047) {
    len += 2;
   } else if (c >= 55296 && c <= 57343) {
    len += 4;
    ++i;
   } else {
    len += 3;
   }
  }
  return len;
 },
 UTF8ToString: function(ptr, length) {
  if (!ptr || !length) return "";
  ptr >>>= 0;
  var HEAPU8 = new Uint8Array(wasmMemory.buffer);
  var end = ptr;
  if (length === -1) {
   for (;GROWABLE_HEAP_U8()[end]; ) ++end;
  } else {
   end = ptr + (length >>> 0);
  }
  length = end - ptr;
  if (length <= 16) {
   var idx = ptr;
   var str = "";
   while (idx < end) {
    var u0 = GROWABLE_HEAP_U8()[idx++];
    if (!(u0 & 128)) {
     str += String.fromCharCode(u0);
     continue;
    }
    var u1 = GROWABLE_HEAP_U8()[idx++] & 63;
    if ((u0 & 224) === 192) {
     str += String.fromCharCode(((u0 & 31) << 6) | u1);
     continue;
    }
    var u2 = GROWABLE_HEAP_U8()[idx++] & 63;
    if ((u0 & 240) === 224) {
     u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
    } else {
     u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (GROWABLE_HEAP_U8()[idx++] & 63);
    }
    if (u0 < 65536) {
     str += String.fromCharCode(u0);
    } else {
     var ch = u0 - 65536;
     str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
    }
   }
   return str;
  }
  return emnapiString.utf8Decoder.decode(GROWABLE_HEAP_U8().slice(ptr, end));
 },
 stringToUTF8: function(str, outPtr, maxBytesToWrite) {
  var HEAPU8 = new Uint8Array(wasmMemory.buffer);
  var outIdx = outPtr;
  outIdx >>>= 0;
  if (!(maxBytesToWrite > 0)) {
   return 0;
  }
  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1;
  for (var i = 0; i < str.length; ++i) {
   var u = str.charCodeAt(i);
   if (u >= 55296 && u <= 57343) {
    var u1 = str.charCodeAt(++i);
    u = 65536 + ((u & 1023) << 10) | (u1 & 1023);
   }
   if (u <= 127) {
    if (outIdx >= endIdx) break;
    GROWABLE_HEAP_U8()[outIdx++] = u;
   } else if (u <= 2047) {
    if (outIdx + 1 >= endIdx) break;
    GROWABLE_HEAP_U8()[outIdx++] = 192 | (u >> 6);
    GROWABLE_HEAP_U8()[outIdx++] = 128 | (u & 63);
   } else if (u <= 65535) {
    if (outIdx + 2 >= endIdx) break;
    GROWABLE_HEAP_U8()[outIdx++] = 224 | (u >> 12);
    GROWABLE_HEAP_U8()[outIdx++] = 128 | ((u >> 6) & 63);
    GROWABLE_HEAP_U8()[outIdx++] = 128 | (u & 63);
   } else {
    if (outIdx + 3 >= endIdx) break;
    GROWABLE_HEAP_U8()[outIdx++] = 240 | (u >> 18);
    GROWABLE_HEAP_U8()[outIdx++] = 128 | ((u >> 12) & 63);
    GROWABLE_HEAP_U8()[outIdx++] = 128 | ((u >> 6) & 63);
    GROWABLE_HEAP_U8()[outIdx++] = 128 | (u & 63);
   }
  }
  GROWABLE_HEAP_U8()[outIdx] = 0;
  return outIdx - startIdx;
 },
 UTF16ToString: function(ptr, length) {
  if (!ptr || !length) return "";
  ptr >>>= 0;
  var end = ptr;
  if (length === -1) {
   var idx = end >> 1;
   var HEAPU16 = new Uint16Array(wasmMemory.buffer);
   while (GROWABLE_HEAP_U16()[idx]) ++idx;
   end = idx << 1;
  } else {
   end = ptr + (length >>> 0) * 2;
  }
  length = end - ptr;
  if (length <= 32) {
   return String.fromCharCode.apply(null, new Uint16Array(wasmMemory.buffer, ptr, length / 2));
  }
  var HEAPU8 = new Uint8Array(wasmMemory.buffer);
  return emnapiString.utf16Decoder.decode(GROWABLE_HEAP_U8().slice(ptr, end));
 },
 stringToUTF16: function(str, outPtr, maxBytesToWrite) {
  if (maxBytesToWrite === undefined) {
   maxBytesToWrite = 2147483647;
  }
  if (maxBytesToWrite < 2) return 0;
  maxBytesToWrite -= 2;
  var startPtr = outPtr;
  var numCharsToWrite = (maxBytesToWrite < str.length * 2) ? (maxBytesToWrite / 2) : str.length;
  for (var i = 0; i < numCharsToWrite; ++i) {
   var codeUnit = str.charCodeAt(i);
   GROWABLE_HEAP_I16()[((outPtr) >> 1)] = codeUnit;
   outPtr += 2;
  }
  GROWABLE_HEAP_I16()[((outPtr) >> 1)] = 0;
  return outPtr - startPtr;
 },
 newString: function(env, str, length, result, stringMaker) {
  if (!env) return 1;
  var envObject = emnapiCtx.envStore.get(env);
  envObject.checkGCAccess();
  var autoLength = length === -1;
  var sizelength = length >>> 0;
  if (length !== 0) {
   if (!str) return envObject.setLastError(1);
  }
  if (!result) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ if (!(autoLength || (sizelength <= 2147483647))) return envObject.setLastError(1);
  var strValue = stringMaker(str, autoLength, sizelength);
  var value = emnapiCtx.addToCurrentScope(strValue).id;
  GROWABLE_HEAP_U32()[((result) >> 2)] = value;
  return envObject.clearLastError();
 },
 newExternalString: function(env, str, length, finalize_callback, finalize_hint, result, copied, createApi, stringMaker) {
  if (!env) return 1;
  var envObject = emnapiCtx.envStore.get(env);
  envObject.checkGCAccess();
  var autoLength = length === -1;
  var sizelength = length >>> 0;
  if (length !== 0) {
   if (!str) return envObject.setLastError(1);
  }
  if (!result) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ if (!(autoLength || (sizelength <= 2147483647))) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ var status = createApi(env, str, length, result);
  if (status === 0) /* napi_status.napi_ok */ {
   if (copied) {
    GROWABLE_HEAP_I8()[((copied) >> 0)] = 1;
   }
   if (finalize_callback) {
    envObject.callFinalizer(finalize_callback, str, finalize_hint);
   }
  }
  return status;
 }
};

function emnapiCreateFunction(envObject, utf8name, length, cb, data) {
 var functionName = (!utf8name || !length) ? "" : (emnapiString.UTF8ToString(utf8name, length));
 var f;
 var makeFunction = function() {
  return function() {
   "use strict";
   var cbinfo = emnapiCtx.cbinfoStack.push(this, data, arguments, f);
   var scope = emnapiCtx.openScope(envObject);
   try {
    return envObject.callIntoModule(function(envObject) {
     var napiValue = getWasmTableEntry(cb)(envObject.id, cbinfo);
     return (!napiValue) ? undefined : emnapiCtx.handleStore.get(napiValue).value;
    });
   } finally {
    emnapiCtx.cbinfoStack.pop();
    emnapiCtx.closeScope(envObject, scope);
   }
  };
 };
 if (functionName === "") {
  f = makeFunction();
  return {
   status: 0,
   /* napi_status.napi_ok */ f: f
  };
 }
 if (!(/^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(functionName))) {
  return {
   status: 1,
   /* napi_status.napi_invalid_arg */ f: undefined
  };
 }
 if (emnapiCtx.feature.supportNewFunction) {
  var _ = makeFunction();
  try {
   f = (new Function("_", "return function " + functionName + "(){" + '"use strict";' + "return _.apply(this,arguments);" + "};"))(_);
  } catch (_err) {
   f = makeFunction();
   if (emnapiCtx.feature.canSetFunctionName) Object.defineProperty(f, "name", {
    value: functionName
   });
  }
 } else {
  f = makeFunction();
  if (emnapiCtx.feature.canSetFunctionName) Object.defineProperty(f, "name", {
   value: functionName
  });
 }
 return {
  status: 0,
  /* napi_status.napi_ok */ f: f
 };
}

function _napi_create_function(env, utf8name, length, cb, data, result) {
 var value;
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
 /* napi_status.napi_pending_exception */ if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion === 2147483647 ? /* Version.NAPI_VERSION_EXPERIMENTAL */ 23 : /* napi_status.napi_cannot_run_js */ 10);
 /* napi_status.napi_pending_exception */ envObject.clearLastError();
 try {
  if (!result) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ if (!cb) return envObject.setLastError(1);
  var fresult = emnapiCreateFunction(envObject, utf8name, length, cb, data);
  if (fresult.status !== 0) /* napi_status.napi_ok */ return envObject.setLastError(fresult.status);
  var f = fresult.f;
  var valueHandle = emnapiCtx.addToCurrentScope(f);
  value = valueHandle.id;
  GROWABLE_HEAP_U32()[((result) >> 2)] = value;
  return envObject.getReturnStatus();
 } catch (err) {
  envObject.tryCatch.setError(err);
  return envObject.setLastError(10);
 }
}

/* napi_status.napi_pending_exception */ function _napi_create_object(env, result) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!result) return envObject.setLastError(1);
 var value = emnapiCtx.addToCurrentScope({}).id;
 GROWABLE_HEAP_U32()[((result) >> 2)] = value;
 return envObject.clearLastError();
}

function _napi_create_promise(env, deferred, promise) {
 var deferredObjectId, value;
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
 /* napi_status.napi_pending_exception */ if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion === 2147483647 ? /* Version.NAPI_VERSION_EXPERIMENTAL */ 23 : /* napi_status.napi_cannot_run_js */ 10);
 /* napi_status.napi_pending_exception */ envObject.clearLastError();
 try {
  if (!deferred) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ if (!promise) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ var p = new Promise(function(resolve, reject) {
   var deferredObject = emnapiCtx.createDeferred({
    resolve: resolve,
    reject: reject
   });
   deferredObjectId = deferredObject.id;
   GROWABLE_HEAP_U32()[((deferred) >> 2)] = deferredObjectId;
  });
  value = emnapiCtx.addToCurrentScope(p).id;
  GROWABLE_HEAP_U32()[((promise) >> 2)] = value;
  return envObject.getReturnStatus();
 } catch (err) {
  envObject.tryCatch.setError(err);
  return envObject.setLastError(10);
 }
}

/* napi_status.napi_pending_exception */ function _napi_create_range_error(env, code, msg, result) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!msg) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ if (!result) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ var msgValue = emnapiCtx.handleStore.get(msg).value;
 if (typeof msgValue !== "string") {
  return envObject.setLastError(3);
 }
 /* napi_status.napi_string_expected */ var error = new RangeError(msgValue);
 if (code) {
  var codeValue = emnapiCtx.handleStore.get(code).value;
  if (typeof codeValue !== "string") {
   return envObject.setLastError(3);
  }
  error.code = codeValue;
 }
 var value = emnapiCtx.addToCurrentScope(error).id;
 GROWABLE_HEAP_U32()[((result) >> 2)] = value;
 return envObject.clearLastError();
}

function _napi_create_reference(env, value, initial_refcount, result) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!value) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ if (!result) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ var handle = emnapiCtx.handleStore.get(value);
 if (envObject.moduleApiVersion !== 2147483647) /* Version.NAPI_VERSION_EXPERIMENTAL */ {
  if (!(handle.isObject() || handle.isFunction() || handle.isSymbol())) {
   return envObject.setLastError(1);
  }
 }
 var ref = emnapiCtx.createReference(envObject, handle.id, initial_refcount >>> 0, 1);
 GROWABLE_HEAP_U32()[((result) >> 2)] = ref.id;
 return envObject.clearLastError();
}

function _napi_create_string_latin1(env, str, length, result) {
 return emnapiString.newString(env, str, length, result, function(str, autoLength, sizeLength) {
  var latin1String = "";
  var len = 0;
  if (autoLength) {
   while (true) {
    var ch = GROWABLE_HEAP_U8()[((str) >> 0)];
    if (!ch) break;
    latin1String += String.fromCharCode(ch);
    str++;
   }
  } else {
   while (len < sizeLength) {
    var ch = GROWABLE_HEAP_U8()[((str) >> 0)];
    if (!ch) break;
    latin1String += String.fromCharCode(ch);
    len++;
    str++;
   }
  }
  return latin1String;
 });
}

function _napi_create_string_utf8(env, str, length, result) {
 return emnapiString.newString(env, str, length, result, function(str) {
  return emnapiString.UTF8ToString(str, length);
 });
}

function _napi_create_type_error(env, code, msg, result) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!msg) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ if (!result) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ var msgValue = emnapiCtx.handleStore.get(msg).value;
 if (typeof msgValue !== "string") {
  return envObject.setLastError(3);
 }
 /* napi_status.napi_string_expected */ var error = new TypeError(msgValue);
 if (code) {
  var codeValue = emnapiCtx.handleStore.get(code).value;
  if (typeof codeValue !== "string") {
   return envObject.setLastError(3);
  }
  error.code = codeValue;
 }
 var value = emnapiCtx.addToCurrentScope(error).id;
 GROWABLE_HEAP_U32()[((result) >> 2)] = value;
 return envObject.clearLastError();
}

function emnapiDefineProperty(envObject, obj, propertyName, method, getter, setter, value, attributes, data) {
 if (getter || setter) {
  var localGetter = void 0;
  var localSetter = void 0;
  if (getter) {
   localGetter = emnapiCreateFunction(envObject, 0, 0, getter, data).f;
  }
  if (setter) {
   localSetter = emnapiCreateFunction(envObject, 0, 0, setter, data).f;
  }
  var desc = {
   configurable: (attributes & 4) !== /* napi_property_attributes.napi_configurable */ 0,
   enumerable: (attributes & 2) !== /* napi_property_attributes.napi_enumerable */ 0,
   get: localGetter,
   set: localSetter
  };
  Object.defineProperty(obj, propertyName, desc);
 } else if (method) {
  var localMethod = emnapiCreateFunction(envObject, 0, 0, method, data).f;
  var desc = {
   configurable: (attributes & 4) !== /* napi_property_attributes.napi_configurable */ 0,
   enumerable: (attributes & 2) !== /* napi_property_attributes.napi_enumerable */ 0,
   writable: (attributes & 1) !== /* napi_property_attributes.napi_writable */ 0,
   value: localMethod
  };
  Object.defineProperty(obj, propertyName, desc);
 } else {
  var desc = {
   configurable: (attributes & 4) !== /* napi_property_attributes.napi_configurable */ 0,
   enumerable: (attributes & 2) !== /* napi_property_attributes.napi_enumerable */ 0,
   writable: (attributes & 1) !== /* napi_property_attributes.napi_writable */ 0,
   value: emnapiCtx.handleStore.get(value).value
  };
  Object.defineProperty(obj, propertyName, desc);
 }
}

function _napi_define_class(env, utf8name, length, constructor, callback_data, property_count, properties, result) {
 var propPtr, valueHandleId, attributes;
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
 /* napi_status.napi_pending_exception */ if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion === 2147483647 ? /* Version.NAPI_VERSION_EXPERIMENTAL */ 23 : /* napi_status.napi_cannot_run_js */ 10);
 /* napi_status.napi_pending_exception */ envObject.clearLastError();
 try {
  if (!result) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ if (!constructor) return envObject.setLastError(1);
  property_count = property_count >>> 0;
  if (property_count > 0) {
   if (!properties) return envObject.setLastError(1);
  }
  if ((length < -1) || (length > 2147483647) || (!utf8name)) {
   return envObject.setLastError(1);
  }
  var fresult = emnapiCreateFunction(envObject, utf8name, length, constructor, callback_data);
  if (fresult.status !== 0) /* napi_status.napi_ok */ return envObject.setLastError(fresult.status);
  var F = fresult.f;
  var propertyName = void 0;
  for (var i = 0; i < property_count; i++) {
   propPtr = properties + (i * (4 * 8));
   var utf8Name = GROWABLE_HEAP_U32()[((propPtr) >> 2)];
   var name_1 = GROWABLE_HEAP_U32()[(((propPtr) + (4)) >> 2)];
   var method = GROWABLE_HEAP_U32()[(((propPtr) + (8)) >> 2)];
   var getter = GROWABLE_HEAP_U32()[(((propPtr) + (12)) >> 2)];
   var setter = GROWABLE_HEAP_U32()[(((propPtr) + (16)) >> 2)];
   var value = GROWABLE_HEAP_U32()[(((propPtr) + (20)) >> 2)];
   attributes = GROWABLE_HEAP_I32()[(((propPtr) + (24)) >> 2)];
   var data = GROWABLE_HEAP_U32()[(((propPtr) + (28)) >> 2)];
   if (utf8Name) {
    propertyName = emnapiString.UTF8ToString(utf8Name, -1);
   } else {
    if (!name_1) {
     return envObject.setLastError(4);
    }
    propertyName = emnapiCtx.handleStore.get(name_1).value;
    if (typeof propertyName !== "string" && typeof propertyName !== "symbol") {
     return envObject.setLastError(4);
    }
   }
   if ((attributes & 1024) !== /* napi_property_attributes.napi_static */ 0) {
    emnapiDefineProperty(envObject, F, propertyName, method, getter, setter, value, attributes, data);
    continue;
   }
   emnapiDefineProperty(envObject, F.prototype, propertyName, method, getter, setter, value, attributes, data);
  }
  var valueHandle = emnapiCtx.addToCurrentScope(F);
  valueHandleId = valueHandle.id;
  GROWABLE_HEAP_U32()[((result) >> 2)] = valueHandleId;
  return envObject.getReturnStatus();
 } catch (err) {
  envObject.tryCatch.setError(err);
  return envObject.setLastError(10);
 }
}

function _napi_define_properties(env, object, property_count, properties) {
 var propPtr, attributes;
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
 /* napi_status.napi_pending_exception */ if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion === 2147483647 ? /* Version.NAPI_VERSION_EXPERIMENTAL */ 23 : /* napi_status.napi_cannot_run_js */ 10);
 /* napi_status.napi_pending_exception */ envObject.clearLastError();
 try {
  property_count = property_count >>> 0;
  if (property_count > 0) {
   if (!properties) return envObject.setLastError(1);
  }
  if (!object) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ var h = emnapiCtx.handleStore.get(object);
  var maybeObject = h.value;
  if (!(h.isObject() || h.isFunction())) {
   return envObject.setLastError(2);
  }
  var propertyName = void 0;
  for (var i = 0; i < property_count; i++) {
   propPtr = properties + (i * (4 * 8));
   var utf8Name = GROWABLE_HEAP_U32()[((propPtr) >> 2)];
   var name_2 = GROWABLE_HEAP_U32()[(((propPtr) + (4)) >> 2)];
   var method = GROWABLE_HEAP_U32()[(((propPtr) + (8)) >> 2)];
   var getter = GROWABLE_HEAP_U32()[(((propPtr) + (12)) >> 2)];
   var setter = GROWABLE_HEAP_U32()[(((propPtr) + (16)) >> 2)];
   var value = GROWABLE_HEAP_U32()[(((propPtr) + (20)) >> 2)];
   attributes = GROWABLE_HEAP_I32()[(((propPtr) + (24)) >> 2)];
   var data = GROWABLE_HEAP_U32()[(((propPtr) + (28)) >> 2)];
   if (utf8Name) {
    propertyName = emnapiString.UTF8ToString(utf8Name, -1);
   } else {
    if (!name_2) {
     return envObject.setLastError(4);
    }
    propertyName = emnapiCtx.handleStore.get(name_2).value;
    if (typeof propertyName !== "string" && typeof propertyName !== "symbol") {
     return envObject.setLastError(4);
    }
   }
   emnapiDefineProperty(envObject, maybeObject, propertyName, method, getter, setter, value, attributes, data);
  }
  return envObject.getReturnStatus();
 } catch (err) {
  envObject.tryCatch.setError(err);
  return envObject.setLastError(10);
 }
}

/* napi_status.napi_pending_exception */ function _napi_delete_reference(env, ref) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!ref) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ emnapiCtx.refStore.get(ref).dispose();
 return envObject.clearLastError();
}

function _napi_escape_handle(env, scope, escapee, result) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!scope) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ if (!escapee) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ if (!result) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ var scopeObject = emnapiCtx.scopeStore.get(scope);
 if (!scopeObject.escapeCalled()) {
  var newHandle = scopeObject.escape(escapee);
  var value = newHandle ? newHandle.id : 0;
  GROWABLE_HEAP_U32()[((result) >> 2)] = value;
  return envObject.clearLastError();
 }
 return envObject.setLastError(12);
}

/* napi_status.napi_escape_called_twice */ function _napi_fatal_error(location, location_len, message, message_len) {
 var locationStr = emnapiString.UTF8ToString(location, location_len);
 var messageStr = emnapiString.UTF8ToString(message, message_len);
 if (emnapiNodeBinding) {
  emnapiNodeBinding.napi.fatalError(locationStr, messageStr);
 } else {
  abort("FATAL ERROR: " + locationStr + " " + messageStr);
 }
}

function _napi_get_and_clear_last_exception(env, result) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!result) return envObject.setLastError(1);
 if (!envObject.tryCatch.hasCaught()) {
  GROWABLE_HEAP_U32()[((result) >> 2)] = 1;
  return envObject.clearLastError();
 } else {
  var err = envObject.tryCatch.exception();
  var value = envObject.ensureHandleId(err);
  GROWABLE_HEAP_U32()[((result) >> 2)] = value;
  envObject.tryCatch.reset();
 }
 return envObject.clearLastError();
}

function _napi_get_array_length(env, value, result) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
 /* napi_status.napi_pending_exception */ if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion === 2147483647 ? /* Version.NAPI_VERSION_EXPERIMENTAL */ 23 : /* napi_status.napi_cannot_run_js */ 10);
 /* napi_status.napi_pending_exception */ envObject.clearLastError();
 try {
  if (!value) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ if (!result) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ var handle = emnapiCtx.handleStore.get(value);
  if (!handle.isArray()) {
   return envObject.setLastError(8);
  }
  var v = handle.value.length >>> 0;
  GROWABLE_HEAP_U32()[((result) >> 2)] = v;
  return envObject.getReturnStatus();
 } catch (err) {
  envObject.tryCatch.setError(err);
  return envObject.setLastError(10);
 }
}

function _napi_get_arraybuffer_info(env, arraybuffer, data, byte_length) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!arraybuffer) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ var handle = emnapiCtx.handleStore.get(arraybuffer);
 if (!handle.isArrayBuffer()) {
  return envObject.setLastError(1);
 }
 /* napi_status.napi_invalid_arg */ if (data) {
  var p = emnapiExternalMemory.getArrayBufferPointer(handle.value, true).address;
  GROWABLE_HEAP_U32()[((data) >> 2)] = p;
 }
 if (byte_length) {
  GROWABLE_HEAP_U32()[((byte_length) >> 2)] = handle.value.byteLength;
 }
 return envObject.clearLastError();
}

function _napi_get_boolean(env, value, result) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!result) return envObject.setLastError(1);
 var v = value === 0 ? 3 : /* GlobalHandle.FALSE */ 4;
 /* GlobalHandle.TRUE */ GROWABLE_HEAP_U32()[((result) >> 2)] = v;
 return envObject.clearLastError();
}

function _napi_get_cb_info(env, cbinfo, argc, argv, this_arg, data) {
 if (!env) return 1;
 /* napi_status.napi_invalid_arg */ var envObject = emnapiCtx.envStore.get(env);
 if (!cbinfo) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ var cbinfoValue = emnapiCtx.cbinfoStack.get(cbinfo);
 if (argv) {
  if (!argc) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ var argcValue = GROWABLE_HEAP_U32()[((argc) >> 2)];
  var len = cbinfoValue.args.length;
  var arrlen = argcValue < len ? argcValue : len;
  var i = 0;
  for (;i < arrlen; i++) {
   var argVal = envObject.ensureHandleId(cbinfoValue.args[i]);
   GROWABLE_HEAP_U32()[(((argv) + (i * 4)) >> 2)] = argVal;
  }
  if (i < argcValue) {
   for (;i < argcValue; i++) {
    GROWABLE_HEAP_U32()[(((argv) + (i * 4)) >> 2)] = 1;
   }
  }
 }
 if (argc) {
  GROWABLE_HEAP_U32()[((argc) >> 2)] = cbinfoValue.args.length;
 }
 if (this_arg) {
  var v = envObject.ensureHandleId(cbinfoValue.thiz);
  GROWABLE_HEAP_U32()[((this_arg) >> 2)] = v;
 }
 if (data) {
  GROWABLE_HEAP_U32()[((data) >> 2)] = cbinfoValue.data;
 }
 return envObject.clearLastError();
}

function _napi_get_element(env, object, index, result) {
 var value;
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
 /* napi_status.napi_pending_exception */ if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion === 2147483647 ? /* Version.NAPI_VERSION_EXPERIMENTAL */ 23 : /* napi_status.napi_cannot_run_js */ 10);
 /* napi_status.napi_pending_exception */ envObject.clearLastError();
 try {
  if (!result) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ if (!object) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ var h = emnapiCtx.handleStore.get(object);
  if (h.value == null) {
   throw new TypeError("Cannot convert undefined or null to object");
  }
  var v = void 0;
  try {
   v = h.isObject() || h.isFunction() ? h.value : Object(h.value);
  } catch (_) {
   return envObject.setLastError(2);
  }
  value = envObject.ensureHandleId(v[index >>> 0]);
  GROWABLE_HEAP_U32()[((result) >> 2)] = value;
  return envObject.getReturnStatus();
 } catch (err) {
  envObject.tryCatch.setError(err);
  return envObject.setLastError(10);
 }
}

/* napi_status.napi_pending_exception */ function _napi_get_global(env, result) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!result) return envObject.setLastError(1);
 var value = 5;
 /* GlobalHandle.GLOBAL */ GROWABLE_HEAP_U32()[((result) >> 2)] = value;
 return envObject.clearLastError();
}

function _napi_get_instance_data(env, data) {
 if (!env) return 1;
 /* napi_status.napi_invalid_arg */ var envObject = emnapiCtx.envStore.get(env);
 if (!data) return envObject.setLastError(1);
 var value = envObject.getInstanceData();
 GROWABLE_HEAP_U32()[((data) >> 2)] = value;
 return envObject.clearLastError();
}

function _napi_get_named_property(env, object, utf8name, result) {
 var value;
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
 /* napi_status.napi_pending_exception */ if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion === 2147483647 ? /* Version.NAPI_VERSION_EXPERIMENTAL */ 23 : /* napi_status.napi_cannot_run_js */ 10);
 /* napi_status.napi_pending_exception */ envObject.clearLastError();
 try {
  if (!result) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ if (!object) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ if (!utf8name) {
   return envObject.setLastError(1);
  }
  var h = emnapiCtx.handleStore.get(object);
  if (h.value == null) {
   throw new TypeError("Cannot convert undefined or null to object");
  }
  var v = void 0;
  try {
   v = h.isObject() || h.isFunction() ? h.value : Object(h.value);
  } catch (_) {
   return envObject.setLastError(2);
  }
  value = envObject.ensureHandleId(v[emnapiString.UTF8ToString(utf8name, -1)]);
  GROWABLE_HEAP_U32()[((result) >> 2)] = value;
  return envObject.getReturnStatus();
 } catch (err) {
  envObject.tryCatch.setError(err);
  return envObject.setLastError(10);
 }
}

/* napi_status.napi_pending_exception */ function _napi_get_new_target(env, cbinfo, result) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!cbinfo) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ if (!result) return envObject.setLastError(1);
 var cbinfoValue = emnapiCtx.cbinfoStack.get(cbinfo);
 var value = cbinfoValue.getNewTarget(envObject);
 GROWABLE_HEAP_U32()[((result) >> 2)] = value;
 return envObject.clearLastError();
}

function _napi_get_null(env, result) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!result) return envObject.setLastError(1);
 var value = 2;
 /* GlobalHandle.NULL */ GROWABLE_HEAP_U32()[((result) >> 2)] = value;
 return envObject.clearLastError();
}

function _napi_get_property(env, object, key, result) {
 var value;
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
 /* napi_status.napi_pending_exception */ if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion === 2147483647 ? /* Version.NAPI_VERSION_EXPERIMENTAL */ 23 : /* napi_status.napi_cannot_run_js */ 10);
 /* napi_status.napi_pending_exception */ envObject.clearLastError();
 try {
  if (!key) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ if (!result) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ if (!object) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ var h = emnapiCtx.handleStore.get(object);
  if (h.value == null) {
   throw new TypeError("Cannot convert undefined or null to object");
  }
  var v = void 0;
  try {
   v = h.isObject() || h.isFunction() ? h.value : Object(h.value);
  } catch (_) {
   return envObject.setLastError(2);
  }
  value = envObject.ensureHandleId(v[emnapiCtx.handleStore.get(key).value]);
  GROWABLE_HEAP_U32()[((result) >> 2)] = value;
  return envObject.getReturnStatus();
 } catch (err) {
  envObject.tryCatch.setError(err);
  return envObject.setLastError(10);
 }
}

/* napi_status.napi_pending_exception */ function _napi_get_all_property_names(env, object, key_mode, key_filter, key_conversion, result) {
 var value;
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
 /* napi_status.napi_pending_exception */ if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion === 2147483647 ? /* Version.NAPI_VERSION_EXPERIMENTAL */ 23 : /* napi_status.napi_cannot_run_js */ 10);
 /* napi_status.napi_pending_exception */ envObject.clearLastError();
 try {
  if (!result) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ if (!object) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ var h = emnapiCtx.handleStore.get(object);
  if (h.value == null) {
   throw new TypeError("Cannot convert undefined or null to object");
  }
  var obj = void 0;
  try {
   obj = h.isObject() || h.isFunction() ? h.value : Object(h.value);
  } catch (_) {
   return envObject.setLastError(2);
  }
  if (key_mode !== 0 && /* napi_key_collection_mode.napi_key_include_prototypes */ key_mode !== 1) /* napi_key_collection_mode.napi_key_own_only */ {
   return envObject.setLastError(1);
  }
  if (key_conversion !== 0 && /* napi_key_conversion.napi_key_keep_numbers */ key_conversion !== 1) /* napi_key_conversion.napi_key_numbers_to_strings */ {
   return envObject.setLastError(1);
  }
  var props = [];
  var names = void 0;
  var symbols = void 0;
  var i = void 0;
  var own = true;
  var integerIndiceRegex = /^(0|[1-9][0-9]*)$/;
  do {
   names = Object.getOwnPropertyNames(obj);
   symbols = Object.getOwnPropertySymbols(obj);
   for (i = 0; i < names.length; i++) {
    props.push({
     name: integerIndiceRegex.test(names[i]) ? Number(names[i]) : names[i],
     desc: Object.getOwnPropertyDescriptor(obj, names[i]),
     own: own
    });
   }
   for (i = 0; i < symbols.length; i++) {
    props.push({
     name: symbols[i],
     desc: Object.getOwnPropertyDescriptor(obj, symbols[i]),
     own: own
    });
   }
   if (key_mode === 1) /* napi_key_collection_mode.napi_key_own_only */ {
    break;
   }
   obj = Object.getPrototypeOf(obj);
   own = false;
  } while (obj);
  var ret = [];
  var addName = function(ret, name, key_filter, conversion_mode) {
   if (ret.indexOf(name) !== -1) return;
   if (conversion_mode === 0) /* napi_key_conversion.napi_key_keep_numbers */ {
    ret.push(name);
   } else if (conversion_mode === 1) /* napi_key_conversion.napi_key_numbers_to_strings */ {
    var realName = typeof name === "number" ? String(name) : name;
    if (typeof realName === "string") {
     if (!(key_filter & 8)) /* napi_key_filter.napi_key_skip_strings */ {
      ret.push(realName);
     }
    } else {
     ret.push(realName);
    }
   }
  };
  for (i = 0; i < props.length; i++) {
   var prop = props[i];
   var name_1 = prop.name;
   var desc = prop.desc;
   if (key_filter === 0) /* napi_key_filter.napi_key_all_properties */ {
    addName(ret, name_1, key_filter, key_conversion);
   } else {
    if (key_filter & 8 && /* napi_key_filter.napi_key_skip_strings */ typeof name_1 === "string") {
     continue;
    }
    if (key_filter & 16 && /* napi_key_filter.napi_key_skip_symbols */ typeof name_1 === "symbol") {
     continue;
    }
    var shouldAdd = true;
    switch (key_filter & 7) {
    case 1:
     /* napi_key_filter.napi_key_writable */ {
      shouldAdd = Boolean(desc.writable);
      break;
     }

    case 2:
     /* napi_key_filter.napi_key_enumerable */ {
      shouldAdd = Boolean(desc.enumerable);
      break;
     }

    case (1 | /* napi_key_filter.napi_key_writable */ 2):
     /* napi_key_filter.napi_key_enumerable */ {
      shouldAdd = Boolean(desc.writable && desc.enumerable);
      break;
     }

    case 4:
     /* napi_key_filter.napi_key_configurable */ {
      shouldAdd = Boolean(desc.configurable);
      break;
     }

    case (4 | /* napi_key_filter.napi_key_configurable */ 1):
     /* napi_key_filter.napi_key_writable */ {
      shouldAdd = Boolean(desc.configurable && desc.writable);
      break;
     }

    case (4 | /* napi_key_filter.napi_key_configurable */ 2):
     /* napi_key_filter.napi_key_enumerable */ {
      shouldAdd = Boolean(desc.configurable && desc.enumerable);
      break;
     }

    case (4 | /* napi_key_filter.napi_key_configurable */ 2 | /* napi_key_filter.napi_key_enumerable */ 1):
     /* napi_key_filter.napi_key_writable */ {
      shouldAdd = Boolean(desc.configurable && desc.enumerable && desc.writable);
      break;
     }
    }
    if (shouldAdd) {
     addName(ret, name_1, key_filter, key_conversion);
    }
   }
  }
  value = emnapiCtx.addToCurrentScope(ret).id;
  GROWABLE_HEAP_U32()[((result) >> 2)] = value;
  return envObject.getReturnStatus();
 } catch (err) {
  envObject.tryCatch.setError(err);
  return envObject.setLastError(10);
 }
}

/* napi_status.napi_pending_exception */ function _napi_get_property_names(env, object, result) {
 return _napi_get_all_property_names(env, object, 0, /* napi_key_collection_mode.napi_key_include_prototypes */ 2 | /* napi_key_filter.napi_key_enumerable */ 16, /* napi_key_filter.napi_key_skip_symbols */ 1, /* napi_key_conversion.napi_key_numbers_to_strings */ result);
}

function _napi_get_reference_value(env, ref, result) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!ref) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ if (!result) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ var reference = emnapiCtx.refStore.get(ref);
 var handleId = reference.get();
 GROWABLE_HEAP_U32()[((result) >> 2)] = handleId;
 return envObject.clearLastError();
}

function _napi_get_undefined(env, result) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!result) return envObject.setLastError(1);
 var value = 1;
 /* GlobalHandle.UNDEFINED */ GROWABLE_HEAP_U32()[((result) >> 2)] = value;
 return envObject.clearLastError();
}

function _napi_get_value_external(env, value, result) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!value) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ if (!result) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ var handle = emnapiCtx.handleStore.get(value);
 if (!handle.isExternal()) {
  return envObject.setLastError(1);
 }
 var p = handle.data(envObject);
 GROWABLE_HEAP_U32()[((result) >> 2)] = p;
 return envObject.clearLastError();
}

function _napi_get_value_int32(env, value, result) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!value) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ if (!result) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ var handle = emnapiCtx.handleStore.get(value);
 if (typeof handle.value !== "number") {
  return envObject.setLastError(6);
 }
 var v = new Int32Array([ handle.value ])[0];
 GROWABLE_HEAP_I32()[((result) >> 2)] = v;
 return envObject.clearLastError();
}

function emnapiSetValueI64(result, numberValue) {
 var tempDouble;
 var tempI64 = [ numberValue >>> 0, (tempDouble = numberValue, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0) ];
 GROWABLE_HEAP_I32()[((result) >> 2)] = tempI64[0];
 GROWABLE_HEAP_I32()[(((result) + (4)) >> 2)] = tempI64[1];
}

function _napi_get_value_int64(env, value, result) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!value) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ if (!result) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ var handle = emnapiCtx.handleStore.get(value);
 if (typeof handle.value !== "number") {
  return envObject.setLastError(6);
 }
 /* napi_status.napi_number_expected */ var numberValue = handle.value;
 if (numberValue === Number.POSITIVE_INFINITY || numberValue === Number.NEGATIVE_INFINITY || isNaN(numberValue)) {
  GROWABLE_HEAP_I32()[((result) >> 2)] = 0;
  GROWABLE_HEAP_I32()[(((result) + (4)) >> 2)] = 0;
 } else if (numberValue < /* INT64_RANGE_NEGATIVE */ -0x8000000000000000) {
  GROWABLE_HEAP_I32()[((result) >> 2)] = 0;
  GROWABLE_HEAP_I32()[(((result) + (4)) >> 2)] = 2147483648;
 } else if (numberValue >= /* INT64_RANGE_POSITIVE */ 0x8000000000000000) {
  GROWABLE_HEAP_U32()[((result) >> 2)] = 4294967295;
  GROWABLE_HEAP_U32()[(((result) + (4)) >> 2)] = 2147483647;
 } else {
  emnapiSetValueI64(result, Math.trunc(numberValue));
 }
 return envObject.clearLastError();
}

function _napi_get_value_string_utf8(env, value, buf, buf_size, result) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!value) return envObject.setLastError(1);
 buf_size = buf_size >>> 0;
 var handle = emnapiCtx.handleStore.get(value);
 if (typeof handle.value !== "string") {
  return envObject.setLastError(3);
 }
 /* napi_status.napi_string_expected */ if (!buf) {
  if (!result) return envObject.setLastError(1);
  var strLength = emnapiString.lengthBytesUTF8(handle.value);
  GROWABLE_HEAP_U32()[((result) >> 2)] = strLength;
 } else if (buf_size !== 0) {
  var copied = emnapiString.stringToUTF8(handle.value, buf, buf_size);
  if (result) {
   GROWABLE_HEAP_U32()[((result) >> 2)] = copied;
  }
 } else if (result) {
  GROWABLE_HEAP_U32()[((result) >> 2)] = 0;
 }
 return envObject.clearLastError();
}

function _napi_get_value_uint32(env, value, result) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!value) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ if (!result) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ var handle = emnapiCtx.handleStore.get(value);
 if (typeof handle.value !== "number") {
  return envObject.setLastError(6);
 }
 var v = new Uint32Array([ handle.value ])[0];
 GROWABLE_HEAP_U32()[((result) >> 2)] = v;
 return envObject.clearLastError();
}

function _napi_has_property(env, object, key, result) {
 var r;
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
 /* napi_status.napi_pending_exception */ if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion === 2147483647 ? /* Version.NAPI_VERSION_EXPERIMENTAL */ 23 : /* napi_status.napi_cannot_run_js */ 10);
 /* napi_status.napi_pending_exception */ envObject.clearLastError();
 try {
  if (!key) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ if (!result) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ if (!object) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ var h = emnapiCtx.handleStore.get(object);
  if (h.value == null) {
   throw new TypeError("Cannot convert undefined or null to object");
  }
  var v = void 0;
  try {
   v = h.isObject() || h.isFunction() ? h.value : Object(h.value);
  } catch (_) {
   return envObject.setLastError(2);
  }
  r = (emnapiCtx.handleStore.get(key).value in v) ? 1 : 0;
  GROWABLE_HEAP_I8()[((result) >> 0)] = r;
  return envObject.getReturnStatus();
 } catch (err) {
  envObject.tryCatch.setError(err);
  return envObject.setLastError(10);
 }
}

/* napi_status.napi_pending_exception */ function _napi_instanceof(env, object, constructor, result) {
 var r;
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
 /* napi_status.napi_pending_exception */ if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion === 2147483647 ? /* Version.NAPI_VERSION_EXPERIMENTAL */ 23 : /* napi_status.napi_cannot_run_js */ 10);
 /* napi_status.napi_pending_exception */ envObject.clearLastError();
 try {
  if (!object) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ if (!result) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ if (!constructor) return envObject.setLastError(1);
  GROWABLE_HEAP_I8()[((result) >> 0)] = 0;
  var ctor = emnapiCtx.handleStore.get(constructor);
  if (!ctor.isFunction()) {
   return envObject.setLastError(5);
  }
  var val = emnapiCtx.handleStore.get(object).value;
  var ret = val instanceof ctor.value;
  r = ret ? 1 : 0;
  GROWABLE_HEAP_I8()[((result) >> 0)] = r;
  return envObject.getReturnStatus();
 } catch (err) {
  envObject.tryCatch.setError(err);
  return envObject.setLastError(10);
 }
}

/* napi_status.napi_pending_exception */ function _napi_is_array(env, value, result) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!value) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ if (!result) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ var h = emnapiCtx.handleStore.get(value);
 var r = h.isArray() ? 1 : 0;
 GROWABLE_HEAP_I8()[((result) >> 0)] = r;
 return envObject.clearLastError();
}

function _napi_is_arraybuffer(env, value, result) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!value) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ if (!result) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ var h = emnapiCtx.handleStore.get(value);
 var r = h.isArrayBuffer() ? 1 : 0;
 GROWABLE_HEAP_I8()[((result) >> 0)] = r;
 return envObject.clearLastError();
}

function _napi_is_exception_pending(env, result) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!result) return envObject.setLastError(1);
 var r = envObject.tryCatch.hasCaught();
 GROWABLE_HEAP_I8()[((result) >> 0)] = r ? 1 : 0;
 return envObject.clearLastError();
}

function _napi_is_promise(env, value, is_promise) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!value) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ if (!is_promise) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ var h = emnapiCtx.handleStore.get(value);
 var r = h.isPromise() ? 1 : 0;
 GROWABLE_HEAP_I8()[((is_promise) >> 0)] = r;
 return envObject.clearLastError();
}

function _napi_new_instance(env, constructor, argc, argv, result) {
 var i;
 var v;
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
 /* napi_status.napi_pending_exception */ if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion === 2147483647 ? /* Version.NAPI_VERSION_EXPERIMENTAL */ 23 : /* napi_status.napi_cannot_run_js */ 10);
 /* napi_status.napi_pending_exception */ envObject.clearLastError();
 try {
  if (!constructor) return envObject.setLastError(1);
  argc = argc >>> 0;
  if (argc > 0) {
   if (!argv) return envObject.setLastError(1);
  }
  if (!result) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ var Ctor = emnapiCtx.handleStore.get(constructor).value;
  if (typeof Ctor !== "function") return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ var ret = void 0;
  if (emnapiCtx.feature.supportReflect) {
   var argList = Array(argc);
   for (i = 0; i < argc; i++) {
    var argVal = GROWABLE_HEAP_U32()[(((argv) + (i * 4)) >> 2)];
    argList[i] = emnapiCtx.handleStore.get(argVal).value;
   }
   ret = Reflect.construct(Ctor, argList, Ctor);
  } else {
   var args = Array(argc + 1);
   args[0] = undefined;
   for (i = 0; i < argc; i++) {
    var argVal = GROWABLE_HEAP_U32()[(((argv) + (i * 4)) >> 2)];
    args[i + 1] = emnapiCtx.handleStore.get(argVal).value;
   }
   var BoundCtor = Ctor.bind.apply(Ctor, args);
   ret = new BoundCtor;
  }
  if (result) {
   v = envObject.ensureHandleId(ret);
   GROWABLE_HEAP_U32()[((result) >> 2)] = v;
  }
  return envObject.getReturnStatus();
 } catch (err) {
  envObject.tryCatch.setError(err);
  return envObject.setLastError(10);
 }
}

/* napi_status.napi_pending_exception */ function _napi_open_escapable_handle_scope(env, result) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!result) return envObject.setLastError(1);
 var scope = emnapiCtx.openScope(envObject);
 GROWABLE_HEAP_U32()[((result) >> 2)] = scope.id;
 return envObject.clearLastError();
}

function _napi_open_handle_scope(env, result) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!result) return envObject.setLastError(1);
 var scope = emnapiCtx.openScope(envObject);
 GROWABLE_HEAP_U32()[((result) >> 2)] = scope.id;
 return envObject.clearLastError();
}

function _napi_reject_deferred(env, deferred, resolution) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
 /* napi_status.napi_pending_exception */ if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion === 2147483647 ? /* Version.NAPI_VERSION_EXPERIMENTAL */ 23 : /* napi_status.napi_cannot_run_js */ 10);
 /* napi_status.napi_pending_exception */ envObject.clearLastError();
 try {
  if (!deferred) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ if (!resolution) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ var deferredObject = emnapiCtx.deferredStore.get(deferred);
  deferredObject.reject(emnapiCtx.handleStore.get(resolution).value);
  return envObject.getReturnStatus();
 } catch (err) {
  envObject.tryCatch.setError(err);
  return envObject.setLastError(10);
 }
}

/* napi_status.napi_pending_exception */ function _napi_remove_env_cleanup_hook(env, fun, arg) {
 if (!env) return 1;
 /* napi_status.napi_invalid_arg */ var envObject = emnapiCtx.envStore.get(env);
 if (!fun) return envObject.setLastError(1);
 emnapiCtx.removeCleanupHook(envObject, fun, arg);
 return 0;
}

/* napi_status.napi_ok */ function emnapiUnwrap(env, js_object, result, action) {
 var data;
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
 /* napi_status.napi_pending_exception */ if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion === 2147483647 ? /* Version.NAPI_VERSION_EXPERIMENTAL */ 23 : /* napi_status.napi_cannot_run_js */ 10);
 /* napi_status.napi_pending_exception */ envObject.clearLastError();
 try {
  if (!js_object) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ if (action === 0) /* UnwrapAction.KeepWrap */ {
   if (!result) return envObject.setLastError(1);
  }
  var value = emnapiCtx.handleStore.get(js_object);
  if (!(value.isObject() || value.isFunction())) {
   return envObject.setLastError(1);
  }
  var binding = envObject.getObjectBinding(value.value);
  var referenceId = binding.wrapped;
  var ref = emnapiCtx.refStore.get(referenceId);
  if (!ref) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ if (result) {
   data = ref.data();
   GROWABLE_HEAP_U32()[((result) >> 2)] = data;
  }
  if (action === 1) /* UnwrapAction.RemoveWrap */ {
   binding.wrapped = 0;
   if (ref.ownership() === 1) /* Ownership.kUserland */ {
    ref.resetFinalizer();
   } else {
    ref.dispose();
   }
  }
  return envObject.getReturnStatus();
 } catch (err) {
  envObject.tryCatch.setError(err);
  return envObject.setLastError(10);
 }
}

/* napi_status.napi_pending_exception */ function _napi_remove_wrap(env, js_object, result) {
 return emnapiUnwrap(env, js_object, result, 1);
}

/* UnwrapAction.RemoveWrap */ function _napi_resolve_deferred(env, deferred, resolution) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
 /* napi_status.napi_pending_exception */ if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion === 2147483647 ? /* Version.NAPI_VERSION_EXPERIMENTAL */ 23 : /* napi_status.napi_cannot_run_js */ 10);
 /* napi_status.napi_pending_exception */ envObject.clearLastError();
 try {
  if (!deferred) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ if (!resolution) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ var deferredObject = emnapiCtx.deferredStore.get(deferred);
  deferredObject.resolve(emnapiCtx.handleStore.get(resolution).value);
  return envObject.getReturnStatus();
 } catch (err) {
  envObject.tryCatch.setError(err);
  return envObject.setLastError(10);
 }
}

/* napi_status.napi_pending_exception */ function _napi_set_element(env, object, index, value) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
 /* napi_status.napi_pending_exception */ if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion === 2147483647 ? /* Version.NAPI_VERSION_EXPERIMENTAL */ 23 : /* napi_status.napi_cannot_run_js */ 10);
 /* napi_status.napi_pending_exception */ envObject.clearLastError();
 try {
  if (!value) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ if (!object) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ var h = emnapiCtx.handleStore.get(object);
  if (!(h.isObject() || h.isFunction())) {
   return envObject.setLastError(2);
  }
  h.value[index >>> 0] = emnapiCtx.handleStore.get(value).value;
  return envObject.getReturnStatus();
 } catch (err) {
  envObject.tryCatch.setError(err);
  return envObject.setLastError(10);
 }
}

/* napi_status.napi_pending_exception */ function _napi_set_instance_data(env, data, finalize_cb, finalize_hint) {
 if (!env) return 1;
 /* napi_status.napi_invalid_arg */ var envObject = emnapiCtx.envStore.get(env);
 envObject.setInstanceData(data, finalize_cb, finalize_hint);
 return envObject.clearLastError();
}

function _napi_set_last_error(env, error_code, engine_error_code, engine_reserved) {
 var envObject = emnapiCtx.envStore.get(env);
 return envObject.setLastError(error_code, engine_error_code, engine_reserved);
}

function _napi_set_named_property(env, object, cname, value) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
 /* napi_status.napi_pending_exception */ if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion === 2147483647 ? /* Version.NAPI_VERSION_EXPERIMENTAL */ 23 : /* napi_status.napi_cannot_run_js */ 10);
 /* napi_status.napi_pending_exception */ envObject.clearLastError();
 try {
  if (!value) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ if (!object) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ var h = emnapiCtx.handleStore.get(object);
  if (!(h.isObject() || h.isFunction())) {
   return envObject.setLastError(2);
  }
  if (!cname) {
   return envObject.setLastError(1);
  }
  emnapiCtx.handleStore.get(object).value[emnapiString.UTF8ToString(cname, -1)] = emnapiCtx.handleStore.get(value).value;
  return envObject.getReturnStatus();
 } catch (err) {
  envObject.tryCatch.setError(err);
  return envObject.setLastError(10);
 }
}

/* napi_status.napi_pending_exception */ function _napi_throw(env, error) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
 /* napi_status.napi_pending_exception */ if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion === 2147483647 ? /* Version.NAPI_VERSION_EXPERIMENTAL */ 23 : /* napi_status.napi_cannot_run_js */ 10);
 /* napi_status.napi_pending_exception */ envObject.clearLastError();
 try {
  if (!error) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ envObject.tryCatch.setError(emnapiCtx.handleStore.get(error).value);
  return envObject.clearLastError();
 } catch (err) {
  envObject.tryCatch.setError(err);
  return envObject.setLastError(10);
 }
}

function _napi_throw_error(env, code, msg) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
 /* napi_status.napi_pending_exception */ if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion === 2147483647 ? /* Version.NAPI_VERSION_EXPERIMENTAL */ 23 : /* napi_status.napi_cannot_run_js */ 10);
 /* napi_status.napi_pending_exception */ envObject.clearLastError();
 try {
  if (!msg) return envObject.setLastError(1);
  var error = new Error(emnapiString.UTF8ToString(msg, -1));
  if (code) error.code = emnapiString.UTF8ToString(code, -1);
  envObject.tryCatch.setError(error);
  return envObject.clearLastError();
 } catch (err) {
  envObject.tryCatch.setError(err);
  return envObject.setLastError(10);
 }
}

/* napi_status.napi_pending_exception */ function _napi_typeof(env, value, result) {
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!value) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ if (!result) return envObject.setLastError(1);
 /* napi_status.napi_invalid_arg */ var v = emnapiCtx.handleStore.get(value);
 var r;
 if (v.isNumber()) {
  r = 3;
 } else if (v.isBigInt()) {
  r = 9;
 } else if (v.isString()) {
  r = 4;
 } else if (v.isFunction()) {
  r = 7;
 } else if (v.isExternal()) {
  r = 8;
 } else if (v.isObject()) {
  r = 6;
 } else if (v.isBoolean()) {
  r = 2;
 } else if (v.isUndefined()) {
  r = 0;
 } else if (v.isSymbol()) {
  r = 5;
 } else if (v.isNull()) {
  r = 1;
 } else {
  return envObject.setLastError(1);
 }
 /* napi_status.napi_invalid_arg */ GROWABLE_HEAP_I32()[((result) >> 2)] = r;
 return envObject.clearLastError();
}

function _napi_unwrap(env, js_object, result) {
 return emnapiUnwrap(env, js_object, result, 0);
}

/* UnwrapAction.KeepWrap */ function emnapiWrap(env, js_object, native_object, finalize_cb, finalize_hint, result) {
 var referenceId;
 if (!env) return 1;
 var envObject = emnapiCtx.envStore.get(env);
 envObject.checkGCAccess();
 if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
 /* napi_status.napi_pending_exception */ if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion === 2147483647 ? /* Version.NAPI_VERSION_EXPERIMENTAL */ 23 : /* napi_status.napi_cannot_run_js */ 10);
 /* napi_status.napi_pending_exception */ envObject.clearLastError();
 try {
  if (!emnapiCtx.feature.supportFinalizer) {
   if (finalize_cb) {
    throw emnapiCtx.createNotSupportWeakRefError("napi_wrap", 'Parameter "finalize_cb" must be 0(NULL)');
   }
   if (result) {
    throw emnapiCtx.createNotSupportWeakRefError("napi_wrap", 'Parameter "result" must be 0(NULL)');
   }
  }
  if (!js_object) return envObject.setLastError(1);
  /* napi_status.napi_invalid_arg */ var handleResult = emnapiGetHandle(js_object);
  if (handleResult.status !== 0) /* napi_status.napi_ok */ {
   return envObject.setLastError(handleResult.status);
  }
  var handle = handleResult.handle;
  if (envObject.getObjectBinding(handle.value).wrapped !== 0) {
   return envObject.setLastError(1);
  }
  var reference = void 0;
  if (result) {
   if (!finalize_cb) return envObject.setLastError(1);
   /* napi_status.napi_invalid_arg */ reference = emnapiCtx.createReference(envObject, handle.id, 0, 1, /* Ownership.kUserland */ finalize_cb, native_object, finalize_hint);
   referenceId = reference.id;
   GROWABLE_HEAP_U32()[((result) >> 2)] = referenceId;
  } else {
   reference = emnapiCtx.createReference(envObject, handle.id, 0, 0, /* Ownership.kRuntime */ finalize_cb, native_object, !finalize_cb ? finalize_cb : finalize_hint);
  }
  envObject.getObjectBinding(handle.value).wrapped = reference.id;
  return envObject.getReturnStatus();
 } catch (err) {
  envObject.tryCatch.setError(err);
  return envObject.setLastError(10);
 }
}

/* napi_status.napi_pending_exception */ function _napi_wrap(env, js_object, native_object, finalize_cb, finalize_hint, result) {
 return emnapiWrap(env, js_object, native_object, finalize_cb, finalize_hint, result);
}

var emnapiModule = {
 exports: {},
 loaded: false,
 filename: ""
};

var emnapiAsyncWorkPoolSize = 0;

function emnapiInit(options) {
 if (emnapiModule.loaded) return emnapiModule.exports;
 if (typeof options !== "object" || options === null) {
  throw new TypeError("Invalid emnapi init option");
 }
 var context = options.context;
 if (typeof context !== "object" || context === null) {
  throw new TypeError("Invalid `options.context`. Use `import { getDefaultContext } from '@emnapi/runtime'`");
 }
 emnapiCtx = context;
 var filename = typeof options.filename === "string" ? options.filename : "";
 emnapiModule.filename = filename;
 if ("nodeBinding" in options) {
  var nodeBinding = options.nodeBinding;
  if (typeof nodeBinding !== "object" || nodeBinding === null) {
   throw new TypeError("Invalid `options.nodeBinding`. Use @emnapi/node-binding package");
  }
  emnapiNodeBinding = nodeBinding;
 }
 if ("asyncWorkPoolSize" in options) {
  if (typeof options.asyncWorkPoolSize !== "number") {
   throw new TypeError("options.asyncWorkPoolSize must be a integer");
  }
  emnapiAsyncWorkPoolSize = options.asyncWorkPoolSize >> 0;
  if (emnapiAsyncWorkPoolSize > 1024) {
   emnapiAsyncWorkPoolSize = 1024;
  } else if (emnapiAsyncWorkPoolSize < -1024) {
   emnapiAsyncWorkPoolSize = -1024;
  }
 }
 var moduleApiVersion = _node_api_module_get_api_version_v1();
 var envObject = emnapiModule.envObject || (emnapiModule.envObject = emnapiCtx.createEnv(filename, moduleApiVersion, function(cb) {
  return getWasmTableEntry(cb);
 }, function(cb) {
  return getWasmTableEntry(cb);
 }, abort, emnapiNodeBinding));
 var scope = emnapiCtx.openScope(envObject);
 try {
  envObject.callIntoModule(function(_envObject) {
   var exports = emnapiModule.exports;
   var exportsHandle = scope.add(exports);
   var napiValue = _napi_register_wasm_v1(_envObject.id, exportsHandle.id);
   emnapiModule.exports = (!napiValue) ? exports : emnapiCtx.handleStore.get(napiValue).value;
  });
 } catch (err) {
  emnapiCtx.closeScope(envObject, scope);
  throw err;
 }
 emnapiCtx.closeScope(envObject, scope);
 emnapiModule.loaded = true;
 delete emnapiModule.envObject;
 return emnapiModule.exports;
}

PThread.init();

embind_init_charCodes();

BindingError = Module["BindingError"] = class BindingError extends Error {
 constructor(message) {
  super(message);
  this.name = "BindingError";
 }
};

InternalError = Module["InternalError"] = class InternalError extends Error {
 constructor(message) {
  super(message);
  this.name = "InternalError";
 }
};

init_emval();

emnapiExternalMemory.init();

emnapiString.init();

var proxiedFunctionTable = [ _proc_exit, exitOnMainThread, pthreadCreateProxied, _fd_close, _fd_seek, _fd_write ];

function checkIncomingModuleAPI() {
 ignoredModuleProp("fetchSettings");
}

var wasmImports = {
 /** @export */ __assert_fail: ___assert_fail,
 /** @export */ __cxa_begin_catch: ___cxa_begin_catch,
 /** @export */ __cxa_current_primary_exception: ___cxa_current_primary_exception,
 /** @export */ __cxa_end_catch: ___cxa_end_catch,
 /** @export */ __cxa_find_matching_catch_2: ___cxa_find_matching_catch_2,
 /** @export */ __cxa_find_matching_catch_3: ___cxa_find_matching_catch_3,
 /** @export */ __cxa_find_matching_catch_4: ___cxa_find_matching_catch_4,
 /** @export */ __cxa_rethrow: ___cxa_rethrow,
 /** @export */ __cxa_rethrow_primary_exception: ___cxa_rethrow_primary_exception,
 /** @export */ __cxa_throw: ___cxa_throw,
 /** @export */ __emscripten_init_main_thread_js: ___emscripten_init_main_thread_js,
 /** @export */ __emscripten_thread_cleanup: ___emscripten_thread_cleanup,
 /** @export */ __pthread_create_js: ___pthread_create_js,
 /** @export */ __resumeException: ___resumeException,
 /** @export */ _embind_register_bigint: __embind_register_bigint,
 /** @export */ _embind_register_bool: __embind_register_bool,
 /** @export */ _embind_register_emval: __embind_register_emval,
 /** @export */ _embind_register_float: __embind_register_float,
 /** @export */ _embind_register_integer: __embind_register_integer,
 /** @export */ _embind_register_memory_view: __embind_register_memory_view,
 /** @export */ _embind_register_std_string: __embind_register_std_string,
 /** @export */ _embind_register_std_wstring: __embind_register_std_wstring,
 /** @export */ _embind_register_void: __embind_register_void,
 /** @export */ _emnapi_call_finalizer: __emnapi_call_finalizer,
 /** @export */ _emnapi_callback_into_module: __emnapi_callback_into_module,
 /** @export */ _emnapi_ctx_decrease_waiting_request_counter: __emnapi_ctx_decrease_waiting_request_counter,
 /** @export */ _emnapi_ctx_increase_waiting_request_counter: __emnapi_ctx_increase_waiting_request_counter,
 /** @export */ _emnapi_env_check_gc_access: __emnapi_env_check_gc_access,
 /** @export */ _emnapi_env_ref: __emnapi_env_ref,
 /** @export */ _emnapi_env_unref: __emnapi_env_unref,
 /** @export */ _emnapi_get_last_error_info: __emnapi_get_last_error_info,
 /** @export */ _emnapi_node_emit_async_destroy: __emnapi_node_emit_async_destroy,
 /** @export */ _emnapi_node_emit_async_init: __emnapi_node_emit_async_init,
 /** @export */ _emnapi_node_make_callback: __emnapi_node_make_callback,
 /** @export */ _emnapi_set_immediate: __emnapi_set_immediate,
 /** @export */ _emnapi_worker_unref: __emnapi_worker_unref,
 /** @export */ _emscripten_get_now_is_monotonic: __emscripten_get_now_is_monotonic,
 /** @export */ _emscripten_notify_mailbox_postmessage: __emscripten_notify_mailbox_postmessage,
 /** @export */ _emscripten_receive_on_main_thread_js: __emscripten_receive_on_main_thread_js,
 /** @export */ _emscripten_thread_mailbox_await: __emscripten_thread_mailbox_await,
 /** @export */ _emscripten_thread_set_strongref: __emscripten_thread_set_strongref,
 /** @export */ abort: _abort,
 /** @export */ emnapi_is_node_binding_available: _emnapi_is_node_binding_available,
 /** @export */ emnapi_sync_memory: _emnapi_sync_memory,
 /** @export */ emscripten_check_blocking_allowed: _emscripten_check_blocking_allowed,
 /** @export */ emscripten_date_now: _emscripten_date_now,
 /** @export */ emscripten_exit_with_live_runtime: _emscripten_exit_with_live_runtime,
 /** @export */ emscripten_get_now: _emscripten_get_now,
 /** @export */ emscripten_resize_heap: _emscripten_resize_heap,
 /** @export */ emscripten_runtime_keepalive_pop: _emscripten_runtime_keepalive_pop,
 /** @export */ emscripten_runtime_keepalive_push: _emscripten_runtime_keepalive_push,
 /** @export */ exit: _exit,
 /** @export */ fd_close: _fd_close,
 /** @export */ fd_seek: _fd_seek,
 /** @export */ fd_write: _fd_write,
 /** @export */ invoke_i: invoke_i,
 /** @export */ invoke_ii: invoke_ii,
 /** @export */ invoke_iii: invoke_iii,
 /** @export */ invoke_iiii: invoke_iiii,
 /** @export */ invoke_iiiii: invoke_iiiii,
 /** @export */ invoke_iiiiii: invoke_iiiiii,
 /** @export */ invoke_iiiiiii: invoke_iiiiiii,
 /** @export */ invoke_iiiiiiii: invoke_iiiiiiii,
 /** @export */ invoke_iiiiiiiii: invoke_iiiiiiiii,
 /** @export */ invoke_v: invoke_v,
 /** @export */ invoke_vi: invoke_vi,
 /** @export */ invoke_vii: invoke_vii,
 /** @export */ invoke_viii: invoke_viii,
 /** @export */ invoke_viiii: invoke_viiii,
 /** @export */ invoke_viiiii: invoke_viiiii,
 /** @export */ llvm_eh_typeid_for: _llvm_eh_typeid_for,
 /** @export */ memory: wasmMemory || Module["wasmMemory"],
 /** @export */ napi_add_env_cleanup_hook: _napi_add_env_cleanup_hook,
 /** @export */ napi_add_finalizer: _napi_add_finalizer,
 /** @export */ napi_call_function: _napi_call_function,
 /** @export */ napi_clear_last_error: _napi_clear_last_error,
 /** @export */ napi_close_escapable_handle_scope: _napi_close_escapable_handle_scope,
 /** @export */ napi_close_handle_scope: _napi_close_handle_scope,
 /** @export */ napi_coerce_to_number: _napi_coerce_to_number,
 /** @export */ napi_coerce_to_object: _napi_coerce_to_object,
 /** @export */ napi_coerce_to_string: _napi_coerce_to_string,
 /** @export */ napi_create_array_with_length: _napi_create_array_with_length,
 /** @export */ napi_create_arraybuffer: _napi_create_arraybuffer,
 /** @export */ napi_create_double: _napi_create_double,
 /** @export */ napi_create_error: _napi_create_error,
 /** @export */ napi_create_external: _napi_create_external,
 /** @export */ napi_create_function: _napi_create_function,
 /** @export */ napi_create_object: _napi_create_object,
 /** @export */ napi_create_promise: _napi_create_promise,
 /** @export */ napi_create_range_error: _napi_create_range_error,
 /** @export */ napi_create_reference: _napi_create_reference,
 /** @export */ napi_create_string_latin1: _napi_create_string_latin1,
 /** @export */ napi_create_string_utf8: _napi_create_string_utf8,
 /** @export */ napi_create_type_error: _napi_create_type_error,
 /** @export */ napi_define_class: _napi_define_class,
 /** @export */ napi_define_properties: _napi_define_properties,
 /** @export */ napi_delete_reference: _napi_delete_reference,
 /** @export */ napi_escape_handle: _napi_escape_handle,
 /** @export */ napi_fatal_error: _napi_fatal_error,
 /** @export */ napi_get_and_clear_last_exception: _napi_get_and_clear_last_exception,
 /** @export */ napi_get_array_length: _napi_get_array_length,
 /** @export */ napi_get_arraybuffer_info: _napi_get_arraybuffer_info,
 /** @export */ napi_get_boolean: _napi_get_boolean,
 /** @export */ napi_get_cb_info: _napi_get_cb_info,
 /** @export */ napi_get_element: _napi_get_element,
 /** @export */ napi_get_global: _napi_get_global,
 /** @export */ napi_get_instance_data: _napi_get_instance_data,
 /** @export */ napi_get_named_property: _napi_get_named_property,
 /** @export */ napi_get_new_target: _napi_get_new_target,
 /** @export */ napi_get_null: _napi_get_null,
 /** @export */ napi_get_property: _napi_get_property,
 /** @export */ napi_get_property_names: _napi_get_property_names,
 /** @export */ napi_get_reference_value: _napi_get_reference_value,
 /** @export */ napi_get_undefined: _napi_get_undefined,
 /** @export */ napi_get_value_external: _napi_get_value_external,
 /** @export */ napi_get_value_int32: _napi_get_value_int32,
 /** @export */ napi_get_value_int64: _napi_get_value_int64,
 /** @export */ napi_get_value_string_utf8: _napi_get_value_string_utf8,
 /** @export */ napi_get_value_uint32: _napi_get_value_uint32,
 /** @export */ napi_has_property: _napi_has_property,
 /** @export */ napi_instanceof: _napi_instanceof,
 /** @export */ napi_is_array: _napi_is_array,
 /** @export */ napi_is_arraybuffer: _napi_is_arraybuffer,
 /** @export */ napi_is_exception_pending: _napi_is_exception_pending,
 /** @export */ napi_is_promise: _napi_is_promise,
 /** @export */ napi_new_instance: _napi_new_instance,
 /** @export */ napi_open_escapable_handle_scope: _napi_open_escapable_handle_scope,
 /** @export */ napi_open_handle_scope: _napi_open_handle_scope,
 /** @export */ napi_reject_deferred: _napi_reject_deferred,
 /** @export */ napi_remove_env_cleanup_hook: _napi_remove_env_cleanup_hook,
 /** @export */ napi_remove_wrap: _napi_remove_wrap,
 /** @export */ napi_resolve_deferred: _napi_resolve_deferred,
 /** @export */ napi_set_element: _napi_set_element,
 /** @export */ napi_set_instance_data: _napi_set_instance_data,
 /** @export */ napi_set_last_error: _napi_set_last_error,
 /** @export */ napi_set_named_property: _napi_set_named_property,
 /** @export */ napi_throw: _napi_throw,
 /** @export */ napi_throw_error: _napi_throw_error,
 /** @export */ napi_typeof: _napi_typeof,
 /** @export */ napi_unwrap: _napi_unwrap,
 /** @export */ napi_wrap: _napi_wrap
};

var wasmExports = createWasm();

var ___wasm_call_ctors = createExportWrapper("__wasm_call_ctors");

var ___cxa_free_exception = createExportWrapper("__cxa_free_exception");

var _node_api_module_get_api_version_v1 = createExportWrapper("node_api_module_get_api_version_v1");

var _napi_register_wasm_v1 = Module["_napi_register_wasm_v1"] = createExportWrapper("napi_register_wasm_v1");

var _pthread_self = Module["_pthread_self"] = () => (_pthread_self = Module["_pthread_self"] = wasmExports["pthread_self"])();

var _free = Module["_free"] = createExportWrapper("free");

var _malloc = Module["_malloc"] = createExportWrapper("malloc");

var _emscripten_main_runtime_thread_id = createExportWrapper("emscripten_main_runtime_thread_id");

var __emscripten_tls_init = Module["__emscripten_tls_init"] = createExportWrapper("_emscripten_tls_init");

var __embind_initialize_bindings = Module["__embind_initialize_bindings"] = createExportWrapper("_embind_initialize_bindings");

var __emscripten_thread_init = Module["__emscripten_thread_init"] = createExportWrapper("_emscripten_thread_init");

var __emscripten_thread_crashed = Module["__emscripten_thread_crashed"] = createExportWrapper("_emscripten_thread_crashed");

var _fflush = createExportWrapper("fflush");

var _emscripten_main_thread_process_queued_calls = createExportWrapper("emscripten_main_thread_process_queued_calls");

var _emscripten_stack_get_base = () => (_emscripten_stack_get_base = wasmExports["emscripten_stack_get_base"])();

var _emscripten_stack_get_end = () => (_emscripten_stack_get_end = wasmExports["emscripten_stack_get_end"])();

var __emscripten_run_on_main_thread_js = createExportWrapper("_emscripten_run_on_main_thread_js");

var __emscripten_thread_free_data = createExportWrapper("_emscripten_thread_free_data");

var __emscripten_thread_exit = Module["__emscripten_thread_exit"] = createExportWrapper("_emscripten_thread_exit");

var __emscripten_check_mailbox = createExportWrapper("_emscripten_check_mailbox");

var _setThrew = createExportWrapper("setThrew");

var setTempRet0 = createExportWrapper("setTempRet0");

var _emscripten_stack_init = () => (_emscripten_stack_init = wasmExports["emscripten_stack_init"])();

var _emscripten_stack_set_limits = (a0, a1) => (_emscripten_stack_set_limits = wasmExports["emscripten_stack_set_limits"])(a0, a1);

var _emscripten_stack_get_free = () => (_emscripten_stack_get_free = wasmExports["emscripten_stack_get_free"])();

var stackSave = createExportWrapper("stackSave");

var stackRestore = createExportWrapper("stackRestore");

var stackAlloc = createExportWrapper("stackAlloc");

var _emscripten_stack_get_current = () => (_emscripten_stack_get_current = wasmExports["emscripten_stack_get_current"])();

var ___cxa_decrement_exception_refcount = createExportWrapper("__cxa_decrement_exception_refcount");

var ___cxa_increment_exception_refcount = createExportWrapper("__cxa_increment_exception_refcount");

var ___get_exception_message = createExportWrapper("__get_exception_message");

var ___cxa_can_catch = createExportWrapper("__cxa_can_catch");

var ___cxa_is_pointer_type = createExportWrapper("__cxa_is_pointer_type");

var dynCall_jiji = Module["dynCall_jiji"] = createExportWrapper("dynCall_jiji");

function invoke_vii(index, a1, a2) {
 var sp = stackSave();
 try {
  getWasmTableEntry(index)(a1, a2);
 } catch (e) {
  stackRestore(sp);
  if (!(e instanceof EmscriptenEH)) throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiii(index, a1, a2, a3, a4) {
 var sp = stackSave();
 try {
  getWasmTableEntry(index)(a1, a2, a3, a4);
 } catch (e) {
  stackRestore(sp);
  if (!(e instanceof EmscriptenEH)) throw e;
  _setThrew(1, 0);
 }
}

function invoke_iiiii(index, a1, a2, a3, a4) {
 var sp = stackSave();
 try {
  return getWasmTableEntry(index)(a1, a2, a3, a4);
 } catch (e) {
  stackRestore(sp);
  if (!(e instanceof EmscriptenEH)) throw e;
  _setThrew(1, 0);
 }
}

function invoke_iii(index, a1, a2) {
 var sp = stackSave();
 try {
  return getWasmTableEntry(index)(a1, a2);
 } catch (e) {
  stackRestore(sp);
  if (!(e instanceof EmscriptenEH)) throw e;
  _setThrew(1, 0);
 }
}

function invoke_viii(index, a1, a2, a3) {
 var sp = stackSave();
 try {
  getWasmTableEntry(index)(a1, a2, a3);
 } catch (e) {
  stackRestore(sp);
  if (!(e instanceof EmscriptenEH)) throw e;
  _setThrew(1, 0);
 }
}

function invoke_ii(index, a1) {
 var sp = stackSave();
 try {
  return getWasmTableEntry(index)(a1);
 } catch (e) {
  stackRestore(sp);
  if (!(e instanceof EmscriptenEH)) throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiiii(index, a1, a2, a3, a4, a5) {
 var sp = stackSave();
 try {
  getWasmTableEntry(index)(a1, a2, a3, a4, a5);
 } catch (e) {
  stackRestore(sp);
  if (!(e instanceof EmscriptenEH)) throw e;
  _setThrew(1, 0);
 }
}

function invoke_iiii(index, a1, a2, a3) {
 var sp = stackSave();
 try {
  return getWasmTableEntry(index)(a1, a2, a3);
 } catch (e) {
  stackRestore(sp);
  if (!(e instanceof EmscriptenEH)) throw e;
  _setThrew(1, 0);
 }
}

function invoke_iiiiii(index, a1, a2, a3, a4, a5) {
 var sp = stackSave();
 try {
  return getWasmTableEntry(index)(a1, a2, a3, a4, a5);
 } catch (e) {
  stackRestore(sp);
  if (!(e instanceof EmscriptenEH)) throw e;
  _setThrew(1, 0);
 }
}

function invoke_vi(index, a1) {
 var sp = stackSave();
 try {
  getWasmTableEntry(index)(a1);
 } catch (e) {
  stackRestore(sp);
  if (!(e instanceof EmscriptenEH)) throw e;
  _setThrew(1, 0);
 }
}

function invoke_v(index) {
 var sp = stackSave();
 try {
  getWasmTableEntry(index)();
 } catch (e) {
  stackRestore(sp);
  if (!(e instanceof EmscriptenEH)) throw e;
  _setThrew(1, 0);
 }
}

function invoke_iiiiiii(index, a1, a2, a3, a4, a5, a6) {
 var sp = stackSave();
 try {
  return getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6);
 } catch (e) {
  stackRestore(sp);
  if (!(e instanceof EmscriptenEH)) throw e;
  _setThrew(1, 0);
 }
}

function invoke_iiiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
 var sp = stackSave();
 try {
  return getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7);
 } catch (e) {
  stackRestore(sp);
  if (!(e instanceof EmscriptenEH)) throw e;
  _setThrew(1, 0);
 }
}

function invoke_iiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
 var sp = stackSave();
 try {
  return getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7, a8);
 } catch (e) {
  stackRestore(sp);
  if (!(e instanceof EmscriptenEH)) throw e;
  _setThrew(1, 0);
 }
}

function invoke_i(index) {
 var sp = stackSave();
 try {
  return getWasmTableEntry(index)();
 } catch (e) {
  stackRestore(sp);
  if (!(e instanceof EmscriptenEH)) throw e;
  _setThrew(1, 0);
 }
}

Module["wasmMemory"] = wasmMemory;

Module["keepRuntimeAlive"] = keepRuntimeAlive;

Module["ExitStatus"] = ExitStatus;

Module["PThread"] = PThread;

Module["emnapiInit"] = emnapiInit;

var missingLibrarySymbols = [ "writeI53ToI64", "writeI53ToI64Clamped", "writeI53ToI64Signaling", "writeI53ToU64Clamped", "writeI53ToU64Signaling", "readI53FromI64", "readI53FromU64", "convertI32PairToI53", "convertU32PairToI53", "isLeapYear", "ydayFromDate", "arraySum", "addDays", "inetPton4", "inetNtop4", "inetPton6", "inetNtop6", "readSockaddr", "writeSockaddr", "initRandomFill", "randomFill", "getCallstack", "emscriptenLog", "convertPCtoSourceLocation", "readEmAsmArgs", "jstoi_q", "getExecutableName", "listenOnce", "autoResumeAudioContext", "dynCallLegacy", "getDynCaller", "dynCall", "asmjsMangle", "asyncLoad", "alignMemory", "mmapAlloc", "getNativeTypeSize", "STACK_SIZE", "STACK_ALIGN", "POINTER_SIZE", "ASSERTIONS", "getCFunc", "ccall", "cwrap", "uleb128Encode", "sigToWasmTypes", "generateFuncType", "convertJsFunctionToWasm", "getEmptyTableSlot", "updateTableMap", "getFunctionAddress", "addFunction", "removeFunction", "reallyNegative", "unSign", "strLen", "reSign", "formatString", "intArrayFromString", "intArrayToString", "AsciiToString", "stringToAscii", "stringToNewUTF8", "stringToUTF8OnStack", "writeArrayToMemory", "registerKeyEventCallback", "maybeCStringToJsString", "findEventTarget", "getBoundingClientRect", "fillMouseEventData", "registerMouseEventCallback", "registerWheelEventCallback", "registerUiEventCallback", "registerFocusEventCallback", "fillDeviceOrientationEventData", "registerDeviceOrientationEventCallback", "fillDeviceMotionEventData", "registerDeviceMotionEventCallback", "screenOrientation", "fillOrientationChangeEventData", "registerOrientationChangeEventCallback", "fillFullscreenChangeEventData", "registerFullscreenChangeEventCallback", "JSEvents_requestFullscreen", "JSEvents_resizeCanvasForFullscreen", "registerRestoreOldStyle", "hideEverythingExceptGivenElement", "restoreHiddenElements", "setLetterbox", "softFullscreenResizeWebGLRenderTarget", "doRequestFullscreen", "fillPointerlockChangeEventData", "registerPointerlockChangeEventCallback", "registerPointerlockErrorEventCallback", "requestPointerLock", "fillVisibilityChangeEventData", "registerVisibilityChangeEventCallback", "registerTouchEventCallback", "fillGamepadEventData", "registerGamepadEventCallback", "registerBeforeUnloadEventCallback", "fillBatteryEventData", "battery", "registerBatteryEventCallback", "setCanvasElementSizeCallingThread", "setCanvasElementSizeMainThread", "setCanvasElementSize", "getCanvasSizeCallingThread", "getCanvasSizeMainThread", "getCanvasElementSize", "demangle", "jsStackTrace", "stackTrace", "getEnvStrings", "checkWasiClock", "wasiRightsToMuslOFlags", "wasiOFlagsToMuslOFlags", "createDyncallWrapper", "safeSetTimeout", "setImmediateWrapped", "clearImmediateWrapped", "polyfillSetImmediate", "getPromise", "makePromise", "idsToPromises", "makePromiseCallback", "Browser_asyncPrepareDataCounter", "setMainLoop", "getSocketFromFD", "getSocketAddress", "FS_createPreloadedFile", "FS_modeStringToFlags", "FS_getMode", "FS_stdin_getChar", "FS_createDataFile", "FS_unlink", "FS_mkdirTree", "_setNetworkCallback", "heapObjectForWebGLType", "heapAccessShiftForWebGLHeap", "webgl_enable_ANGLE_instanced_arrays", "webgl_enable_OES_vertex_array_object", "webgl_enable_WEBGL_draw_buffers", "webgl_enable_WEBGL_multi_draw", "emscriptenWebGLGet", "computeUnpackAlignedImageSize", "colorChannelsInGlTextureFormat", "emscriptenWebGLGetTexPixelData", "__glGenObject", "emscriptenWebGLGetUniform", "webglGetUniformLocation", "webglPrepareUniformLocationsBeforeFirstUse", "webglGetLeftBracePos", "emscriptenWebGLGetVertexAttrib", "__glGetActiveAttribOrUniform", "writeGLArray", "emscripten_webgl_destroy_context_before_on_calling_thread", "registerWebGlEventCallback", "runAndAbortIfError", "SDL_unicode", "SDL_ttfContext", "SDL_audio", "ALLOC_NORMAL", "ALLOC_STACK", "allocate", "writeStringToMemory", "writeAsciiToMemory", "setErrNo", "getTypeName", "getFunctionName", "getFunctionArgsName", "heap32VectorToArray", "requireRegisteredType", "usesDestructorStack", "createJsInvokerSignature", "createJsInvoker", "init_embind", "throwUnboundTypeError", "ensureOverloadTable", "exposePublicSymbol", "replacePublicSymbol", "extendError", "createNamedFunction", "getBasestPointer", "registerInheritedInstance", "unregisterInheritedInstance", "getInheritedInstance", "getInheritedInstanceCount", "getLiveInheritedInstances", "enumReadValueFromPointer", "runDestructors", "newFunc", "craftInvokerFunction", "embind__requireFunction", "genericPointerToWireType", "constNoSmartPtrRawPointerToWireType", "nonConstNoSmartPtrRawPointerToWireType", "init_RegisteredPointer", "RegisteredPointer", "RegisteredPointer_fromWireType", "runDestructor", "releaseClassHandle", "detachFinalizer", "attachFinalizer", "makeClassHandle", "init_ClassHandle", "ClassHandle", "throwInstanceAlreadyDeleted", "flushPendingDeletes", "setDelayFunction", "RegisteredClass", "shallowCopyInternalPointer", "downcastPointer", "upcastPointer", "validateThis", "char_0", "char_9", "makeLegalFunctionName", "getStringOrSymbol", "emval_get_global", "emval_returnValue", "emval_lookupTypes", "emval_addMethodCaller", "emnapiAddSendListener", "emnapiGetMemoryAddress" ];

missingLibrarySymbols.forEach(missingLibrarySymbol);

var unexportedSymbols = [ "run", "addOnPreRun", "addOnInit", "addOnPreMain", "addOnExit", "addOnPostRun", "addRunDependency", "removeRunDependency", "FS_createFolder", "FS_createPath", "FS_createLazyFile", "FS_createLink", "FS_createDevice", "FS_readFile", "out", "err", "callMain", "abort", "wasmExports", "stackAlloc", "stackSave", "stackRestore", "getTempRet0", "setTempRet0", "GROWABLE_HEAP_I8", "GROWABLE_HEAP_U8", "GROWABLE_HEAP_I16", "GROWABLE_HEAP_U16", "GROWABLE_HEAP_I32", "GROWABLE_HEAP_U32", "GROWABLE_HEAP_F32", "GROWABLE_HEAP_F64", "writeStackCookie", "checkStackCookie", "convertI32PairToI53Checked", "ptrToString", "zeroMemory", "exitJS", "getHeapMax", "growMemory", "ENV", "MONTH_DAYS_REGULAR", "MONTH_DAYS_LEAP", "MONTH_DAYS_REGULAR_CUMULATIVE", "MONTH_DAYS_LEAP_CUMULATIVE", "ERRNO_CODES", "ERRNO_MESSAGES", "DNS", "Protocols", "Sockets", "timers", "warnOnce", "UNWIND_CACHE", "readEmAsmArgsArray", "jstoi_s", "handleException", "runtimeKeepalivePush", "runtimeKeepalivePop", "callUserCallback", "maybeExit", "HandleAllocator", "wasmTable", "noExitRuntime", "freeTableIndexes", "functionsInTableMap", "setValue", "getValue", "PATH", "PATH_FS", "UTF8Decoder", "UTF8ArrayToString", "UTF8ToString", "stringToUTF8Array", "stringToUTF8", "lengthBytesUTF8", "UTF16Decoder", "UTF16ToString", "stringToUTF16", "lengthBytesUTF16", "UTF32ToString", "stringToUTF32", "lengthBytesUTF32", "JSEvents", "specialHTMLTargets", "findCanvasEventTarget", "currentFullscreenStrategy", "restoreOldWindowedStyle", "flush_NO_FILESYSTEM", "promiseMap", "uncaughtExceptionCount", "exceptionLast", "exceptionCaught", "ExceptionInfo", "findMatchingCatch", "getExceptionMessageCommon", "incrementExceptionRefcount", "decrementExceptionRefcount", "getExceptionMessage", "Browser", "wget", "SYSCALLS", "preloadPlugins", "FS_stdin_getChar_buffer", "FS", "MEMFS", "TTY", "PIPEFS", "SOCKFS", "tempFixedLengthArray", "miniTempWebGLFloatBuffers", "miniTempWebGLIntBuffers", "GL", "emscripten_webgl_power_preferences", "AL", "GLUT", "EGL", "GLEW", "IDBStore", "SDL", "SDL_gfx", "allocateUTF8", "allocateUTF8OnStack", "terminateWorker", "killThread", "cleanupThread", "registerTLSInit", "cancelThread", "spawnThread", "exitOnMainThread", "proxyToMainThread", "proxiedJSCallArgs", "invokeEntryPoint", "checkMailbox", "InternalError", "BindingError", "throwInternalError", "throwBindingError", "registeredTypes", "awaitingDependencies", "typeDependencies", "tupleRegistrations", "structRegistrations", "sharedRegisterType", "whenDependentTypesAreResolved", "embind_charCodes", "embind_init_charCodes", "readLatin1String", "UnboundTypeError", "PureVirtualError", "GenericWireTypeSize", "EmValType", "embindRepr", "registeredInstances", "registeredPointers", "registerType", "integerReadValueFromPointer", "floatReadValueFromPointer", "simpleReadValueFromPointer", "readPointer", "finalizationRegistry", "detachFinalizer_deps", "deletionQueue", "delayFunction", "emval_handles", "emval_symbols", "init_emval", "count_emval_handles", "Emval", "emval_methodCallers", "reflectConstruct", "emnapiAsyncWorkPoolSize", "emnapiCtx", "emnapiExternalMemory", "emnapiModule", "emnapiNodeBinding", "emnapiSetValueI64", "emnapiSyncMemory", "emnapiString", "emnapiGetHandle", "emnapiTSFN", "emnapiAWST", "emnapiCreateArrayBuffer", "emnapiCreateFunction", "emnapiDefineProperty", "emnapiUnwrap", "emnapiWrap" ];

unexportedSymbols.forEach(unexportedRuntimeSymbol);

var calledRun;

dependenciesFulfilled = function runCaller() {
 if (!calledRun) run();
 if (!calledRun) dependenciesFulfilled = runCaller;
};

function stackCheckInit() {
 assert(!ENVIRONMENT_IS_PTHREAD);
 _emscripten_stack_init();
 writeStackCookie();
}

function run() {
 if (runDependencies > 0) {
  return;
 }
 if (!ENVIRONMENT_IS_PTHREAD) stackCheckInit();
 if (ENVIRONMENT_IS_PTHREAD) {
  readyPromiseResolve(Module);
  initRuntime();
  startWorker(Module);
  return;
 }
 preRun();
 if (runDependencies > 0) {
  return;
 }
 function doRun() {
  if (calledRun) return;
  calledRun = true;
  Module["calledRun"] = true;
  if (ABORT) return;
  initRuntime();
  readyPromiseResolve(Module);
  if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
  assert(!Module["_main"], 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');
  postRun();
 }
 if (Module["setStatus"]) {
  Module["setStatus"]("Running...");
  setTimeout(function() {
   setTimeout(function() {
    Module["setStatus"]("");
   }, 1);
   doRun();
  }, 1);
 } else {
  doRun();
 }
 checkStackCookie();
}

function checkUnflushedContent() {
 var oldOut = out;
 var oldErr = err;
 var has = false;
 out = err = x => {
  has = true;
 };
 try {
  flush_NO_FILESYSTEM();
 } catch (e) {}
 out = oldOut;
 err = oldErr;
 if (has) {
  warnOnce("stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the Emscripten FAQ), or make sure to emit a newline when you printf etc.");
  warnOnce("(this may also be due to not including full filesystem support - try building with -sFORCE_FILESYSTEM)");
 }
}

if (Module["preInit"]) {
 if (typeof Module["preInit"] == "function") Module["preInit"] = [ Module["preInit"] ];
 while (Module["preInit"].length > 0) {
  Module["preInit"].pop()();
 }
}

run();


  return moduleArg.ready
}
);
})();
export default example;