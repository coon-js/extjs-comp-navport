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
 * (meta) navigation/information items, such as node navigation and permanent navigation.
 *
 * +--------------------------------------------------------------------------------+
 * | logo | hidenavbtn |  [node navigation items]   | [permanent navigation items]
 * +--------------------------------------------------------------------------------+
 */
Ext.define('conjoon.cn_treenavviewport.view.NavigationToolbar', {

    extend : 'Ext.Toolbar',

    requires : [
        'conjoon.cn_treenavviewport.view.controller.NavigationToolbarViewController'
    ],

    alias : 'widget.cn_treenavviewport-tbar',

    cls : 'cn_treenavviewport-tbar',

    controller : 'cn_treenavviewport-navigationtoolbarviewcontroller',

    items : [{
        xtype     : 'component',
        reference : 'cn_treenavviewport_ref_applogo'
    }, {
        margin    : '0 0 0 8',
        xtype     : 'button',
        reference : 'cn_treenavviewport_ref_hidenavbtn',
        text      : 'Hide Navigation',
        tooltip  : {
            title : 'Show / hide navigation',
            text  : 'Adjusts visibility of the main navigation.'
        }
    }, '->'],


    /**
     * Adds the items as permanent navigation items to this toolbar.
     *
     * @param {Array} items
     *
     * @return {Array} An array with the itemIds of the added items.
     *
     * @throws bubbles the exceptions of {@link conjoon.cn_treenavviewport.view.controller.NavigationToolbarViewController#buildPermaNavItems}
     *
     * @see conjoon.cn_treenavviewport.view.controller.NavigationToolbarViewController#buildPermaNavItems
     */
    addPermanentNavigation : function(items) {
        var me = this;

        return me.getController().buildPermaNavItems(items);
    },


    /**
     * Adds the items as id-associated navigation items to this toolbar.
     * Associated items can be shown by calling #showNavigationForNode
     *
     * @param {Array}  items
     * @param {String} id the id associated with this items.
     *
     * @return {Array} An array with the itemIds of the added items.
     *
     * @throws bubbles the exceptions of {@link conjoon.cn_treenavviewport.view.controller.NavigationToolbarViewController#buildNodeNavItems}
     *
     * @see conjoon.cn_treenavviewport.view.controller.NavigationToolbarViewController#buildNodeNavItems
     * @see #showNavigationForNode
     */
    addNodeNavigation : function(items, id) {
        var me = this;
        return me.getController().buildNodeNavItems(items, id);
    },


    /**
     * Shows the items associated with the specified id. Any previously shown
     * items will be hidden.
     *
     * @param {Array}  items
     * @param {String} id the id associated with this items.
     *
     * @return {Array} An array with the itemIds of the added items.
     *
     *
     * @see conjoon.cn_treenavviewport.view.controller.NavigationToolbarViewController#activateNodeNavFor
     * @see #showNavigationForNode
     */
    showNavigationForNode : function(id) {
        var me = this;
        me.getController().activateNavigationForNode(id);
    }

});