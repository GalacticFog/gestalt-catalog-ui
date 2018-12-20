const fs = require('fs').promises;
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const jsYaml = require(`js-yaml`);
const showdown = require('showdown');
const markdownConverter = new showdown.Converter();
markdownConverter.setOption('tables', true);
markdownConverter.setOption('openLinksInNewWindow', true);
markdownConverter.setFlavor('github');

function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  
  return true;
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function readmeToHTML(path) {
  if (await fileExists(path)) {
    return markdownConverter.makeHtml(await fs.readFile(path, 'utf-8'));
  }
  return '';
}

async function fileExists(filepath) {
  let flag = true;
  try {
    await fs.access(filepath, fs.F_OK);
  } catch (e) {
    flag = false;
  }

  return flag;
}

async function readFile(path) {
  const fileOut = await fs.readFile(path, 'utf-8');
  
  if (path.endsWith('.yaml') || path.endsWith('.yml')) {
    return jsYaml.loadAll(fileOut).filter(Boolean)[0];
  }

  return IsJsonString(fileOut)
    ? JSON.parse(fileOut)
    : fileOut;
}

async function isDirectory(path) {
  const stat = await fs.stat(path);
  return stat.isDirectory();
}

async function execute(...args) {
  return exec(...args);
}

module.exports = {
  asyncForEach,
  readmeToHTML,
  fileExists,
  readFile,
  isDirectory,
  execute,
}