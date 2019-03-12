/**
 * coon.js
 * lib-cn_navport
 * Copyright (C) 2019 Thorsten Suckow-Homberg https://github.com/coon-js/lib-cn_navport
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
 * This is the package controller of the lib-cn_navport package to be
 * used with {@link coon.comp.app.Application}.
 * This package controller is mainly responsible for proper routing of unmatched
 * routes against the application's addViewForHash() method.
 *
 * Routing:
 * ========
 * This package relies on other app-packages to take care of routing. However,
 * if no routing could take care of a specific hash, this package will try to
 * process the route by calling this application viewport's activateViewForHash()
 * as a last resort.
 * {@see coon.comp.container.NavigationViewport#activateviewForHash}
 *
 * Main View:
 * ==========
 * The package for this controller also defines a main view to be used with
 * an {@link coon.comp.app.Application}. If this main view is used,
 * a call to coon.comp.app.Application#activateViewForHash will resolve to
 * coon.navport.view.NavigationViewport#activateViewForHash.
 *
 * Default Token:
 * ==============
 * If the application has not a defaultToken set, this Controller will
 * automatically auto-generate one and apply it to the Application. This is so
 * teh application has at least one safe-heaven to return to. The implementation
 * regarding this can be found in the #processRouteFor method. Basically, if
 * this auto-generated token is used as a route, the viewport's cleanup() method
 * is called. This is so any view blocking input to the viewport is removed and
 * the user can continue working with the application.
 *
 */
Ext.define('coon.navport.app.PackageController', {

    extend : 'coon.core.app.PackageController',

    listen : {
        controller : {
            '#' : {
                unmatchedroute :  'onUnmatchedRoute'
            }
        }
    },

    /**
     * Automatically created defaultToken which gets applied to the application if
     * none was already defined.
     *
     * @type {String} autoDefaultToken
     * @private
     */
    autoDefaultToken : null,


    /**
     * @inheritdoc
     * Overriden to make sure we can apply a auto generated default token if
     * none exists
     */
    init : function(app) {
        var me = this;

        if (!app.getDefaultToken()) {
            me.autoDefaultToken = Ext.id();
            app.setDefaultToken(me.autoDefaultToken);
        }
    },


    /**
     * Callback for the controller's unmatched route handling if none other view
     * was able to process a route.
     * Makes sure an action is created and passes to #onBeforePackageRoute in
     * case the application should intercept the route.
     *
     * @see #onBeforePackageRoute
     * @see #processRouteFor
     */
    onUnmatchedRoute : function(hash) {

        var me  = this;

        me.onBeforePackageRoute({
            stop   : Ext.emptyFn,
            resume : me.processRouteFor.bind(me, hash)
        });
    },


    /**
     * Checks whether the specified hash equals to this class' autoDefaultToken
     * and calls cleanup() of this application's viewport.
     * Otherwise, this application's viewport will be called with
     * activateViewForHash(), passing the hash. This method is part of the routing
     * process for hashes which could not be routed by other controllers and
     * should not be called directly.
     *
     * @param {String} hash
     *
     * @protected
     */
    processRouteFor : function(hash) {
        var me = this;

        if (me.autoDefaultToken && hash === me.autoDefaultToken) {
            me.getApplication().getMainView().cleanup();
            return;
        }

        me.getApplication().activateViewForHash(hash);
     }

});
