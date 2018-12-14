const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const chalk = require('chalk');

const scriptsPath = path.resolve(process.cwd(), 'scripts');
const execSync = promisify(exec);

module.exports = async ({ catalogRepo, catalogTargetDirectory }) => {
  try {
    const { stdout, stderr } = await execSync(`${scriptsPath}/pull-repo.sh ${catalogRepo} ${catalogTargetDirectory}`);
    const out = stdout
      ? `success Catalog Repo ${stdout}`
      : `success Cloned Catalog Repo to ${catalogTargetDirectory}`;

    console.log(chalk.green(out));

    if (stderr) {
      console.error(chalk.red(`error ${stderr}`));
    }
  } catch (error) {
    console.error(chalk.red(`error ${error.stderr}`));
    process.exit(1);
  }
}
