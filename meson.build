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
  add_global_link_arguments('--js-library=' + emnapi_js_lib, language : [ 'c', 'cpp' ])
endif

if get_option('debug') and meson.has_external_property('debug_c_args')
  add_global_arguments(meson.get_external_property('debug_c_args'), language : [ 'c', 'cpp' ])
endif
if get_option('debug') and meson.has_external_property('debug_link_args')
  add_global_link_arguments(meson.get_external_property('debug_link_args'), language : [ 'c', 'cpp' ])
endif
if get_option('no_async') != true and meson.has_external_property('async_args')
  add_global_arguments(meson.get_external_property('async_args'), language : [ 'c', 'cpp' ])
  add_global_link_arguments(meson.get_external_property('async_args'), language : [ 'c', 'cpp' ])
endif

includes += run_command('node', '-p', 'require("node-addon-api").include_dir', check: true).stdout().strip()

includes += include_directories(meson.get_external_property('node_api_include'), is_system: true)
if meson.has_external_property('node_lib')
  link_args += meson.get_external_property('node_lib')
endif

main_target = shared_module(
  'example',
  sources,
  include_directories : [includes, 'src'],
  name_prefix         : '',
  name_suffix         : name_suffix,
  install             : true,
  install_dir         : '/'
)

if meson.has_external_property('extra_output_files')
  extra_output_files = []
  foreach extra_file : meson.get_external_property('extra_output_files')
    extra_output_files += [ 'example.' + extra_file ]
  endforeach
  custom_target(
    'extra_files',
    command             : ['node', '-e', ''],
    depends             : main_target,
    input               : main_target,
    output              : [ extra_output_files ],
    install             : true,
    install_dir         : '/'
  )
endif
