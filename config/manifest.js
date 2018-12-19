const helmCompiler = require('./plugins/helm');

module.exports = [
  {
    plugin: helmCompiler,
    options: {
      repo: 'https://github.com/bitnami/charts',
      directories: ['upstreamed', 'bitnami'],
    },
  },
];