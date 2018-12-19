const fs = require('fs').promises;
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const showdown = require('showdown');
const markdownConverter = new showdown.Converter();
markdownConverter.setOption('tables', true);
markdownConverter.setOption('openLinksInNewWindow', true);
markdownConverter.setFlavor('github');

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
  return fs.readFile(path, 'utf-8');
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