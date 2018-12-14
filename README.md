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

### plugin-manifest.js
An array of plugins and corresponding actions and their options. e.g.

```
const myCompiler = require('./plugins/myCompiler');

module.exports = [
  {
    name: 'myCompiler',
    handler: myCompiler,
    options: {
      option1: 'an option',
      ...
    },
  },
];
```


### plugins directory
Compiler files with the following signature:

```
module.exports = async ({ catalogDirectory, catalogTargetDirectory, catalogCompiledDirectory }) => {
  ... your code here
}
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