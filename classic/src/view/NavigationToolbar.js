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
 * An {@link Ext.Toolbar} to provide a component to serve as a placeholder for
 * app informations (e.g. a logo), and a button for showing/hiding the navigation
 * of the {@link conjoon.cn_treenavviewport}, and provide space for module-related
 * (meta) navigation/information items.
 *
 * +--------------------------------+-----------------------------------+-------------+
 * | cn_treenavviewport_ref_applogo | cn_treenavviewport_ref_hidenavbtn |   [items]   |
 * +--------------------------------+-----------------------------------+-------------+
 */
Ext.define('conjoon.cn_treenavviewport.view.NavigationToolbar', {

    extend : 'Ext.Toolbar',

    alias : 'widget.cn_treenavviewport-tbar',

    cls : 'cn_treenavviewport-tbar',

    referenceHolder : true,

    items : [{
        xtype     : 'component',
        reference : 'cn_treenavviewport_ref_applogo'
    }, {
        xtype     : 'button',
        reference : 'cn_treenavviewport_ref_hidenavbtn',
        text      : 'Hide Navigation'
    }]

});