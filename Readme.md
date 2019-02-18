# app-cn_navport  [![Build Status](https://travis-ci.org/coon/app-cn_navport.svg?branch=master)](https://travis-ci.org/coon/app-cn_navport)
This **Sencha ExtJS** package provides an enhanced viewport template for rapid, 
modular, package agnostic Sencha ExtJS application building.

The default Viewport implementation can be found in `coon.navport.view.NavigationViewport` 
and serves as a viewport-template for Sencha ExtJS applications. Along with its configurations and
associated classes, it allows for support for routing, navigation and managing views, and lets 
you hook into modules represented by other packages by simply extending and specifying 
`coon.navport.app.PackageController`s. 

A reference implementation can be found in the [conjoon](https://github.com/conjoon) project.

## Naming
The following naming conventions apply:

#### Namespace
`coon.navport.*`
#### Package name
`app-cn_navport`
#### Shorthand to be used with providing aliases
`cn_navport`

**Example:**
Class `coon.navport.view.ContentContainer` has the alias `widget.cn_navport-conctr`

## Tests
Tests are written with [Siesta](https://bryntum.com/siesta)

# Usage
## Requirements
This package requires the [lib-cn_comp](https://github.com/coon-js/lib-cn_comp) package of the [coon.js](https://github.com/coon-js) project.
