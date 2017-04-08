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
 * An {@link conjoon.cn_comp.list.Tree} to provide a view for the main navigation of the
 * {@link conjoon.cn_treenavviewport.view.NavigationViewport}.
 */
Ext.define('conjoon.cn_treenavviewport.view.NavigationTree', {

    extend :  'conjoon.cn_comp.list.Tree',

    requires : [
        'conjoon.cn_treenavviewport.store.NavigationTreeStore'
    ],

    alias : 'widget.cn_treenavviewport-navtree',

    cls : 'cn_treenavviewport-navtree',

    store  : {
        type :'cn_treenavviewport-navtreestore'
    },

    expanderOnly : false,

    expanderFirst: false

});