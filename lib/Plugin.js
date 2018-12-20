class Plugin {
  constructor(props) {
    const { filePath, files, ...rest } = props;
    this.context = {
      filePath,
      files,
      options: rest,
    };
  }
}

module.exports = Plugin;
