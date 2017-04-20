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
 * which return values may contain objects with a "navigation"-, and a
 * "permaNav"-property.
 *
 *  - "navigation" property:
 *     This should be an array with objects mapping configurations for {@link conjoon.cn_treenavviewport.model.NavigationModel}
 *     If the navigation model contains a "view" property, its value will be
 *     interpreted as a component to render into the ViewPorts {@link conjoon.app_treenavviewport.view.ContentContainer}.
 *     - "nodeNav" property
 *       Each entry in "navigation" might have a "nodeNav" property, holding an
 *       array of configurations for toolbar items. These items will be displayed
 *       depending on the activity of their parent node; i.e. if the parent node
 *       is currently selected in the navigation, these items will be set visible
 *       in the embedded NavigationToolbar. *
 *  - "permaNav" property:
 *     This should be an array of items which will be added to the right side
 *     of the toolbar and stay visible all the time, regardless of the currently
 *     active main view.
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
 *                      nodeNav : [{
 *                          xtype : 'button',
 *                          text  : 'Package Button'
 *                      }]
 *                  }],
 *                  permaNav : [{
 *                      xtype : 'button',
 *                      text  : 'permaNav Button'
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
     * to the #buildNavigationItems ans #buildNavItems
     *
     * @inheritdoc
     *
     * @param {Object} info
     *
     * @throws bubbles the ecxeptions od #buildNavigationItems and
     * #buildPermaNavItems
     */
    addPostLaunchInfo : function(info) {

        var me = this;

        if (info.hasOwnProperty('navigation')) {
            me.getController().addMainNavigationItems(info.navigation);
        }

        if (info.hasOwnProperty('permaNav')) {
            me.getController().addPermaNavItems(info.permaNav);
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
     * @param {String} defaultToken A defaultToken (as defined by the application)
     * wich should be used to present the user an url-option to return to.
     * This defaultToken should be guaranteed to match an existing route
     * in the application.
     *
     * @return {conjoon.cn_treenavviewport.view.pages.Page404}
     */
    showUnmatchedRouteNotification : function(missingHash, defaultToken) {
        var me = this;

        return Ext.create('conjoon.cn_treenavviewport.view.pages.Page404', {
            title     : Ext.String.format("\"{0}\" not found", missingHash),
            homeToken : defaultToken
        });
    },


    /**
     * @inheritdoc
     *
     * @see conjoon.cn_treenavviewport.view.controller.NavigationViewportController#addViewForHash
     */
    activateViewForHash : function(hash, defaultToken) {
        var me = this;
        me.cleanup();
        return me.getController().addViewForHash(hash, defaultToken);
    },

    /**
     * @inheritdoc
     *
     * @see conjoon.cn_treenavviewport.view.controller.NavigationViewportController#isCurrentViewClosable
     * @see conjoon.cn_treenavviewport.view.controller.NavigationViewportController#ctrl.closeCurrentView();
     */
    cleanup : function() {
        var me   = this,
            ctrl = me.getController();

        if (ctrl.isCurrentViewClosable()) {
            ctrl.closeCurrentView();
        }
    }

});
