project('SWIG Node-API Example Project',
  ['c', 'cpp'],
  default_options : ['buildtype=release']
  )
 
sources = [
  'src/array.cc',
  'src/blob.cc',
  'src/callback.cc',
  'src/map.cc',
  'build/example_wrap.cc'
  ]

c_args = []
cpp_args = []
link_args = []
includes = []

name_suffix = 'node'
if meson.has_external_property('name_suffix')
  name_suffix = meson.get_external_property('name_suffix')
endif

if meson.has_external_property('emnapi') and meson.get_external_property('emnapi')
  includes += run_command(
    'node',
    '-p',
    'require("emnapi").include_dir', check: true
    ).stdout().strip()
  sources  += run_command(
    'node',
    '-p',
    'require("emnapi").sources.map(x => path.relative(process.cwd(), x)).join(",")', check: true
    ).stdout().strip().split(',')
  emnapi_js_lib = run_command('node', '-p', 'require("emnapi").js_library', check: true).stdout().strip()
  link_args += [ '--js-library=' + emnapi_js_lib ]
endif

if meson.has_external_property('extra_c_args')
  c_args += meson.get_external_property('extra_c_args')
endif
if meson.has_external_property('extra_cpp_args')
  cpp_args += meson.get_external_property('extra_cpp_args')
endif
if meson.has_external_property('extra_link_args')
  link_args += meson.get_external_property('extra_link_args')
endif

if get_option('debug') and meson.has_external_property('debug_c_args')
  c_args += meson.get_external_property('debug_c_args')
endif
if get_option('debug') and meson.has_external_property('debug_link_args')
  link_args += meson.get_external_property('debug_link_args')
endif
if get_option('no_async') != true and meson.has_external_property('async_args')
  c_args += meson.get_external_property('async_args')
  cpp_args += meson.get_external_property('async_args')
  link_args += meson.get_external_property('async_args')
endif
if get_option('asan') and meson.has_external_property('asan_args')
  c_args += meson.get_external_property('asan_args')
  cpp_args += meson.get_external_property('asan_args')
  link_args += meson.get_external_property('asan_args')
endif
if get_option('codecov') and meson.has_external_property('codecov_args')
  c_args += meson.get_external_property('codecov_args')
  cpp_args += meson.get_external_property('codecov_args')
  link_args += meson.get_external_property('codecov_args')
endif

includes += run_command('node', '-p', 'require("node-addon-api").include_dir', check: true).stdout().strip()

inc_napi = include_directories(includes)
inc_node = include_directories('/usr/include/node', is_system: true)

main_target = shared_module(
  'example',
  sources,
  include_directories : [inc_node, inc_napi, 'src'],
  name_prefix         : '',
  name_suffix         : name_suffix,
  c_args              : c_args,
  cpp_args            : c_args + cpp_args,
  link_args           : link_args,
  install             : true,
  install_dir         : '/'
)

if meson.has_external_property('output_extra_files')
  output_extra_files = []
  foreach extra_file : meson.get_external_property('output_extra_files')
    output_extra_files += [ 'example.' + extra_file ]
  endforeach
  custom_target(
    'extra_files',
    command             : ['node', '-e', ''],
    depends             : main_target,
    input               : main_target,
    output              : [ output_extra_files ],
    install             : true,
    install_dir         : '/'
  )
endif
