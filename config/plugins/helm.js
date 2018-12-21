
// Requires Node > 10, kubernetes-helm, (npm install rimraf chalk js-yaml showdown)
const Plugin = require('../../lib/Plugin');
const { readFile, fileExists, execute } = require('../../lib/util');
const path = require('path');

class Helm extends Plugin {
  helmCompile(filepath) {
    const { options: { lint = true } } = this.context;

    if (lint) {
      execute(`helm lint ${filepath}`);
    }
    
    execute(`helm dep update ${filepath}`);
    return execute(`helm template ${filepath}`);
  }

  generateRequirements( path) {
    return fileExists(path)
      ? readFile(path)
      : null;
  }
  
  async handler() {
    const { filePath, files, readme, icon } = this.context;
    const chartMatch = new RegExp(/Chart.(yaml|yml)/gi);
    const chart = files.filter(f => chartMatch.test(f));

    if (chart.length) {
      const data = this.helmCompile(filePath);
      const chartPath = path.join(filePath, chart[0]);
      const meta = readFile(chartPath);
      const requirements = this.generateRequirements(
        path.join(filePath, 'requirements.yaml')
      );

      const model = {
        meta: {
          ...meta,
          icon: meta.icon || icon,
        },
        readme,
        deploy: {
          enabled: true,
          type: 'custom',
        },
        payload: {
          type: 'yaml',
          render: 'code',
          data,
        },
      };

      if (requirements) {
        model.requirements = requirements;
      }

      return model;
    } else {
      throw new Error(`Chart.(yaml|yml) file not found`);
    }
  }
}

module.exports = {
  name: 'helm',
  type: 'Helm Chart',
  version: '1.0.0',
  handler: Helm,
};
