const path = require('path');
const chalk = require('chalk');
const { execute } = require('../lib/util');

const log = console.log;

module.exports = async ({ name, repo, catalogReposDirectory }) => {
  try {
    const scriptsPath = path.resolve(process.cwd(), 'lib');
    const repoTargetPath = path.resolve(process.cwd(), `${catalogReposDirectory}/${name}`);
    const { stdout, stderr } = await execute(`${scriptsPath}/pull-repo.sh ${repo} ${repoTargetPath}`);
    const out = stdout
      ? `Catalog Repo ${stdout}`
      : `Cloned Catalog Repo to ${catalogReposDirectory}`;

    log(chalk.green('success'), out);

    if (stderr) {
      error(chalk.red(`error`), `${stderr}`);
    }
  } catch (error) {
    error(chalk.red(`error`), `${error.stderr}`);
    process.exit(1);
  }
}
