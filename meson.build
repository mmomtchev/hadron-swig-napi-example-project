# --------------------
# Project files
# --------------------
project('SWIG Node-API Example Project',
  [ 'c', 'cpp' ],
  default_options : [
    'buildtype=release',
    'c_std=c11',
    # This is default when using node-gyp
    'cpp_std=c++17',
    # If you plan shipping prebuilt binaries for Windows, it is highly
    # recommended to enable this, it is the default in node-gyp too
    # and allows you to escape the Windows DLL hell
    'b_vscrt=static_from_buildtype'
  ])
module_name = 'example'

# Parsing of the npm options happens at this point
napi = import('node-api')
 
sources = [
  'src/array.cc',
  'src/blob.cc',
  'src/callback.cc',
  'src/map.cc',
  'build/example_wrap.cc'
  ]

dependencies = []

zlib = get_option('zlib')
async = get_option('async')

if zlib
  add_global_arguments([ '-DHAVE_ZLIB' ], language: [ 'c', 'cpp' ])
  zlib_dep = dependency('zlib', method : 'pkg-config')
  if host_machine.system() == 'windows' and meson.get_compiler('cpp').get_id() == 'clang'
    # Workaround for https://github.com/conan-io/conan-center-index/issues/23058
    # zlib with clang on Windows does not have a correct pkg-config name
    zdep_libdir = zlib_dep.get_pkgconfig_variable('libdir')
    zdep_incdir = zlib_dep.get_pkgconfig_variable('includedir')
    zlib_dep = declare_dependency(link_args: '-L@0@" -lz'.format(zdep_libdir), include_directories: zdep_incdir)
  endif
  dependencies += zlib_dep
endif

if async
  thread_dep = dependency('threads')
  dependencies += [thread_dep]
else
  add_global_arguments([ '-DNO_ASYNC' ], language: [ 'c', 'cpp' ])
endif

if host_machine.system() == 'windows' and meson.get_compiler('cpp').get_id() == 'clang'
  # Workaround for https://reviews.llvm.org/D70416 (seems fixed on Linux, but not on Windows)
  add_global_link_arguments([ '-l:libunwind.a' ], language: [ 'cpp' ])
endif

summary({
  'zlib': zlib,
  'async': async,
  },
  section: 'npm options'
)

# --------------------
# Build the module
# --------------------
napi.extension_module(
  module_name,
  sources,
  include_directories : [ 'src' ],
  install             : true,
  dependencies        : dependencies,
  node_api_options: {
    'swig': true
  }
)

# --------------------
# Install the extra files produced by SWIG (TypeScript definitions and ES6 named exports)
# --------------------
install_data(
  [ 'build' / module_name + '.d.ts', 'build' / module_name + '_wrap.cjs' ],
  install_dir: meson.global_source_root() / 'lib' / 'binding'
)
