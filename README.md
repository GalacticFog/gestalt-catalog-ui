# Gestalt Catalog Ui
The Gestalt Catalog is under **heavy development**.

## Goals
* Allow you render a Ui store catalog based off of any Helm Chart based repo

## Workflow
* Compile a catalog based off of any valid Helm Chart  based repo
* Statically build a Ui 
* publish it to a location where it can be hosted (S3/Minio, etc...)

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