const helmCompiler = require('./plugins/helm');

module.exports = [
  {
    name: 'helm',
    handler: helmCompiler,
    options: {
      catalogRepo: 'https://github.com/bitnami/charts',
      catalogDirectory: ['upstreamed'],
    },
  },
];