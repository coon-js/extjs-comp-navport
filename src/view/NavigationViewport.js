/**
 * coon.js
 * lib-cn_navport
 * Copyright (C) 2017 - 2020 Thorsten Suckow-Homberg https://github.com/coon-js/lib-cn_navport
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
 * This is a specialized implementation of {@link coon.comp.container.Viewport}
 * to be used with application based upon {@link coon.comp.app.Application}
 * and utilizing {@link coon.core.app.PackageController}s.
 * By default, it renders a {@link coon.navport.view.NavigationTree}
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
 * The tree's navigation items are specified by the {@link coon.core.app.PackageController#postLaunchHook}
 * which return values may contain objects with a "navigation"-, and a
 * "permaNav"-property.
 *
 *  - "navigation" property:
 *     This should be an array with objects mapping configurations for {@link coon.navport.model.NavigationModel}
 *     If the navigation model contains a "view" property, its value will be
 *     interpreted as a component to render into the ViewPorts {@link coon.navport.view.ContentContainer}.
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
 * container {@link coon.navport.view.NavigationToolbar} provides
 * a button for expanding/collapsing the navigation.
 *
 *      @example
 *      Ext.define('MyApp.controller.PackageController', {
 *
 *          extend : 'coon.core.app.PackageController',
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
 *          extend : 'coon.comp.app.Application',
 *
 *          applicationViewClassName : 'coon.navport.view.NavigationViewport',
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
Ext.define("coon.navport.view.NavigationViewport", {

    extend : "coon.comp.container.Viewport",

    alias : "widget.cn_navport",

    requires: [
        "coon.navport.view.NavigationToolbar",
        "coon.navport.view.controller.NavigationViewportController",
        "coon.navport.view.ContentWrap",
        "coon.navport.model.NavigationModel",
        "coon.navport.view.pages.Page404"
    ],

    referenceHolder : true,

    controller : "cn_navport-ctrl",

    cls : "cn_navport",

    layout: {
        type  : "vbox",
        align : "stretch"
    },

    items: [{
        reference : "cn_navport_ref_tbar",
        xtype     : "cn_navport-tbar"
    }, {
        reference : "cn_navport_ref_conwrap",
        xtype     : "cn_navport-conwrap",
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
    addPostLaunchInfo : function (info) {

        var me = this;

        if (Object.prototype.hasOwnProperty.call(info,"navigation")) {
            me.getController().addMainNavigationItems(info.navigation);
        }

        if (Object.prototype.hasOwnProperty.call(info,"permaNav")) {
            me.getController().addPermaNavItems(info.permaNav);
        }

    },


    /**
     * Hides the NavigationTree.
     *
     * @param {Boolean} hide True to hide the NavigationTree, otherwise false.
     *
     * see {@link coon.navport.view.controller.NavigationViewportController#hideNavigation}
     */
    hideNavigation : function (hide) {
        this.getController().hideNavigation(hide);
    },


    /**
     * Displays an {@link coon.navport.view.pages.404}
     * to inform the user that a requested route could not be matched against
     * an action.
     *
     * @param {String} missingHash The hash that was requested but not resolved
     * @param {String} defaultToken A defaultToken (as defined by the application)
     * wich should be used to present the user an url-option to return to.
     * This defaultToken should be guaranteed to match an existing route
     * in the application.
     *
     * @return {coon.navport.view.pages.Page404}
     */
    showUnmatchedRouteNotification : function (missingHash, defaultToken) {

        return Ext.create("coon.navport.view.pages.Page404", {
            title     : Ext.String.format("\"{0}\" not found", missingHash),
            homeToken : defaultToken
        });
    },


    /**
     * @inheritdoc
     *
     * @see coon.navport.view.controller.NavigationViewportController#addViewForHash
     */
    activateViewForHash : function (hash, defaultToken) {
        var me = this;
        me.cleanup();
        return me.getController().addViewForHash(hash, defaultToken);
    },


    /**
     * @inheritdoc
     *
     * @see coon.navport.view.controller.NavigationViewportController#isCurrentViewClosable
     * @see coon.navport.view.controller.NavigationViewportController#ctrl.closeCurrentView();
     */
    cleanup : function () {
        var me   = this,
            ctrl = me.getController();

        if (ctrl.isCurrentViewClosable()) {
            ctrl.closeCurrentView();
        }
    }

});
