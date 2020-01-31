/**
 * coon.js
 * lib-cn_navport
 * Copyright (C) 2020 Thorsten Suckow-Homberg https://github.com/coon-js/lib-cn_navport
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
 * The View Controller for the NavigationViewport.
 *
 */
Ext.define('coon.navport.view.controller.NavigationViewportController', {

    extend : 'Ext.app.ViewController',

    requires : [
        'coon.navport.view.pages.Page404',
        'coon.navport.model.NavigationModel'
    ],

    alias : 'controller.cn_navport-ctrl',

    /**
     * Stores the current view of the viewport.
     * @protected
     */
    currentView : null,

    control : {
        'cn_navport-navtree' : {
            selectionchange : 'onNavigationTreeSelectionChange'
        },

        'cn_navport-tbar > button[reference=cn_navport_ref_hidenavbtn]' : Ext.isModern ? {
            tap : 'onHideNavigationClick'
        } : {click : 'onHideNavigationClick'}

    },


    /**
     * Adds permanent navigation items to this view's NavigationToolbar.
     *
     * @param   {Array} items
     * @returns {Array} an array with the itemIds of the items that were added
     * to the toolbar
     *
     * @throws bubbles all the exceptions thrown by
     * coon.navport.view.NavigationToolbar#addPermanentNavigation
     *
     * @see coon.navport.view.NavigationToolbar#addPermanentNavigation
     */
    addPermaNavItems : function(items) {
        var me   = this,
            tbar = me.lookup('cn_navport_ref_tbar');

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
            tbar    = me.lookup('cn_navport_ref_tbar'),
            view    = me.getView(),
            navTree = view.lookup('cn_navport_ref_conwrap').lookup('cn_navport_ref_navtree'),
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
            contentWrap = view.lookup('cn_navport_ref_conwrap'),
            navTree     = contentWrap.lookup('cn_navport_ref_navtree');

        navTree.setHidden(hide === true);

        contentWrap.updateLayout({isRoot: true});
    },


    /**
     * Adds the specified view associated with the hash to the content panel of
     * the Viewport. The hash's associated view is looked up in the NavigationTree's
     * store and its collection of {@link coon.navport.model.NavigationModel}s.
     * Additionally, the NavigationToolbar is requested to show the id associated
     * navigation for the view#s associated node, if any.
     *
     * @param {String} hash
     * @param {String} defaultToken
     *
     * @return {Ext.Component} The view associated with the hash, or null
     *
     * @see coon.navport.view.NavigationToolbar#showNavigationForNode
     */
    addViewForHash : function(hash, defaultToken) {

        var me           = this,
            conwrap      = me.lookup('cn_navport_ref_conwrap'),
            navTree      = conwrap.lookup('cn_navport_ref_navtree'),
            store        = navTree.getStore(),
            view         = me.getView(),
            contentPanel = conwrap.lookup('cn_navport_ref_conctr'),
            tbar         = me.lookup('cn_navport_ref_tbar'),
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
                contentPanel.setActiveItem(newView);
            } else {
                newView = Ext.create(node.get('view'), {
                    cn_routeId : hash
                });

                if (!(newView instanceof Ext.Window)) {
                    Ext.suspendLayouts();
                    contentPanel.setActiveItem(contentPanel.add(newView));
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
     * see {@link coon.navport.view.NavigationViewport#showUnmatchedRouteNotification}
     */
    nodeNotFound : function(hash, defaultToken) {
        var me   = this,
            view = me.getView();

        me.currentView = view.showUnmatchedRouteNotification(hash, defaultToken);
    },


    /**
     * Callback for the {@link coon.navport.view.NavigationTree#selectionchange}
     * event. Will pass the model to {@link #redirectTo} which uses the model's
     * {@link Ext.data.Model#toUrl} method to compute the route.
     *
     * @param {coon.navport.view.NavigationTree} tree
     * @param {coon.navport.model.NavigationModel} node
     *
     * see {@link #redirectTo}
     * see {@link coon.navport.model.NavigationModel#toUrl}.
     */
    onNavigationTreeSelectionChange : function(tree, node) {
        const me = this;

        // Modern Toolkit will remove all items in the tree when
        // involved in a destroy()-process, sending "null"-nodes
        // to this observer. check here if that is the case
        // and exit silently
        if (node === null && me.getView().isDestroying) {
            return;
        }
        me.redirectTo(node);
    },


    /**
     * Callback for the {@link coon.navport.view.NavigationToolbar}'s
     * hideNavigation Button.
     *
     * @param {Ext.Button} btn
     *
     * see {@link #hideNavigation}
     */
    onHideNavigationClick : function(btn) {

        var me      = this,
            view    = me.getView(),
            navTree = view.lookup('cn_navport_ref_conwrap').lookup('cn_navport_ref_navtree');

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
         * Creates a coon.navport.model.NavigationModel from the
         * passed config by making sure the created model is set up properly.
         *
         * @param {Object} config
         *
         * @returns {coon.navport.model.NavigationModel}
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
                'coon.navport.model.NavigationModel', navCon
            );
        }
    }


});
