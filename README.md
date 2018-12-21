# Gestalt Catalog Ui
The Gestalt Catalog is under **heavy development** - as such, the api may change

## Goals
* Render a Ui store catalog based from some collection of resources (Helm Charts, Swagger docs, serverless configs, etc...)

## Workflow
* Compile a catalog based off of a target source code repo
* Statically build a Ui 
* Publish it to a location where it can be hosted (S3/Minio, etc...) via CI

## Compiler Plugins
The `config` directory conists of an main index config file, a plugin-manifest and a directory of plugins you wish to register

## Configuring a Plugin
A plugin and its config can be added the the `config/manifest.js` file. A plugin requires at least 2 options

* repo: the file repo you wish to clone (currently git based repos are supported)
* directories: any numbder of directory names you want to iterate through. Typically, one is recommnended.

 e.g:

```javascript
const myPlugin = require('./plugins/Plugin');

module.exports = [
  {
    plugin: myPlugin,
    options: {
      repo: 'https://github.com/jb/myrepo',
      directories: ['directory1'],
    },
  },

  // ...other plugins
];
```

### Plugin Development
Currently, plugins must be locally checked into the `config/plugins` directory.

Plugins are used transform some directory of files into a data model the gestalt-catalog-ui can compile with. Therefore, a plugin must conform to a valid schema and it's up to you on how you want to fill in the missing properties within the plugin.

```javascript
{
  meta: {
    name: 'hello',
    description: 'world'
    version: '1.0.0',
    icon, // available via this.context
  }
  payload: {
    type: 'json || yaml', // used to determine what the data format is
    render: 'swagger | code', // used to determine what view to render in the details
    data: 'some data...',
  }
  readme, // optional - available via this.context
  requirements, // optional- available via this.context
}
```

To author a new plugin create a new file using the following boilerplate:

```javascript
const Plugin = require('../../lib/Plugin');
const { fileExists, execute } = require('../../lib/util');

class Helm extends Plugin {
  async handler() {
    // you can access the compiler context via
    const { filePath, files, readme, icon } = this.context;

    //do some magic

    return {
      meta: {
        name: 'hello',
        description: 'world'
        version: '1.0.0',
        icon,
      }
      payload: {
        type: 'json'
        render: 'code',
        data: 'some data...',
      }
      readme,
      requirements,
    }
  }
}
```

#### Utility Mixins

```javascript
const { ...helpers } = require('../../lib/util');
```

`lib/util` gives you access to several helpers:

```
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