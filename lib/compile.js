#!/usr/bin/env node

const config = require('../config');
const plugins = require('../config/manifest');
const getRepo = require('./get-repo');
const { readFile, fileExists, isDirectory } = require('../lib/util');
const chalk = require('chalk');
const rimraf = require('rimraf');
const fs = require('fs').promises;
const path = require('path');
const { string, object, array } = require('yup');
const { castSchema } = require('./schema');

const log = console.log;
const optionSchema = object().shape({
  name: string().required(),
  repo: string().required(),
  directories: array().of(string()).required(),
});

async function prepTask() {
  const { catalogCompiledDirectory } = config;
  log(`Cleaning ${catalogCompiledDirectory}`);
  try {
    rimraf.sync(`${catalogCompiledDirectory}/*`);
    await fs.mkdir(catalogCompiledDirectory, { recursive: true });
  } catch (e) {
    log(chalk.red(`error prepping`));
  }
}

async function repoTask({ name, repo }) {
  const { catalogReposDirectory } = config;

  try {
    await getRepo({ name, repo, catalogReposDirectory });
  } catch (e) {
    log(chalk.red(`error fetching ${repo}`));
  }
}

async function generateFileName(file) {
  return await fileExists(file)
    ? `${file}-1.json`
    : `${file}.json`;
}

async function compile() {
  await prepTask();
  // Iterate through each plugin
  for (const { plugin, options } of plugins) {
    try {
      const validOptions = await optionSchema.validate(options);
      const { catalogReposDirectory, catalogCompiledDirectory } = config;
      const { name, directories } = validOptions;
      await repoTask(validOptions); // TODO: this can probably be a strategy later

      // Iterate through each options.directories in the plugin config
      for (const dir of directories) {
        log(chalk.blue(`info`), `compiling ${dir} using ${plugin.name} plugin vesion ${plugin.version}`);

        const files = await fs.readdir(path.join(process.cwd(), catalogReposDirectory, name, dir));
    
        // Iterate through each file that needs to be compiled
        for (const file of files) {
          const filePath = path.join(process.cwd(), catalogReposDirectory, name, dir, file);
          const innerFiles = await fs.readdir(filePath);
          const fileName = await generateFileName(file);
          const outputPath = path.join(catalogCompiledDirectory, fileName);
          const props = {
            filePath,
            files: innerFiles,
            ...validOptions
          };

          if (isDirectory(filePath)) {
            try {
              const Plugin = new plugin.handler(props);
              const model = await Plugin.handler();
          
              const validModel = castSchema({ file: fileName, type: plugin.type, ...model });
              await fs.writeFile(outputPath, JSON.stringify(validModel, null, 2));
              log(chalk.green(`success`), `compiled ${file} ${plugin.type}`);
            } catch (e) {
              log(chalk.red(`error`), `compiling ${file}: ${e}`);
            }
          }
        }
      }

      log(chalk.green(`success`), `finished compiling ${plugin.name} plugin`);
    } catch (e) {
      log(chalk.red(`error`), `loading ${plugin.name} plugin: ${e}`);
    }
  }
}

compile();