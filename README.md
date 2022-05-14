# @coon-js/extjs-comp-navport ![MIT](https://img.shields.io/npm/l/@coon-js/extjs-comp-navport) [![npm version](https://badge.fury.io/js/@coon-js%2Fextjs-comp-navport.svg)](https://badge.fury.io/js/@coon-js%2Fextjs-comp-navport)

This **Sencha ExtJS** package provides an enhanced viewport template for rapid, 
modular, package agnostic Sencha ExtJS application building.

The default Viewport implementation can be found in `coon.navport.view.NavigationViewport` 
and serves as a viewport-template for Sencha Ext JS applications. Along with its configurations and
associated classes, it allows for support for routing, navigation and managing views.

An [extjs-lib-comp](https://github.com/coon-js/extjs-lib-comp) application (`coon.comp.app.Application`) is mandatory.

A reference implementation can be found in the [conjoon](https://github.com/conjoon) project.

## Installation
```bash
$ npm install --save-dev @coon-js/extjs-comp-navport
```

If you want to develop with `extjs-comp-navport`, run the `build:dev`-script afterwards:
```bash
$ npm run build:dev
```
Testing environment will then be available via

```bash
$ npm test
```

For using the package as an external dependency in an application, use
```bash
$ npm install --save-prod @coon-js/extjs-comp-navport  
```
In your `app.json`, add this package as a requirement, and make sure your Ext JS `workspace.json`
is properly configured to look up local repositories in the `node_modules`-directory.

Example (`workspace.json`) :
```json 
{
  "packages": {
    "dir": "${workspace.dir}/node_modules/@l8js,${workspace.dir}/node_modules/@conjoon,${workspace.dir}/node_modules/@coon-js,${workspace.dir}/packages/local,${workspace.dir}/packages,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name},${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-treegrid,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-theme-base,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-theme-ios,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-theme-material,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-theme-aria,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-theme-neutral,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-theme-classic,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-theme-gray,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-theme-crisp,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-theme-crisp-touch,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-theme-neptune,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-theme-neptune-touch,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-theme-triton,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-theme-graphite,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-theme-material,${workspace.dir}/node_modules/@sencha/ext-calendar,${workspace.dir}/node_modules/@sencha/ext-charts,${workspace.dir}/node_modules/@sencha/ext-d3,${workspace.dir}/node_modules/@sencha/ext-exporter,${workspace.dir}/node_modules/@sencha/ext-pivot,${workspace.dir}/node_modules/@sencha/ext-pivot-d3,${workspace.dir}/node_modules/@sencha/ext-ux,${workspace.dir}/node_modules/@sencha/ext-font-ios",
    "extract": "${workspace.dir}/packages/remote"
  }
}
```


## Post-Install
[@coon-js/extjs-link](https://npmjs.org/coon-js/extjs-link) will start once the package was installed and guide you
through the process of creating symlinks to an existing Ext JS sdk installation.
This is only required if you want to run the tests (`./tests`), as [Siesta](https//npmjs.org/siesta-lite) relies on
an existing Ext JS installation.

The following tutorial works with either the modern or the classic toolkit.

## Usage
Refer to the [documentation](./docs) for information on how to use the package with your application.

##Dev 

### Naming
The following naming conventions apply:

#### Namespace
`coon.navport.*`
#### Package name
`extjs-comp-navport`
#### Shorthand to be used with providing aliases
`cn_navport`

**Example:**
Class `coon.navport.view.ContentContainer` has the alias `widget.cn_navport-conctr`

## Tests
Tests are written with [Siesta](https://bryntum.com/siesta). Documentation can be found [here](./tests/README.md).
