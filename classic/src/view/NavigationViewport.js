/**
 * conjoon
 * (c) 2007-2016 conjoon.org
 * licensing@conjoon.org
 *
 * app-cn_treenavviewport
 * Copyright (C) 2016 Thorsten Suckow-Homberg/conjoon.org
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
 * This is a specialized implementation of {@link conjoon.cn_comp.container.Viewport}
 * to be used with application based upon {@link conjoon.cn_comp.app.Application}
 * and utilizing {@link conjoon.cn_core.app.PackageController}s.
 * By default, it renders a {@link conjoon.cn_treenavviewport.view.NavigationTree}
 * on the left hand side and an {@link Ext.Toolbar} on the top of the viewport,
 * leaving a content panel with an {@link Ext.layout.container.Card}-layout.
 *
 *      +-----------------------------------------+
 *      |                toolbar                  |
 *      +-----------------------------------------+
 *      |        |                                |
 *      |        |                                |
 *      |  tree  |        content                 |
 *      |        |                                |
 *      |        |                                |
 *      |        |                                |
 *      +-----------------------------------------+
 *
 * Building the main navigation:
 * =============================
 * The tree's navigation items are specified by the {@link conjoon.cn_core.app.PackageController#postLaunchHook}
 * which return values may contain objects with a "navigation" property.
 * This should be an array or a single object of {@link conjoon.cn_treenavviewport.model.NavigationModel}
 * configurations or instances.
 * If the navigation model contains a "view" property, its value will be interpreted
 * as a component to render into the ViewPorts {@link conjoon.app_treenavviewport.view.ContentContainer}.
 *
 *
 * Showing/Hiding the navigation:
 * ==============================
 * The viewport can show/hide it's navigation. The default toolbar for this
 * container {@link conjoon.cn_treenavviewport.view.NavigationToolbar} provides
 * a button for expanding/collapsing the navigation.
 *
 *      @example
 *      Ext.define('MyApp.controller.PackageController', {
 *
 *          extend : 'conjoon.cn_core.app.PackageController',
 *
 *          postLaunchHook : function() {
 *              return {
 *                  navigation : [{
 *                      route : 'example',
 *                      text  : 'ExampleNavigation',
 *                      view  : 'MyApp.view.ExampleView'
 *                  }]
 *              };
 *          }
 *
 *
 *      });
 *
 *      Ext.define('MyApp.Application', {
 *
 *          extend : 'conjoon.cn_comp.app.Application',
 *
 *          applicationViewClassName : 'conjoon.cn_treenavviewport.view.NavigationViewport',
 *
 *          controllers : [
 *              'MyApp.controller.PackageController'
 *          ]
 *
 *
 *
 *      });
 *
 *
 */
Ext.define('conjoon.cn_treenavviewport.view.NavigationViewport', {

    extend : 'conjoon.cn_comp.container.Viewport',

    alias : 'widget.cn_treenavviewport',

    requires: [
        'conjoon.cn_treenavviewport.view.NavigationToolbar',
        'conjoon.cn_treenavviewport.view.controller.NavigationViewportController',
        'conjoon.cn_treenavviewport.view.ContentWrap',
        'conjoon.cn_treenavviewport.model.NavigationModel',
        'conjoon.cn_treenavviewport.view.pages.Page404'
    ],

    referenceHolder : true,

    controller : 'cn_treenavviewport-ctrl',

    cls : 'cn_treenavviewport',

    layout: {
        type  : 'vbox',
        align : 'stretch'
    },

    items: [{
        reference : 'cn_treenavviewport_ref_tbar',
        xtype     : 'cn_treenavviewport-tbar'
    }, {
        reference : 'cn_treenavviewport_ref_conwrap',
        xtype     : 'cn_treenavviewport-conwrap',
        flex      : 1
    }],

    /**
     * Consumes a javascript native object and passes the entries found within
     * the "navigation" property to the embedded {@link conjoon.cn_treenavviewport.view.NavigationTree}'s store
     * to build the main navigation.
     * This method checks the passed argument for validity. Any invalid configuration
     * will not be considered as a navigation item.
     * If the items in "navigation" are not configured with a "leaf" property,
     * this property will automatically be set to "true".
     *
     * @inheritdoc
     *
     * @param {Object} info
     * @param {Object[]} info.navigation
     * An array with objects to be passed to the constructor of {@link conjoon.cn_treenavviewport.model.NavigationModel}
     *
     * @throws error if info.navigation is set, but is not an array, or if any entry
     * in the array is found which does not represent a valid configuration for
     * {@link conjoon.cn_treenavviewport.model.NavigationModel}
     */
    addPostLaunchInfo : function(info) {

        if (!info.hasOwnProperty('navigation')) {
            return;
        }

        var me              = this,
            nav             = info.navigation,
            navItem         = null,
            mandatoryFields = ['text', 'route'],
            manField;

        if (!Ext.isArray(info.navigation)) {
            Ext.raise({
                sourceClass       : Ext.getClassName(this),
                'info.navigation' : nav,
                msg               : Ext.getClassName(this) + "#addPostLaunchInfo needs info.navigation to be an array"
            });
        }

        for (var i = 0, len = nav.length; i < len; i++) {
            navItem = nav[i];

            for (var a = 0, lena = mandatoryFields.length; a < lena; a++) {
                manField = mandatoryFields[a];

                if (!navItem.hasOwnProperty(manField) ||
                    !navItem[manField]) {
                    Ext.raise({
                        sourceClass      : Ext.getClassName(this),
                        'navigationItem' : navItem,
                        msg              : Ext.getClassName(this) + "#addPostLaunchInfo found an invalid configuration for a navigation item"
                    });
                }
            }

            if (!navItem.hasOwnProperty('leaf')) {
                navItem.leaf = true;
            }

            me.getController().addNavigationItem(
                Ext.create('conjoon.cn_treenavviewport.model.NavigationModel', navItem)
            );
        }

    },

    /**
     * Hides the NavigationTree.
     *
     * @param {Boolean} hide True to hide the NavigationTree, otherwise false.
     *
     * see {@link conjoon.cn_treenavviewport.view.controller.NavigationViewportController#hideNavigation}
     */
    hideNavigation : function(hide) {
        this.getController().hideNavigation(hide);
    },

    /**
     * Displays an {@link conjoon.cn_treenavviewport.view.pages.404}
     * to inform the user that a requested route could not be matched against
     * an action.
     *
     * @param {String} missingHash The hash that was requested but not resolved
     *
     * @return {conjoon.cn_treenavviewport.view.pages.Page404}
     */
    showUnmatchedRouteNotification : function(missingHash) {
        return Ext.create('conjoon.cn_treenavviewport.view.pages.Page404', {
            title : Ext.String.format("\"{0}\" not found", missingHash)
        });
    },

    /**
     * @inheritdoc
     *
     * @see conjoon.cn_treenavviewport.view.controller.NavigationViewportController#addViewForHash
     */
    addViewForHash : function(hash) {
        var me = this;

        return me.getController().addViewForHash(hash);
    }

});
