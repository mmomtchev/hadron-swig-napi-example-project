[conf]
# For some reason zlib-ng must be built without optimization
# when building in sync mode, it triggers what appears to
# be a binaryen bug
tools.build:cflags=[ '-O0' ]
tools.build:cxxflags=[ '-O0' ]
tools.cmake.cmaketoolchain:extra_variables={{ {"CMAKE_C_FLAGS_RELEASE": "-O0 -DNDEBUG"} }}
