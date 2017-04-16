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
 * The View Controller for the NavigationViewport.
 *
 */
Ext.define('conjoon.cn_treenavviewport.view.controller.NavigationViewportController', {

    extend : 'Ext.app.ViewController',

    requires : [
        'conjoon.cn_treenavviewport.view.pages.Page404',
        'conjoon.cn_treenavviewport.view.NavigationToolbar'
    ],

    alias : 'controller.cn_treenavviewport-ctrl',

    /**
     * Stores the current view of the viewport.
     * @protected
     */
    currentView : null,

    listen : {
        controller : {
            '#' : {
                unmatchedroute :  'onUnmatchedRoute'
            }
        }
    },

    routes: {
        ':node': 'onRouteChange'
    },

    control : {

        'cn_treenavviewport' : {
            afterrender : {
                fn : function(viewport) {
                    var me      = this,
                        navTree = viewport.lookup('cn_treenavviewport_ref_conwrap')
                                          .lookup('cn_treenavviewport_ref_navtree');

                    navTree.on(
                        'selectionchange',
                        me.onNavigationTreeSelectionChange,
                        me
                    );
                },
                single : true
            }
        },

        /**
         * @ext-bug https://www.sencha.com/forum/showthread.php?313236-Parent-View-s-controller-fails-to-observe-Ext.list.Tree-child-component&p=1140819
         * See this class' "afterrender" listener that gets added to the viewport.
         */
        //'cn_treenavviewport-navtree' : {
        //       selectionchange : 'onNavigationTreeSelectionChange'
        // },

        'cn_treenavviewport-tbar > button[reference=cn_treenavviewport_ref_hidenavbtn]' : {
            click : 'onHideNavigationClick'
        }

    },

    /**
     * Adds a new item to this view's toolbar which is always visible, regardless
     * of the currently active package.
     *
     * @param {Object}
     *
     * @protected
     *
     * @throws error if the  toolbar with the specified reference was not found or
     * is not available or is not an instance of
     * {@link conjoon.cn_treenavviewport.view.NavigationToolbar}, if items is
     * not an array or if any item in the array is invalid
     */
    addPermaNavItem : function(item) {

        var me   = this,
            tbar = me.lookup('cn_treenavviewport_ref_tbar');

        if (!tbar || !(tbar instanceof conjoon.cn_treenavviewport.view.NavigationToolbar)) {
            Ext.raise({
                sourceClass : Ext.getClassName(this),
                item        : item,
                msg         : !tbar
                    ? Ext.getClassName(this) + "#buildPermaNavItems " +
                    "needs toolbar with reference " +
                    "cn_treenavviewport_ref_tbar to be available"
                    : Ext.getClassName(this) + "#buildPermaNavItems " +
                    "needs toolbar to be instance of " +
                    "conjoon.cn_treenavviewport.view.NavigationToolbar"
            });
        }

        if (!Ext.isObject(item) ||
            (!Ext.isString(item.xtype) && !Ext.isString(item.xclass))) {
            Ext.raise({
                sourceClass : Ext.getClassName(this),
                item        : item,
                msg         : Ext.getClassName(this) + "#buildPermaNavItems found an invalid configuration for a navigation item"
            });
        }

        tbar.add(item);
    },

    /**
     * Adds a new record to the store of {@link conjoon.cn_treenavviewport.view.NavigationTree}.
     *
     * @param {conjoon.cn_treenavviewport.model.NavigationModel} record
     *
     * @throws error if record is not an instance of {@link conjoon.cn_treenavviewport.model.NavigationModel}
     *
     * @protected
     */
    addNavigationItem : function(record) {

        var me      = this,
            view    = me.getView(),
            navTree = view.lookup('cn_treenavviewport_ref_conwrap').lookup('cn_treenavviewport_ref_navtree'),
            store   = navTree.getStore();

        store.getRootNode().appendChild(record);
    },

    /**
     * Hides the NavigationTree
     *
     * @param {Boolean} hide True to hide the NavigationTree, otherwise false.
     */
    hideNavigation : function(hide) {

        var me          = this,
            view        = me.getView(),
            contentWrap = view.lookup('cn_treenavviewport_ref_conwrap'),
            navTree     = contentWrap.lookup('cn_treenavviewport_ref_navtree');

        navTree.setHidden(hide === true);

        contentWrap.updateLayout({isRoot: true});
    },

    /**
     * Process the specified hash and tries to route it to a view.
     *
     * @param {String} hash
     *
     * @see #createViewForHash
     */
    processRouteFor : function(hash) {

        var me = this;

        me.addViewForHash(hash);
    },

    /**
     * Adds the specified view associated with the hash to the content panel of
     * the Viewport. The hash's associated view is looked up in the NavigationTree's
     * store and its collection of {@link conjoon.cn_treenavviewport.model.NavigationModel}s.
     *
     * @param {String] hash
     *
     * @return {Ext.Component} The view associated with the hash, or null
     */
    addViewForHash : function(hash) {
        var me           = this,
            conwrap      = me.lookup('cn_treenavviewport_ref_conwrap'),
            navTree      = conwrap.lookup('cn_treenavviewport_ref_navtree'),
            store        = navTree.getStore(),
            view         = me.getView(),
            contentPanel = conwrap.lookup('cn_treenavviewport_ref_conctr'),
            newView,
            node;

        hash = (hash || '').toLowerCase();

        if (hash === '' || hash === '#') {
            /**
             * Remove previously shown closable views
             */
            if (me.isCurrentViewClosable()) {
                me.closeCurrentView();
            }
            return;
        }

        node = store.findNode('route', hash, false, false, true);

        if (!node) {
            me.routeNotMatched(hash);
            return;
        }

        /**
         * Suspend events of the nav tree here so selection of the node
         * does not re-trigger the processRoute method in case this method
         * is called from outside (deeplinking)
         */
        navTree.suspendEvents();
        navTree.setSelection(node);
        navTree.resumeEvents();

        if (node.get('view')) {
            newView = contentPanel.down('component[cn_routeId=' + hash + ']');

            if (newView) {
                contentPanel.getLayout().setActiveItem(newView);
            } else {
                newView = Ext.create(node.get('view'), {
                    cn_routeId : hash
                });

                if (!(newView instanceof Ext.Window)) {
                    Ext.suspendLayouts();
                    contentPanel.getLayout().setActiveItem(contentPanel.add(newView));
                    Ext.resumeLayouts(true);
                }
            }

            if (newView.isFocusable(true)) {
                newView.focus();
            }

            me.currentView = newView;

            return newView;
        }

        return null;

    },


    /**
     * Shows a notification that the requested route was not found.
     *
     * see {@link conjoon.cn_treenavviewport.view.NavigationViewport#showUnmatchedRouteNotification}
     */
    routeNotMatched : function(hash) {

        var me   = this,
            view = me.getView();

        /**
         * Remove previously shown closable views
         */
        if (me.isCurrentViewClosable()) {
            me.closeCurrentView();
        }

        me.currentView = view.showUnmatchedRouteNotification(hash);
    },


    /**
     * Callback for this controller's routing.
     *
     * @param {String} hash
     *
     * see {@link #processrouteFor}
     */
    onRouteChange : function(hash) {
        var me = this;
        me.processRouteFor(hash)
    },


    /**
     * Callback for the controller's unmatched route handling. Tries to identify
     * the failed route for providing a fallback, resulting in a possible 404-NotFound
     * notification.
     *
     *
     * see {@link #processRouteFor}
     */
    onUnmatchedRoute : function(hash) {
        var me = this;
        me.processRouteFor(hash)
    },

    /**
     * Callback for the {@link conjoon.cn_treenavviewport.view.NavigationTree#selectionchange}
     * event. Will pass the model to {@link #redirectTo} which uses the model's
     * {@link Ext.data.Model#toUrl} method to compute the route.
     *
     * @param {conjoon.cn_treenavviewport.view.NavigationTree} tree
     * @param {conjoon.cn_treenavviewport.model.NavigationModel} node
     *
     * see {@link #redirectTo}
     * see {@link conjoon.cn_treenavviewport.model.NavigationModel#toUrl}.
     */
    onNavigationTreeSelectionChange : function(tree, node) {
        var me = this;

        me.redirectTo(node);
    },

    /**
     * Callback for the {@link conjoon.cn_treenavviewport.view.NavigationToolbar}'s
     * hideNavigation Button.
     *
     * @param {Ext.Button} btn
     *
     * see {@link #hideNavigation}
     */
    onHideNavigationClick : function(btn) {

        var me      = this,
            view    = me.getView(),
            navTree = view.lookup('cn_treenavviewport_ref_conwrap').lookup('cn_treenavviewport_ref_navtree');

        me.hideNavigation(navTree.isVisible() === true);
    },


    privates : {

        isCurrentViewClosable : function() {

            var me = this;

            return me.currentView && (me.currentView instanceof conjoon.cn_treenavviewport.view.pages.Page404);
        },


        closeCurrentView : function() {

            var me = this;

            me.currentView.close();
            me.currentView = null;
        }
    }


});
