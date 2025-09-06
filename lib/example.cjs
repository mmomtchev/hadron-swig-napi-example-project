const os = require('node:os');

module.exports = require(`./binding/${os.platform()}-${os.arch()}/example.node`);
