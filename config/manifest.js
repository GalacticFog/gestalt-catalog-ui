const helmCompiler = require('./plugins/helm');
const apiCompiler = require('./plugins/api');

module.exports = [
  {
    plugin: helmCompiler,
    options: {
      name: 'galactic-helms',
      repo: 'https://gitlab.com/galacticfog/sample-catalog.git',
      directories: ['catalog/helm'],
    },
  },
  {
    plugin: apiCompiler,
    options: {
      name: 'galactic-apis',
      repo: 'https://gitlab.com/galacticfog/sample-catalog.git',
      directories: ['catalog/apis'],
    },
  },
];