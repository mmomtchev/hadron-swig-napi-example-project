[settings]
arch={{ platform.machine() }}
build_type=Release
compiler=clang
compiler.cppstd=gnu17
compiler.version=17
compiler.libcxx=libc++
os=Macos

[conf]
tools.build:sharedlinkflags=['-static-libstdc++', '-static-libgcc']
