
// Requires Node > 10, kubernetes-helm, (npm install rimraf chalk js-yaml showdown)
const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const jsYaml = require(`js-yaml`);
const showdown = require('showdown');
const chalk = require('chalk');
const { asyncForEach } = require('../../lib/util');

module.exports = async ({ catalogDirectory, catalogTargetDirectory, catalogCompiledDirectory }) => {
  const chartMatch = new RegExp(/Chart.(yaml|yml)/gi);
  // const requirementsMatch = new RegExp(/requirements.(yaml|yml)/gi);
  const markdownConverter = new showdown.Converter();
  markdownConverter.setOption('tables', true);
  markdownConverter.setOption('openLinksInNewWindow', true);
  markdownConverter.setFlavor('github');

  async function exists(filepath) {
    let flag = true;
    try {
      await fs.access(filepath, fs.F_OK);
    } catch (e) {
      flag = false;
    }

    return flag;
  }

  const compile = async (dir) => {
    const files = await fs.readdir(dir);

    for (file of files) {
      const filepath = path.join(dir, file);
      const stat = await fs.stat(filepath);

      if (stat.isDirectory()) {
        const chartFiles = await fs.readdir(filepath);
        const chart = chartFiles.filter(f => chartMatch.test(f));

        if (chart.length) {
          try {
            // await exec(`helm lint ${filepath} `);
            await exec(`helm dep update ${filepath}`);
            const { stdout } = await exec(`helm template ${filepath}`);
            const chartPath = path.join(filepath, chart[0]);
            const chartout = await fs.readFile(chartPath, 'utf-8');

            // Compile README
            const readmePath = path.join(filepath, 'README.md');
            const readmeout =
              await exists(readmePath)
                ? await fs.readFile(readmePath, 'utf-8')
                : null;

            // Compile requirements
            const requirementsPath = path.join(filepath, 'requirements.yaml');
            const requirementsout =
              await exists(requirementsPath)
                ? await fs.readFile(requirementsPath, 'utf-8')
                : null;

            // Write the Json file
            const outputPath = path.join(catalogCompiledDirectory, `${file}.json`);

            // convert yaml to json
            const meta = jsYaml.loadAll(chartout).filter(Boolean)[0];
            const assets = jsYaml.loadAll(stdout).filter(Boolean);
            const requirements = jsYaml.loadAll(requirementsout).filter(Boolean)[0] || { dependencies: [{ name: 'none' }] };
            const payload = stdout;
            const readme = markdownConverter.makeHtml(readmeout);

            const model = {
              type: 'Helm Chart',
              meta,
              assets,
              readme,
              requirements,
              payload,
            };

            await fs.writeFile(outputPath, JSON.stringify(model, null, 2));
            console.log(chalk.green(`success compiled ${file} Chart`));
          } catch (e) {
            console.error(chalk.red(`error Helm Compile - ${e}`));
            process.exit(1);
          }
        }
      }
    }
  }

  asyncForEach(catalogDirectory, async dir => {
    console.log(chalk.blue(`Compiling ${dir} Charts`));
    await compile(path.join(process.cwd(), catalogTargetDirectory, dir));
  });
}
