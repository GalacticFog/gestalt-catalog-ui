const Plugin = require('../../lib/Plugin');
const { readFile, isJSON } = require('../../lib/util');
const path = require('path');

class Resource extends Plugin {
  formatHeaders(deploy) {
    if (deploy.headers) {
      return isJSON(deploy.headers)
        ? headers
        : JSON.stringify(deploy.headers);
    }

    return JSON.stringify({});
  }

  formatDeploy(deploy) {
    if (deploy) {

      return {
        ...deploy,
        type: 'generic',
        headers: this.formatHeaders(deploy),
        enabled: true,
      }
    }

    return {
      enabled: false,
    }
  }

  async handler() {
    const { filePath, files, icon, readme } = this.context;

    // Find metadata file
    const fileMatch = new RegExp(/metadata.(json|yaml|yml)/gi);
    const entry = files.filter(f => fileMatch.test(f));

    if (entry.length) {
      // Get deploy model from higher-level directory

      const { deploy, payload } = readFile(path.join(filePath, '../../metadata.yaml'));
      const deployModel = this.formatDeploy(deploy);

      // Read catalog item metadata
      const metaPath = path.join(filePath, entry[0]);
      const { name, description, version } = readFile(metaPath);

      // Look for a data.json file to determine the deployment payload
      const data = JSON.stringify(readFile(path.join(filePath, 'data.json')));
      const payloadType = payload.type;

      return {
        meta: {
          name,
          version,
          description,
          icon,
        },
        readme,
        deploy: deployModel,
        payload: {
          type: payloadType,
          render: 'none',
          data,
        },
      };
    } else {
      throw new Error(`metadata.(json|yaml|yml) file not found`);
    }
  }
}

const container = {
  name: 'container',
  type: 'Container',
  version: '1.0.0',
  handler: Resource,
};

const lambda = {
  name: 'lambda',
  type: 'Lambda',
  version: '1.0.0',
  handler: Resource,
};

const bundle = {
  name: 'bundle',
  type: 'Bundle',
  version: '1.0.0',
  handler: Resource,
};

const virtualMachine = {
  name: 'virtualMachine',
  type: 'Virtual Machine',
  version: '1.0.0',
  handler: Resource,
};

module.exports = {
  container,
  lambda,
  bundle,
  virtualMachine,
};
