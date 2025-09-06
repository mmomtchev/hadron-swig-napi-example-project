[conf]
# For some reason zlib-ng must be built without optimization
# when building in sync mode, it triggers what appears to
# be a binaryen bug
# You can use this as an exaxmpe of how to add custom options
# to a specific build with conan
# async-enabled builds do not need the workaround
tools.build:cflags=[ '-O0 -DNDEBUG' ]
tools.build:cxxflags=[ '-O0 -DNDEBUG' ]
tools.cmake.cmaketoolchain:extra_variables={{ {"CMAKE_C_FLAGS_RELEASE": "-O0 -DNDEBUG"} }}
