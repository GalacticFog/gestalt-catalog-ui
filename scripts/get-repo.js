#!/usr/bin/env node

const { catalogRepo, catalogTargetDirectory } = require('../config');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const chalk = require('chalk');

const scriptsPath = path.resolve(__dirname);
const execSync = promisify(exec);

async function pull() {
  try {
    const { stdout, stderr } = await execSync(`${scriptsPath}/pull-repo.sh ${catalogRepo} ${catalogTargetDirectory}`);
    const out = stdout
      ? `[INFO]: Catalog Repo ${stdout}`
      : `[INFO]: Cloned Catalog Repo to ${catalogTargetDirectory}`;

    console.log(chalk.green(out));

    if (stderr) {
      console.error(chalk.red(`[ERROR]: ${stderr}`));
    }
  } catch (error) {
    console.error(chalk.red(`[ERROR]: ${error.stderr}`));
    process.exit(1);
  }
}

pull();
