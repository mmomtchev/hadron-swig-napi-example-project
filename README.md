# SWIG Node-API example skeleton with hadron build system

[![Test](https://github.com/mmomtchev/hadron-swig-napi-example-project/actions/workflows/run.yml/badge.svg)](https://github.com/mmomtchev/hadron-swig-napi-example-project/actions/workflows/run.yml)
[![codecov](https://codecov.io/gh/mmomtchev/hadron-swig-napi-example-project/graph/badge.svg?token=S833HD8I37)](https://codecov.io/gh/mmomtchev/hadron-swig-napi-example-project)

This is an example skeleton for a C++ project that uses SWIG Node-API with a [`meson`-based](https://github.com/mmomtchev/hadron) dual-build system supporting both Node.js/native and Browser/WASM builds.

You can find the classical [SWIG Node-API example skeleton using node-gyp](https://github.com/mmomtchev/swig-napi-example-project.git) here.

# EXPERIMENTAL NEW BUILD SYSTEM `hadron`

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

## `hadron` vs `node-gyp`

| Description | `node-gyp` | `meson` + `conan` + `xpm` |
| --- | --- | --- |
| Overview  | The official Node.js and Node.js native addon build system from the Node.js core team  | A new, still under development, experimental build system from SWIG JSE |
| Status | Very mature | Still not completely finished |
| Platforms with native builds | All platforms supported by Node.js  | Linux, Windows and macOS |
| WASM builds | Hackish, see `swig-napi-example-project` and `magickwand.js@1.1` for solutions | Out-of-the-box |
| Node.js APIs | All APIs, including the now obsolete raw V8 and NAN and the current Node-API | Only Node-API |
| Integration with other builds systems for external dependencies | Very hackish, see `swig-napi-example-project` and `magickwand.js@1.0` for solutions, the only good solution is to recreate the build system of all dependencies around `node-gyp` | Out-of-the-box support for `meson`, `CMake` and `autotools` |
| `conan` integration | Very hackish, see `magickwand.js@1.0` | Out-of-the-box |
| Build configurations through `npm install` CLI options | Yes | Yes |
| Distributing prebuilt binaries | Yes, multiple options, including `@mapbox/node-pre-gyp`, `prebuild-install` and `prebuildify` | `prebuild-install` |
| Requirements for the target host when installing from source | Node.js, Python and a working C++17 build environment | Only Node.js  when using `xpack-dev-tools`, a working C++17 build environment otherwise |
| Makefile language | Obscure and obsolete (`gyp`) | Modern and supported (`meson`)

When choosing a build system, if your project:
 * targets only Node.js/native and has no dependencies → stay on `node-gyp`
 * meant to be distributed only as binaries → stay on `node-gyp`
 * has a dual-environment native/WASM setup → `node-gyp` will work for you, but `hadron` has also some advantages
 * has dependencies with different build systems (`meson`, `CMake`, `autotools`) → `hadron` is the better choice
 * uses `conan` → `hadron` is the better choice
 * everything at once → `hadron` is the only choice

## What is currently missing

* A `xpack-dev-tools` example
* When using `xpack-dev-tools`, `zlib` on conan is broken with `clang` on Windows: https://github.com/conan-io/conan-center-index/issues/23058

# Try building yourself

The Github Actions automated build & test CI is set up to work on all three major OS.

## SWIG JSE

You must install **SWIG JavaScript Evolution** which must be available in your path.

A fast and easy way to get a binary for your platform is `conan`:

```shell
conan remote add swig-jse https://swig.momtchev.com/artifactory/api/conan/swig-jse
conan install --tool-requires swig-jse/5.0.3 --build=missing
```

If you want to use it outside of `conan`, you can find the directory where it is installed:

```shell
conan list swig-jse/5.0.3:*
conan cache path swig-jse/5.0.3:28c51be622f275401498fce89a192712bae70ae0
```

Be aware that most of the time, SWIG is developed, tested and used on Linux.

Real-world projects usually carry pregenerated SWIG wrappers and do not regenerate these at each installation.

Another, riskier, option is to pull `swig-jse` on the user's machine from `conan`.

There is also a Github Action: https://github.com/marketplace/actions/setup-swig

## Build

```shell
git clone https://github.com/mmomtchev/hadron-swig-napi-example-project.git
cd hadron-swig-napi-example-project
npm install --build-from-source
```

## Pass options

```shell
git clone https://github.com/mmomtchev/hadron-swig-napi-example-project.git
cd hadron-swig-napi-example-project
npm install --build-from-source --enable-zlib --disable-async
```

## Rebuild everything, including the WASM binary

This requires that `emscripten` is installed and activated in your environment. End-users rarely need to rebuild the WASM binaries, but if they do so, they either have to have `emscripten` or `emscripten` will have to be pulled from `conan` for a completely self-contained build.

```shell
git clone https://github.com/mmomtchev/hadron-swig-napi-example-project.git
cd hadron-swig-napi-example-project
npm install --build-from-source --build-wasm-from-source 
```

## Rebuild manually step-by-step

This is the build sequence that a developer will usually use:

```shell
# Do only once
npx xpm install
# Configure step, available configs are native, native-debug, wasm and wasm-debug
npx xpm run prepare --config native
# Optionally, access the meson configuration to set options
npx xpm run configure --config native -- -Dzlib=false
# Build step
npx xpm run build --config native
```

## Run the tests

Run the unit tests:
```shell
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

```shell
npx xpm install
npx xpm run prepare --config native-debug
# Optionally, enable asan (this is not compatible with a debugger)
npx xpm run configure --config native-debug -- -Db_sanitize=address
npx xpm run build --config native-debug
```

## WASM

The WASM build also supports source-level debugging, but at the moment this is supported only with the built-in debugger in Chrome. As far as I know, it is currently not possible to make webpack pack the C/C++ source files automatically, you will have to copy these to the `test/browser/build` directory. You will also have to copy `build/Debug/example.wasm.map` and to change `lib/wasm.mjs` to point to the debug build. Use the following commands to build:

```shell
npx xpm install
npx xpm run prepare --config wasm-debug
# Optionally, enable additional emscripten checks
npx xpm run configure --config wasm-debug -- -Db_sanitize=address
npx xpm run build --config wasm-debug
```

Then, it should be possible to step into the WASM code, showing the C/C++ source files instead of the WASM disassembly.

Also be sure to read https://developer.chrome.com/docs/devtools/wasm/.

# Integration with other build systems

You should check [`magickwand.js@2.0`](https://github.com/mmomtchev/magickwand.js) for an example that includes a `CMake` subproject.

# Roadmap

Check [SWIG JSE](https://github.com/mmomtchev/swig-napi-example-project.git) for my current roadmap.
