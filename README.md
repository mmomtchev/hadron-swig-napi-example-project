# SWIG Node-API example skeleton

[![Test](https://github.com/mmomtchev/hadron-swig-napi-example-project/actions/workflows/run.yml/badge.svg)](https://github.com/mmomtchev/hadron-swig-napi-example-project/actions/workflows/run.yml)
[![codecov](https://codecov.io/gh/mmomtchev/hadron-swig-napi-example-project/graph/badge.svg?token=S833HD8I37)](https://codecov.io/gh/mmomtchev/hadron-swig-napi-example-project)

This is an example skeleton for a C++ project that uses SWIG Node-API with a dual-build system supporting both Node.js/native and Browser/WASM builds

# EXPERIMENTAL NEW BUILD SYSTEM `node-hadron`

This branch `meson` contains the template which will be used for the new build system that will be an alternative to the aging `node-gyp`. The new build system will produce the files manually created here from a centraized configuration. The build itself is already usable, but it is cumbersome to setup.

The new build system:
* Is based on [`meson`](https://mesonbuild.com/), [`xpm`](https://xpack.github.io/xpm/) and, optionally, [`conan`](https://conan.io/) and [`xpack-dev-tools`](https://github.com/xpack-dev-tools/)
* Supports only Node-API with optional `libuv` access, does not support NAN and raw V8, all horrible hidden landmines with the C++ ABI automagically go away
* (Will) support alternative Node-API runtimes such as Electron
* Integrates perfectly with other `CMake` and `meson` based subprojects - **no more laborious ports of your required libraries to `node-gyp` - use the native build system**
* Supports dual-platform native + WASM builds without any hassle - including the `conan`-based dependencies - just add `zlib/1.2.0` to your `conan` requirements and you can include `zlib.h` and have it work on all operating systems and in the browser
* Supports build options, including optional dependencies
* When using with `xpack-dev-tools`, supports fully reproducible and self-contained builds on all platforms - your users type `npm install --build-from-source` and can be sure to get the same build as you - because the build uses only the `node` binary, the `npm` tool, and eventually `python` when using `conan`, from the host machine - everything else is a `xPack`

  When using `xpack-dev-tools`, the addons are built with:
  - Linux: `clang` + statically linked `libstdc++` post C++11 ABI version
  - Windows: `clang` + statically linked `libc++`
  - macOS: `clang` + statically linked `libc++`
* Handles installing pre-compiled universal binaries out of the box

## What is currently missing

* Generating all those pesky files (ie the system exists only in theory)
* When using `xpack-dev-tools`:
  - emscripten (WASM builds will have to be prepublished)
  - SWIG (generated wrappers will have to be prepublished)
  - `zlib` on conan is broken with `clang` on Windows: https://github.com/conan-io/conan-center-index/issues/23058

# Try it for yourself

The Github Actions automated build & test CI is set up to work on all three major OS.

After installing **SWIG JavaScript Evolution** which must be available in your path:

```shell
git clone https://github.com/mmomtchev/hadron-swig-napi-example-project.git
cd hadron-swig-napi-example-project
npm install
npm run swig
```

Build the Node.js native addon version:
```
npm run build:native
```

Build the Node.js native addon version (fully self-contained build with `clang` from a `xpack`):
*(does not work on Windows because of [conan-io/conan-center-index#23058](https://github.com/conan-io/conan-center-index/issues/23058))*
```
npm run build:native-xpack
```

Build the browser-compatible WASM version (must have `emsdk` in your `PATH`):
```
npm run build:wasm
```

Run the unit tests:
```
# Run all unit tests
npm test

# Run only the Node.js unit tests
npm run test:nodejs

# Run only the browser unit tests
npm run test:browser

# Serve the webpack project in a browser
# (open http://localhost:8030/)
npm run start
```

# CJS, MJS, ES6, TypeScript...

This project is setup to provide a modern JavaScript environment - it uses `type: module`, JavaScript files are treated as ES6 by default and the TypeScript is also transpiled to ES6. This setup is what most newly published `npm` modules use in 2024. Such package will be compatible with all modern bundlers and recent Node.js versions when using `import` declarations. Officially, it won't be compatible with being `require`d from CJS code (although you may find that it works in most cases).

You can check [`magickwand.js`](https://github.com/mmomtchev/magickwand.js) for an example of a real-world SWIG-generated dual-build (WASM/native) project that is compatible with both ES6 and CJS. However you should be aware that supporting both ES6 and CJS adds substantial complexity to the packaging of a module. It is recommended that all new JavaScript and TypeScript projects use ES6 as their main targets.

# Code instrumentation

## Native

If you need to debug your code, the best debug target is the Node.js native build on Linux.

The Node.js native version supports full code instrumentation - debug builds, running with [`asan`](https://github.com/google/sanitizers/wiki/AddressSanitizer) enabled and dual-language code coverage with `gcov` and `lcov` on the C++ side (*only on Linux & macOS*) and `c8` on the JavaScript side. The [CI scripts](https://github.com/mmomtchev/swig-napi-example-project/blob/main/.github/workflows/run.yml) can be used as example for setting these up. The automated `asan` build includes a list of the known leaks in the Node.js/V8 bootstrapping code - note that this is a fast moving target - that is current for Node.js 18.19.1.

[launch.json](https://github.com/mmomtchev/swig-napi-example-project/blob/main/.vscode/launch.json) has an example debug configuration for Visual Studio Code on Linux. Build with:

```
npm run swig:debug
node-gyp configure build --debug
```

## WASM

The WASM build also supports source-level debugging, but at the moment this is supported only with the built-in debugger in Chrome. As far as I know, it is currently not possible to make webpack pack the C/C++ source files automatically, you will have to copy these to the `test/browser/build` directory. You will also have to copy `build/Debug/example.wasm.map` and to change `lib/wasm.mjs` to point to the debug build. Use the following commands to build:

```
npm run swig:debug
CC=emcc CXX=em++ npx node-gyp configure build --target_platform=emscripten --debug
```

Then, it should be possible to step into the WASM code, showing the C/C++ source files instead of the WASM disassembly.

Also be sure to read https://developer.chrome.com/docs/devtools/wasm/.

# Integration with other build systems

`gyp` is a notoriously opinionated build system that is very difficult to integrate with other systems. You should check [`magickwand.js`](https://github.com/mmomtchev/magickwand.js) for an example that includes integration with `conan` for the dependencies, Autotools for ImageMagick on Linux/macOS and a custom full self-contained build on Windows. All of these use expansion of dummy `gyp` variables to launch external commands.

Alas, currently there are no real mature alternatives for Node.js - although someone else is working on `CMake` and I am working on `meson`.

# Roadmap

Check [SWIG JSE](https://github.com/mmomtchev/swig-napi-example-project.git) for my current roadmap.
