include(default)

[conf]
# This is a very good precaution - when a Node.js addon
# includes a static library, this will prevent symbol
# collisions with another version of the same library loaded
# by Node.js or another addon
tools.build:sharedlinkflags=['-Wl,--exclude-libs,ALL']
