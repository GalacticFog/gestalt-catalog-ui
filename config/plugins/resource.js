const Plugin = require('../../lib/Plugin');
const { readFile, IsJsonString } = require('../../lib/util');
const path = require('path');

class Resource extends Plugin {
  async handler() {
    const { filePath, files, icon, readme } = this.context;
    const swaggerMatch = new RegExp(/metadata.(json|yaml|yml)/gi);
    const entry = files.filter(f => swaggerMatch.test(f));

    if (entry.length) {
      const metaPath = path.join(filePath, entry[0]);
      const { name, description, version, deploy } = readFile(metaPath);
      const payloadType = entry[0].endsWith('.yaml') || entry[0].endsWith('.yml')
        ? 'yaml'
        : 'json';

      return {
        meta: {
          name,
          version,
          description,
          icon,
        },
        readme,
        deploy: {
          enabled: true,
          ...deploy,
        },
        payload: {
          type: payloadType,
          render: 'none',
          // data: JSON.stringify(meta),
        },
      };
    } else {
      throw new Error(`swagger.(json|yaml|yml) file not found`);
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
