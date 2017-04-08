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
 * LockingWindow to display error message if a route could nt be resolved.
 *
 * see {@link conjoon.cn_treenavviewport.view.NavigationViewport#showUnmatchedRouteNotification}
 */
Ext.define('conjoon.cn_treenavviewport.view.pages.Page404', {

    extend : 'conjoon.cn_comp.window.LockingWindow',

    alias : 'widget.cn_treenavviewport-pg404',

    cls : 'cn_treenavviewport-pg404',

    layout : {
        type  : 'vbox',
        align : 'center',
        pack  : 'center'
    },

    items: [{
        xtype  : 'container',
        width  : 400,
        layout : {
            type  : 'vbox',
            align : 'center',
            pack  : 'center'
        },
        items: [{
            xtype : 'label',
            text  : '404'
        }, {
            xtype : 'label',
            html  : '<div>Seems you\'ve hit a wall!</div><div>Try going back to our <a href="#"> Home page </a></div>'
        },
        {
            xtype : 'tbspacer',
            flex  : 1
        }]
    }]

});