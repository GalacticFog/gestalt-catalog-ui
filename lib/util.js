const fsSync = require('fs');
const { promisify } = require('util');
const exec = require('child_process').execSync;
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

function fileExists(filepath) {
  let flag = true;
  try {
    fsSync.accessSync(filepath, fsSync.F_OK);
  } catch (e) {
    flag = false;
  }

  return flag;
}

function readFile(path, format = 'utf-8') {
  const fileOut = fsSync.readFileSync(path, format);
  
  if (path.endsWith('.yaml') || path.endsWith('.yml')) {
    return jsYaml.loadAll(fileOut).filter(Boolean)[0];
  }

  return IsJsonString(fileOut)
    ? JSON.parse(fileOut)
    : fileOut;
}

function isDirectory(path) {
  const stat = fsSync.statSync(path);
  return stat.isDirectory();
}

function execute(...args) {
  return exec(...args);
}

module.exports = {
  fileExists,
  readFile,
  isDirectory,
  execute,
}