include(default)

[conf]
tools.build:sharedlinkflags=['-Wl,--exclude-libs,ALL', '-static-libstdc++', '-static-libgcc']
