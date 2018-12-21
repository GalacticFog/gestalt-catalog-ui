const { readFile, fileExists } = require('./util');
const path = require('path');
const showdown = require('showdown');
const markdownConverter = new showdown.Converter();
markdownConverter.setOption('tables', true);
markdownConverter.setOption('openLinksInNewWindow', true);
markdownConverter.setFlavor('github');

class Plugin {
  constructor(props) {
    const { filePath, files, ...rest } = props;
    
    this.context = {
      filePath,
      files,
      icon: this.getIcon(files, filePath),
      readme: this.getReadme(filePath),
      options: rest,
    };
  }

  getIcon(files, filePath) {    
    const iconMatch = new RegExp(/icon.(png|svg)/gi);
    const icon = files.filter(f => iconMatch.test(f));

    if (icon.length) {
      const iconFile = readFile(path.resolve(filePath, icon[0]), 'base64');
      const format = icon[0].endsWith('png') ? 'data:image/png' : 'data:image/svg+xml';

      return `${format};base64,${iconFile}`;
    }

    return '';
  }

  getReadme(filePath) {
    const readmePath = path.join(filePath, 'README.md');

    if (fileExists(readmePath)) {
      return markdownConverter.makeHtml(readFile(readmePath));
    }

    return '';
  }
}

module.exports = Plugin;
