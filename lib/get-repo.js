const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const chalk = require('chalk');

const scriptsPath = path.resolve(process.cwd(), 'lib');
const execSync = promisify(exec);

module.exports = async ({ name, repo, catalogReposDirectory }) => {
  
  try {
    const { stdout, stderr } = await execSync(`${scriptsPath}/pull-repo.sh ${repo} ${catalogReposDirectory}/${name}`);
    const out = stdout
      ? `Catalog Repo ${stdout}`
      : `Cloned Catalog Repo to ${catalogReposDirectory}`;

    console.log(chalk.green('success'), out);

    if (stderr) {
      console.error(chalk.red(`error`), `${stderr}`);
    }
  } catch (error) {
    console.error(chalk.red(`error`), `${error.stderr}`);
    process.exit(1);
  }
}
