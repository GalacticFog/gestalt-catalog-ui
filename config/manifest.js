const helmPlugin = require('./plugins/helm');
const apiPlugin = require('./plugins/api');
const { bundle } = require('./plugins/resource');

const repo = process.env.SOURCE_REPO || 'https://github.com/GalacticFog/gestalt-poc'

module.exports = [
  {
    plugin: helmPlugin,
    options: {
      name: 'gestalt-poc',
      repo: repo,
      directories: ['catalog/helm'],
    },
  },
  {
    plugin: apiPlugin,
    options: {
      name: 'gestalt-poc',
      repo: repo,
      directories: ['catalog/apis'],
    },
  },
  {
    plugin: bundle,
    options: {
      name: 'gestalt-poc',
      repo: repo,
      directories: ['catalog/bundles'],
    },
  },
];