const fsSync = require('fs');
const exec = require('child_process').execSync;
const jsYaml = require(`js-yaml`);

function isJSON(str) {
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

  return isJSON(fileOut)
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
  isJSON,
  fileExists,
  readFile,
  isDirectory,
  execute,
}