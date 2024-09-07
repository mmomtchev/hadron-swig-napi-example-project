[buildenv]
CC=clang.cmd
CXX=clang++.cmd
LD=clang-ld.cmd
AR=llvm-ar.cmd
RANLIB=llvm-ranlib.cmd

[settings]
arch=x86_64
build_type=Release
compiler=clang
compiler.cppstd=gnu17
compiler.version=17
compiler.libcxx=libc++
os=Windows

[conf]
tools.build:sharedlinkflags=['-Wl,--exclude-libs,ALL', '-static-libstdc++', '-static-libgcc']
tools.gnu:make_program=make.cmd
tools.cmake.cmaketoolchain:extra_variables={'CMAKE_AR': 'llvm-ar.cmd', 'CMAKE_RANLIB': 'llvm-ranlib.cmd'}
