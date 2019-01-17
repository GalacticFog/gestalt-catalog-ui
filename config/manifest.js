const helmPlugin = require('./plugins/helm');
const apiPlugin = require('./plugins/api');
const { container, lambda, bundle, virtualMachine, } = require('./plugins/resource');

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
    plugin: container,
    options: {
      name: 'gestalt-poc',
      repo: repo,
      directories: ['catalog/containers'],
    },
  },
  {
    plugin: lambda,
    options: {
      name: 'gestalt-poc',
      repo: repo,
      directories: ['catalog/lambdas'],
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
  {
    plugin: virtualMachine,
    options: {
      name: 'gestalt-poc',
      repo: repo,
      directories: ['catalog/vms'],
    },
  },
];