const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const chalk = require('chalk');

const scriptsPath = path.resolve(process.cwd(), 'scripts');
const execSync = promisify(exec);

module.exports = async ({ repo, catalogRepoDirectory }) => {
  try {
    const { stdout, stderr } = await execSync(`${scriptsPath}/pull-repo.sh ${repo} ${catalogRepoDirectory}`);
    const out = stdout
      ? `Catalog Repo ${stdout}`
      : `Cloned Catalog Repo to ${catalogRepoDirectory}`;

    console.log(chalk.green('success'), out);

    if (stderr) {
      console.error(chalk.red(`error`), `${stderr}`);
    }
  } catch (error) {
    console.error(chalk.red(`error`), `${error.stderr}`);
    process.exit(1);
  }
}
