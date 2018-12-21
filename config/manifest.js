const helmPlugin = require('./plugins/helm');
const apiPlugin = require('./plugins/api');
const { container, lambda, bundle, virtualMachine, } = require('./plugins/resource');

module.exports = [
  {
    plugin: helmPlugin,
    options: {
      name: 'gestalt-poc',
      repo: 'https://github.com/GalacticFog/gestalt-poc',
      directories: ['catalog/helm'],
    },
  },
  {
    plugin: apiPlugin,
    options: {
      name: 'gestalt-poc',
      repo: 'https://github.com/GalacticFog/gestalt-poc',
      directories: ['catalog/apis'],
    },
  },
  {
    plugin: container,
    options: {
      name: 'gestalt-poc',
      repo: 'https://github.com/GalacticFog/gestalt-poc',
      directories: ['catalog/containers'],
    },
  },
  {
    plugin: lambda,
    options: {
      name: 'gestalt-poc',
      repo: 'https://github.com/GalacticFog/gestalt-poc',
      directories: ['catalog/lambdas'],
    },
  },
  {
    plugin: bundle,
    options: {
      name: 'gestalt-poc',
      repo: 'https://github.com/GalacticFog/gestalt-poc',
      directories: ['catalog/bundles'],
    },
  },
  {
    plugin: virtualMachine,
    options: {
      name: 'gestalt-poc',
      repo: 'https://github.com/GalacticFog/gestalt-poc',
      directories: ['catalog/vms'],
    },
  },
];