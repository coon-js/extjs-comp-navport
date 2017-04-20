/**
 * conjoon
 * (c) 2007-2017 conjoon.org
 * licensing@conjoon.org
 *
 * app-cn_treenavviewport
 * Copyright (C) 2017 Thorsten Suckow-Homberg/conjoon.org
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * This is the package controller of the app-cn_treenavviewport package to be
 * used with {@link conjoon.cn_comp.app.Application}.
 * This package controller is mainly responsible for proper routing of unmatched
 * routes against the application's addViewForHash() method.
 *
 * Routing:
 * ========
 * This package relies on other app-packages to take care of routing. However,
 * if no routing could take care of a specific hash, this package will try to
 * process the route by calling this application viewport's activateViewForHash()
 * as a last resort.
 * {@see conjoon.cn_comp.container.NavigationViewport#activateviewForHash}
 *
 * Main View:
 * ==========
 * The package for this controller also defines a main view to be used with
 * an {@link conjoon.cn_comp.app.Application}. If this main view is used,
 * a call to conjoon.cn_comp.app.Application#activateViewForHash will resolve to
 * conjoon.cn_treenavviewport.view.NavigationViewport#activateViewForHash.
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
Ext.define('conjoon.cn_treenavviewport.app.PackageController', {

    extend : 'conjoon.cn_core.app.PackageController',

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
