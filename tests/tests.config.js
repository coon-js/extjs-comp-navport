/**
 * coon.js
 * extjs-comp-navport
 * Copyright (C) 2017-2021 Thorsten Suckow-Homberg https://github.com/coon-js/extjs-comp-navport
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 *
 */
export default {

    name: "extjs-comp-navport",

    timeout: 750,

    loaderPath: {

        "Ext.Package": "../node_modules/@coon-js/extjs-package-loader/packages/package-loader/src/Package.js",
        "Ext.package": "../node_modules/@coon-js/extjs-package-loader/packages/package-loader/src/package",

        "coon.test.view.mock": "./classic/src/view/mock",

        "coon.navport": "../src",
        "coon.navport.view.controller.NavigationToolbarViewController": "../src/view/controller/NavigationToolbarViewController.js",
        "coon.navport.view.controller.NavigationViewportController": "../src/view/controller/NavigationViewportController.js",
        "coon.comp.window.LockingWindow": "../node_modules/@coon-js/extjs-lib-comp/src/window/LockingWindow.js",
        "coon.comp.list.Tree": "../node_modules/@coon-js/extjs-lib-comp/src/list/Tree.js",
        "coon.navport.view": "../src/view",

        "coon.core": "../node_modules/@coon-js/extjs-lib-core/src",
        "coon.comp.app": "../node_modules/@coon-js/extjs-lib-comp/src/app",
        "coon.comp.window": "../node_modules/@coon-js/extjs-lib-comp/classic/src/window",

        modern: {
            "coon.navport.view.NavigationToolbar": "../modern/src/view/NavigationToolbar.js",
            "coon.comp.container.Viewport": "../node_modules/@coon-js/extjs-lib-comp/modern/src/container/Viewport.js"
        },

        classic: {
            "coon.navport.view.NavigationToolbar": "../classic/src/view/NavigationToolbar.js",
            "coon.comp.container.Viewport": "../node_modules/@coon-js/extjs-lib-comp/classic/src/container/Viewport.js"
        }

    },
    preload: {
        js: "../node_modules/@l8js/l8/dist/l8.runtime.umd.js"
    }
};


