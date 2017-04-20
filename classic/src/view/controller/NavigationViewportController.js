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
        'conjoon.cn_treenavviewport.model.NavigationModel'
    ],

    alias : 'controller.cn_treenavviewport-ctrl',

    /**
     * Stores the current view of the viewport.
     * @protected
     */
    currentView : null,

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
     * Adds permanent navigation items to this view's NavigationToolbar.
     *
     * @param   {Array} items
     * @returns {Array} an array with the itemIds of the items that were added
     * to the toolbar
     *
     * @throws bubbles all the exceptions thrown by
     * conjoon.cn_treenavviewport.view.NavigationToolbar#addPermanentNavigation
     *
     * @see conjoon.cn_treenavviewport.view.NavigationToolbar#addPermanentNavigation
     */
    addPermaNavItems : function(items) {
        var me   = this,
            tbar = me.lookup('cn_treenavviewport_ref_tbar');

        return tbar.addPermanentNavigation(items);
    },


    /**
     * Creates the main navigation from the passes array and will consider the
     * "nodeNav" entries to properly build up the node id associated navigation
     * for the nodes.
     *
     * @param {Array} items
     *
     * @throws bubbles the exeptions from the referenced methods
     *
     * @see #createNavigationModelFrom
     */
    addMainNavigationItems : function(items) {

        var me      = this,
            navItem = null,
            tbar    = me.lookup('cn_treenavviewport_ref_tbar'),
            view    = me.getView(),
            navTree = view.lookup('cn_treenavviewport_ref_conwrap').lookup('cn_treenavviewport_ref_navtree'),
            store   = navTree.getStore(),
            navigationModel;

        if (!Ext.isArray(items)) {
            Ext.raise({
                sourceClass : Ext.getClassName(this),
                items       : nav,
                msg         : Ext.getClassName(this) + "#addNavigationItems needs items to be an array"
            });
        }

        for (var i = 0, len = items.length; i < len; i++) {
            navItem = items[i];
            navigationModel = me.createNavigationModelFrom(navItem);
            if (navItem.nodeNav) {
                tbar.addNodeNavigation(navItem.nodeNav, navigationModel.getId());
            }

            store.getRootNode().appendChild(navigationModel);
        }
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
     * Adds the specified view associated with the hash to the content panel of
     * the Viewport. The hash's associated view is looked up in the NavigationTree's
     * store and its collection of {@link conjoon.cn_treenavviewport.model.NavigationModel}s.
     * Additionally, the NavigationToolbar is requested to show the id associated
     * navigation for the view#s associated node, if any.
     *
     * @param {String} hash
     * @param {String} defaultToken
     *
     * @return {Ext.Component} The view associated with the hash, or null
     *
     * @see conjoon.cn_treenavviewport.view.NavigationToolbar#showNavigationForNode
     */
    addViewForHash : function(hash, defaultToken) {

        var me           = this,
            conwrap      = me.lookup('cn_treenavviewport_ref_conwrap'),
            navTree      = conwrap.lookup('cn_treenavviewport_ref_navtree'),
            store        = navTree.getStore(),
            view         = me.getView(),
            contentPanel = conwrap.lookup('cn_treenavviewport_ref_conctr'),
            tbar         = me.lookup('cn_treenavviewport_ref_tbar'),
            newView,
            node;

        hash = (hash || '').toLowerCase();

        if (hash == '') {
            return null;
        }

        node = store.findBy(function(record) {
            var route = (record.get('route') || '').toLowerCase();
            if (route === hash) {
                return true;
            }
        });

        if (node === -1) {
            me.nodeNotFound(hash, defaultToken);
            return;
        }

        node = store.getAt(node);

        /**
         * Suspend events of the nav tree here so selection of the node
         * does not re-trigger the processRoute method in case this method
         * is called from outside (deeplinking)
         */
        navTree.suspendEvents();
        navTree.setSelection(node);
        navTree.resumeEvents();
        tbar.showNavigationForNode(node.getId());

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
     * Shows a notification that the node for the requested route was not found.
     *
     * @param {String} hash The has that could not be matched
     * @param{String} defaultToken a token that can be used to privde a working url
     * to return to
     *
     * see {@link conjoon.cn_treenavviewport.view.NavigationViewport#showUnmatchedRouteNotification}
     */
    nodeNotFound : function(hash, defaultToken) {
        var me   = this,
            view = me.getView();

        me.currentView = view.showUnmatchedRouteNotification(hash, defaultToken);
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

            if (me.currentView && (Ext.isFunction(me.currentView.canNavigationViewportCloseView))) {
                return me.currentView.canNavigationViewportCloseView();
            }

            return false
        },


        closeCurrentView : function() {

            var me = this;

            me.currentView.close();
            me.currentView = null;
        },


        /**
         * Creates a conjoon.cn_treenavviewport.model.NavigationModel from the
         * passed config by making sure the created model is set up properly.
         *
         * @param {Object} config
         *
         * @returns {conjoon.cn_treenavviewport.model.NavigationModel}
         *
         * @throws if the configuration was not valid
         */
        createNavigationModelFrom : function(config) {

            var me = this,
                mandatoryFields = ['text', 'route'],
                manField, navCon;

            for (var a = 0, lena = mandatoryFields.length; a < lena; a++) {
                manField = mandatoryFields[a];

                if (!config.hasOwnProperty(manField) ||
                    !config[manField]) {
                    Ext.raise({
                        sourceClass : Ext.getClassName(this),
                        config      : config,
                        msg         : Ext.getClassName(this) + "#createNavigationModelFrom found an invalid configuration for a navigation item"
                    });
                }
            }

            if (!config.hasOwnProperty('leaf')) {
                config.leaf = true;
            }

            navCon = Ext.copy({}, config, 'leaf,route,view,id,text,iconCls');

            return Ext.create(
                'conjoon.cn_treenavviewport.model.NavigationModel', navCon
            );
        }
    }


});
