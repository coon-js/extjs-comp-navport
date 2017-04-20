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
 * LockingWindow to display error message if a route could nt be resolved.
 *
 * see {@link conjoon.cn_treenavviewport.view.NavigationViewport#showUnmatchedRouteNotification}
 */
Ext.define('conjoon.cn_treenavviewport.view.pages.Page404', {

    extend : 'conjoon.cn_comp.window.LockingWindow',

    mixins : [
        'conjoon.cn_treenavviewport.mixin.ViewportManageable'
    ],

    alias : 'widget.cn_treenavviewport-pg404',

    cls : 'cn_treenavviewport-pg404',

    layout : {
        type  : 'vbox',
        align : 'center',
        pack  : 'center'
    },

    /**
     * The token to use as the route for redirecting to a "home" route.
     * @cfg {String} homeToken
     */
    homeToken : null,

    items: [{
        cls    : 'inner-container',
        xtype  : 'container',
        width  : 600,
        layout : {
            type  : 'vbox',
            align : 'stretch',
            pack  : 'center'
        },
        items: [{
            cls   : 'top-text',
            xtype : 'label',
            text  : '404'
        }, {
            cls   : 'descr',
            flex  : 1,
            xtype : 'label',
            data  : {
                route : undefined
            },
            tpl  : '<div>Seems like the page you\'ve requested could not be found!</div><div>Return to the <a href="#{route}"> Home page </a></div>'
        }]
    }],

    /**
     * @inheritdoc
     * Overriden to make sure we are using #homeToken for routing.
     */
    initComponent : function() {
       var me = this;

        me.items[0].items[1].data.route = me.homeToken;

        me.callParent(arguments);
    }

});