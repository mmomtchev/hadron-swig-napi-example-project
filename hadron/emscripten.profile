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
tools.build:cflags=[ '{{ "-pthread" if not os.getenv("npm_config_disable_async") else "-O0"  }}' ]
tools.build:cxxflags=[ '{{ "-pthread" if not os.getenv("npm_config_disable_async") else "-O0"  }}' ]
tools.cmake.cmaketoolchain:user_toolchain=['{{ os.getenv("EMSDK") }}/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake']

[options]

[tool_requires]
# Alas we need 3.1.53 which is not yet on conan
#emsdk/3.1.50
