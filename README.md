# Gestalt Catalog Ui
The Gestalt Catalog is under **heavy development**.

## Goals
* Allow you render a Ui store catalog based off of any Helm Chart based repo

## Workflow
* Compile a catalog based off of any valid Helm Chart  based repo
* Statically build a Ui 
* publish it to a location where it can be hosted (S3/Minio, etc...)

## Compiler Plugins
The `config` directory conists of an main index config file, a plugin-manifest and a directory of plugins you wish to register

### index.js
The main catalog configuration

## Using a plugin
A plugin and its config can be added the the `config/manifest.js` file. A plugin requires at least 2 options

* repo: the file repo you wish to clone (currently git based repos are supported)
* directories: any numbder of directory names you want to iterate through. Typically, one is recommnended.

 e.g:

```
const myPlugin = require('./plugins/plugin');

module.exports = [
  {
    plugin: myPlugin,
    options: {
      repo: 'https://github.com/jb/myrepo',
      directories: ['directory1'],
    },
  },

  .....other plugins
];


### Plugin Development
Currently, plugins must be locally checked into the `config/plugins` directory.

A plugin simply acts against a single directory and compiles the contents into the desired format nescessary to display in the catalog ui.  The plugin must return a valid schema. You can find a schema representation of this schema in `lib/schema`. It's up to you on how you want to fill in the missing properties within the plugin.

To author a new plugin create a new file using the following boilerplate:
```
const Plugin = require('../../lib/Plugin');
const { fileExists, execute } = require('../../lib/util');

class Helm extends Plugin {
  async handler() {
    // you can access the compiler context via
    const { filePath, files } = this.context;

    try{
      ... do some magic
    } catch (e){
      /// log the error
    }

    return {
      meta,
      payload,
      readme, // optional
      requirements, // optional
    }
  }
}

#### lib
```
const { ...helpers } = require('../../lib/util');
```
`lib/util` gives you access to several helpers:

```
asyncForEach,
readmeToHTML,
fileExists,
readFile,
isDirectory,
execute,
```


## Running in development
```
yarn install
yarn develop
```

##  Pre-Reqs
```
npm install -g gatsby
brew install kubernetes-helm
```