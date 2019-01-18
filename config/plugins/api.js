const Plugin = require('../../lib/Plugin');
const { readFile } = require('../../lib/util');
const path = require('path');

class API extends Plugin {
  async handler() {
    const { filePath, files, icon, readme } = this.context;

    // Load the metadata file (if it exists)
    const metadata = loadMetadataFile(filePath, files) || {};

    // Load the swagger file (if it exists)
    const { swagger, payload } = loadSwaggerFile(filePath, files) || {
      swagger: {},
      payload: {
        type: 'json',
        render: 'none',
        data: {}
      }
    };

    // Return metadata (metadata file takes prescendence over swagger file)
    return {
      meta: {
        name: metadata.name || swagger.info.title,
        version: metadata.version || swagger.info.version,
        description: metadata.description || swagger.info.description,
        icon,
      },
      categories: metadata.categories,
      readme: readme,
      deploy: {
        enabled: false,
      },
      payload,
    };
  }
}

function loadMetadataFile(filePath, files) {
  // Find metadata file
  const fileMatch = new RegExp(/metadata.(json|yaml|yml)/gi);
  const entry = files.filter(f => fileMatch.test(f));

  if (entry.length) {
    // Read catalog item metadata
    const metaPath = path.join(filePath, entry[0]);
    return readFile(metaPath);
  }
  return null;
}

function loadSwaggerFile(filePath, files) {
  const swaggerMatch = new RegExp(/swagger.(json|yaml|yml)/gi);
  const entry = files.filter(f => swaggerMatch.test(f));

  if (entry.length) {
    const metaPath = path.join(filePath, entry[0]);
    const swagger = readFile(metaPath);
    const payloadType = entry[0].endsWith('.yaml') || entry[0].endsWith('.yml')
      ? 'yaml'
      : 'json';

    return {
      swagger,
      payload: {
        type: payloadType,
        render: 'swagger',
        data: JSON.stringify(swagger),
      }
    }
  }

  return null;
}


module.exports = {
  name: 'api',
  type: 'API',
  version: '1.0.0',
  handler: API,
};
