
// Requires Node > 10, kubernetes-helm, (npm install rimraf chalk js-yaml showdown)
const Plugin = require('../../lib/Plugin');
const { readFile, fileExists, execute, readmeToHTML } = require('../../lib/util');
const path = require('path');

class Helm extends Plugin {
  async helmCompile(filepath) {
    await execute(`helm lint ${filepath}`);
    await execute(`helm dep update ${filepath}`);
    return await execute(`helm template ${filepath}`);
  }

  async generateRequirements(path) {
    return await fileExists(path)
      ? await readFile(path)
      : null;
  }
  
  async handler() {
    const { filePath, files } = this.context;
    const chartMatch = new RegExp(/Chart.(yaml|yml)/gi);
    const chart = files.filter(f => chartMatch.test(f));

    if (chart.length) {
      const { stdout } = await this.helmCompile(filePath);
      const chartPath = path.join(filePath, chart[0]);
      const meta = await readFile(chartPath);
      const requirements = await this.generateRequirements(
        path.join(filePath, 'requirements.yaml')
      );
      
      // Compile README
      const readme = await readmeToHTML(
        path.join(filePath, 'README.md')
      );

      const model = {
        meta,
        readme,
        deployable: true,
        payload: {
          type: 'yaml',
          render: 'code',
          data: stdout,
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
