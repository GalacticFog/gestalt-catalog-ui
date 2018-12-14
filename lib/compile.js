#!/usr/bin/env node

const config = require('../config');
const plugins = require('../config/plugin-manifest');
const getRepo = require('./get-repo');
const { asyncForEach } = require('../lib/util');
const chalk = require('chalk');
const rimraf = require('rimraf');
const fs = require('fs').promises;

asyncForEach(plugins, async ({ name, handler, options }) => {
  const { catalogTargetDirectory, catalogCompiledDirectory } = config;
  const { catalogRepo } = options;

  try {
    console.log(`Cleaning ${catalogCompiledDirectory}`);
    rimraf.sync(`${catalogCompiledDirectory}/*`);
    await fs.mkdir(catalogCompiledDirectory, { recursive: true });

    await getRepo({ catalogRepo, catalogTargetDirectory })
    await handler({ catalogTargetDirectory, catalogCompiledDirectory, name, ...options });

    console.log(chalk.green(`success finished compiling ${name} plugin`));
  } catch (e) {
    console.log(chalk.red(`error loading ${name} plugin`));
  }
});