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
 * This container wraps bot hthe {@link conjoon.cn_treenavviewport.view.NavigationTree}
 * and {@link conjoon.cn_treenavviewport.view.ContentContainer}. Its purpose is
 * to mainly arrange and order the main navigation and the content panel and provide
 * a layout for the main elements of the viewport.
 */
Ext.define('conjoon.cn_treenavviewport.view.ContentWrap', {

    extend : 'Ext.container.Container',

    alias : 'widget.cn_treenavviewport-conwrap',

    requires: [
        'conjoon.cn_treenavviewport.view.NavigationTree',
        'conjoon.cn_treenavviewport.view.ContentContainer'
    ],

    cls : 'cn_treenavviewport-conwrap',

    referenceHolder : true,

    layout : {
        type  : 'hbox',
        align : 'stretch',

        animate       : true,
        animatePolicy : {
            x     : true,
            width : true
        }
    },

    items: [{
        reference : 'cn_treenavviewport_ref_navtree',
        xtype     : 'cn_treenavviewport-navtree',
        width     : 250
    }, {
        reference : 'cn_treenavviewport_ref_conctr',
        flex      : 1,
        xtype     : 'cn_treenavviewport-conctr'
    }]


});