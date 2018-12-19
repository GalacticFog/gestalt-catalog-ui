
// Requires Node > 10, kubernetes-helm, (npm install rimraf chalk js-yaml showdown)
const Plugin = require('../../lib/Plugin');
const { readFile, fileExists, execute, readmeToHTML } = require('../../lib/util');
const path = require('path');
const jsYaml = require(`js-yaml`);
const chalk = require('chalk');
const chartMatch = new RegExp(/Chart.(yaml|yml)/gi);
// const requirementsMatch = new RegExp(/requirements.(yaml|yml)/gi);

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
    const chart = files.filter(f => chartMatch.test(f));

    if (chart.length) {
      try {
        const { stdout } = await this.helmCompile(filePath);
        const chartPath = path.join(filePath, chart[0]);
        const chartout = await readFile(chartPath)

        // Compile README
        const readme = await readmeToHTML(
          path.join(filePath, 'README.md')
        );

        // Compile requirements
        const requirementsout = await this.generateRequirements(
          path.join(filePath, 'requirements.yaml')
        );

        // convert yaml to json
        const meta = jsYaml.loadAll(chartout).filter(Boolean)[0];
        // const assets = jsYaml.loadAll(stdout).filter(Boolean);
        const requirements = jsYaml.loadAll(requirementsout).filter(Boolean)[0];
        const payload = stdout;

        return {
          meta,
          readme,
          payload,
          requirements,
        };
      } catch (e) {
        console.error(chalk.red(`error`), `Helm Compile - ${e}`);
      }
    }
  }
}

module.exports = {
  name: 'helm',
  type: 'Helm Chart',
  version: '1.0.0',
  handler: Helm,
};
