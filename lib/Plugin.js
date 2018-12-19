class Plugin {
  constructor(props) {
    const { filePath, files } = props;
    this.context = {
      filePath,
      files
    };
  }
}

module.exports = Plugin;
