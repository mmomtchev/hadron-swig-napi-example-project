[buildenv]
CC=clang.cmd
CXX=clang++.cmd

[env]
AR=llvm-ar.cmd

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
