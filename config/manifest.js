const helmCompiler = require('./plugins/helm');
const apiCompiler = require('./plugins/api');

module.exports = [
  {
    plugin: helmCompiler,
    options: {
      name: 'galactic-helms',
      repo: 'https://github.com/GalacticFog/gestalt-poc',
      directories: ['catalog/helm'],
    },
  },
  {
    plugin: apiCompiler,
    options: {
      name: 'galactic-apis',
      repo: 'https://github.com/GalacticFog/gestalt-poc',
      directories: ['catalog/apis'],
    },
  },
];