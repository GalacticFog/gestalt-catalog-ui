const Plugin = require('../../lib/Plugin');
const { readFile } = require('../../lib/util');
const path = require('path');

class API extends Plugin {
  async handler() {
    const { filePath, files, icon, readme } = this.context;
    const swaggerMatch = new RegExp(/swagger.(json|yaml|yml)/gi);
    const entry = files.filter(f => swaggerMatch.test(f));

    if (entry.length) {
      const metaPath = path.join(filePath, entry[0]);
      const meta = readFile(metaPath);
      const payloadType = entry[0].endsWith('.yaml') || entry[0].endsWith('.yml')
        ? 'yaml'
        : 'json';
      
      return {
        meta: {
          name: meta.info.title,
          version: meta.info.version,
          description: meta.info.description,
          icon,
        },
        readme: readme,
        deploy: {
          enabled: false,
        },
        payload: {
          type: payloadType,
          render: 'swagger',  
          data: JSON.stringify(meta),
        },
      };
    } else {
      throw new Error(`swagger.(json|yaml|yml) file not found`);
    }
  }
}

module.exports = {
  name: 'api',
  type: 'API',
  version: '1.0.0',
  handler: API,
};
