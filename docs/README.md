## @coon-js/extjs-comp-navport Documentation

### Tutorial
This tutorial describes how to set up a [coon.js application](https://github.com/coon-js). The steps
explaining the procedure assume that you are already familiar with building Ext JS-applications, and
that you know how to use *Sencha CMD* and find your way around in the directory structure and naming
conventions used within Ext JS-applications.


### Creating an Ext JS application with the help of coon.js
A coon.js-Viewport is a UI that consist of a Tree for representing the Navigation of an Application,
a toolbar providing context-sensitive/package related navigation and a card-layouted container that holds
the (main) views of the selected navigation entry.
```
+-----------------------------------------+
|                toolbar                  |
+-----------------------------------------+
|        |                                |
|        |                                |
|  tree  |        content                 |
|        |                                |
|        |                                |
|        |                                |
+-----------------------------------------+
```
An Ext JS-application built with coon.js is capable of dynamically adding functionality by registering coon.js-packages,
which serve as modules for the application. Those packages appear in the navigation tree of the Viewport, but can also
provide less obvious functionality in the background, e.g. by mocking backends (by using Simlets) in a development
environment.

### Setting up the application
Create an Ext JS application by calling *Sencha CMD*'s ```sencha generate app``` and make sure you remove the
auto-generated code. Open up the application's `app.json` and specify the package [extjs-comp-navport](https://github.com/coon-js/extjs-comp-navport)
as a requirement for the application, e.g.
```json
    "requires": [
        "font-awesome",
        "extjs-comp-navport"
    ]
``` 
Once this is done, go the file ``Application.js`` (usually generated as universal code in the folder `[appname]/app/Application.js`
and make sure this class extends from `coon.comp.app.Application`, e.g.
```javascript
Ext.define('my.Application', {

    extend: 'coon.comp.app.Application',

    name : 'my'
});

``` 
#### Specifying the MainView for the application
Since [coon.js](https://github.com/coon-js) works with packages that provide functionality, we will not
work directly with the application layer provided by coon.js. However, we have to make sure that the application
uses the Viewport provided by  `coon.navport.view.NavigationViewport`. For this, create a view in your
application that should serve as the *MainView* for your application. This view needs to extend `coon.navport.view.NavigationViewport`, e.g.
```javascript
Ext.define('my.view.main.Viewport', {
    extend: 'coon.navport.view.NavigationViewport'
});
```
#### Registering the ManView with the application
Before we can use this specific Viewport, we need to go back to our ``Application.js`` and register this view there.
Additinally, we have to specify a ``PackageController`` which is responsible for various tasks in an application
using the [coon.js](https://github.com/coon-js) library:
```javascript
Ext.define('my.Application', {

    extend: 'coon.comp.app.Application',

    requires : [
        'my.view.main.Viewport'
    ],

    controllers : [
        'coon.navport.app.PackageController'
    ],

    name : 'my',

    applicationViewClassName : 'my.view.main.Viewport',
    
    launch : function() {
    
    }

});
```
Note how we have specified a default controller in ``controllers`` and the ``MainView`` in `mainView`.
Once this is all done, we can continue with adding packages to your application.
Also take note, that we have left the implementation of `launch` empty. We will hook into the launch-method
later on and only execute if, if all our packages return `true` in their `preLaunchHook`-methods.
You can also omit the `launch`-method since a lot of functionality regarding application-start can be
implemented in our PackageControllers.

### Adding packages
For adding a package as a module to an Ext JS-application built with [coon.js](https://github.com/coon-js), follow these steps:

#### Creating the package
Add a regular package to the application by using `sencha cmd`. In this
tutorial, we'll name the example package `acme`. Go to the command line and
type in `sencha generate package acme`.

#### Tagging the package as a dynamic resource
Once *Sencha CMD* has finished creating the package, navigate to the freshly
generated package at `packages/local/acme` and open up the the `package.json` file
for editing. We're now tagging the package as a dynamic resource that will be loaded
by the Ext JS application built with [coon.js](https://github.com/coon-js)'s.
First off, add the entry `"coon-js" : {"packageController" :  true}`  to the
`sencha`-section in the `package.json`, so that the resulting json in the file
looks like this:
```json
{
    "name": "acme",

    "sencha": {
        "coon-js" : {"packageController" :  true},
        "namespace": "acme",
        "type": "code",
        ...
```
Additionally, you have to tell this package that it needs to require the [extjs-lib-comp](https://github.com/coon-js/extjs-lib-comp)-
package from the [coon.js](https://github.com/coon-js)-project.

Hint: If you're developing packages for both the modern and classic toolkit, make sure you add
the following configuration to your `package.json`:
```json
"builds": {
    "classic": {
        "toolkit": "classic"
    },
    "modern": {
        "toolkit": "modern"
    }
}
```

#### Implementing the PackageController
Once the package was tagged as a dynamic resource for an Ext JS-application
built with [coon.js](https://github.com/coon-js), we can now actually write some
code to specify the behavior of the package itself, by adding a menu-entry that should
be displayed in our main-navigation once the package was loaded (we'll take care of
loading the package to a later point). For this purpose, we need to create a `coon.core.app.PackageController`
for this package. This kind of `Ext.app.Controller` allows for specifying various *hooks*
that get called during the startup of the application, such as a `preLaunchHook`, which allows
for cancelling the launch-process of the application (e.g. if user credentials are missing) by returning
`false` in its implemented method, or a `postLaunchHook`, which gets called once the application was
launched and exposes additional information the application should use from this package. We'll have a look
at the latter.
So, go to your newly created `acme`-package and add the following code to the file `acme/src/app/PackageController.js`:
```javascript
Ext.define('acme.app.PackageController', {

    extend : 'coon.core.app.PackageController',

    postLaunchHook : function() {
        return {
            navigation  : [{
                text   : 'Acme Module',
                route  : 'acme/home',
                view   : 'Ext.Panel',
                leaf   : true,
                nodeNav: [{
                    xtype: "button",
                    text: "action"
                }]
            }],
            permaNav :{
                index: 1000,
                items: [{
                    xtype: "button",
                    text: "permanent button"
                }]
            }
        };
    }

});
```
We have just implemented the `postLaunchHook` that gets called once the application was launched and all
controllers where initialized. The return-value of this hook is an object that contains a property
`navigation` (specified by the `coon.core.app.PackageController`'s API), which represents a node in an
`Ext.data.TreeStore`, to which it gets added automatically. The properties should be straightforward to
understand: `text` is the display-text of the menu-entry, `route` is the route under which this menu-entry
is registered (taking advance of the browser's *history*-functionality) and `view` is the FQN of the view
that should be rendered/activated as soon as this menu-entry gets selected (by either clicking it in the
resulting `Ext.list.Tree` or by calling the application's url along with the defined `route`).
However, the node has an additional `nodeNav`-entry: This entry denotes Toolbar-items that will be accessible
when the user activates its parent item in the navigation tree.<br>The `permaNav`-property, on the other hand,
will expose controls which are permanently available for the application and stay in the main toolbar, no matter what
module was activated.

##### pre-/postLaunchHook pipeline:
```
   PackageController*::preLaunchHook() : false -> void
   PackageController*::preLaunchHook() : true -> Application::launch() -> PackageController*::postLaunchHook()
```

##### Using plugins for PackageControllers
[coon.core.app.PackageController](https://github.com/coon-js/extjs-lib-core/blob/master/src/app/PackageController.js)
can have an arbitrary number of plugins of the type [coon.core.app.plugin.ControllerPlugin](https://github.com/coon-js/extjs-lib-core/blob/master/src/app/plugin/ControllerPlugin.js)
that are called by the application during the ```preLaunchHook```-process.
Please refer to [extjs-lib-core](https://github.com/coon-js/extjs-lib-core) for more information on how to use them.

##### Using plugins with the Application
Please refer to [extjs-lib-core](https://github.com/coon-js/extjs-lib-core) for more information on how to add dynamically loaded
configuration files and specifying plugins.

#### Registering the package in the application
Last but not least, we have to tell our application to actually use the package we have just created.
For this purpose, we need to open up our application's `app.json` and specify the package's name `acme` in
either the `development`- or the `production`-section - or both!
Specifying this package for development would look like this
```json
"development": {
    "uses" : ["acme"]
}
```
whereas the package being (also) used for production would look like this
```json
"production": {
    "uses" : ["acme"]
}
```
By telling our application what we are "using" - instead of requiring - this package, we simply inform the
application that a package exists that *might* get loaded later on during the application's lifetime. We
are not hardwiring the package's code into the application itself, instead, the *PackageLoader* of Ext JS is
being used (see [Mitchell Simoen's Blog entry for an explanation](https://mitchellsimoens.com/2017/04/12/package-loading/), amongst others).

You can now build your application by running `sencha app build --dev --uses` respective `sencha app build --prod --uses`.
