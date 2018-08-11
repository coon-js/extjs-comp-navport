/**
 * conjoon
 * (c) 2007-2018 conjoon.org
 * licensing@conjoon.org
 *
 * app-cn_treenavviewport
 * Copyright (C) 2018 Thorsten Suckow-Homberg/conjoon.org
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
 * An {@link Ext.app.ViewController} to provide functionality for adding/managing
 * permanent navigation- and id-associated navigation-items in a toolbar.
 *
 *
 * @see conjoon.cn_treenavviewport.view.NavigationToolbar
 */
Ext.define('conjoon.cn_treenavviewport.view.controller.NavigationToolbarViewController', {

    extend : 'Ext.app.ViewController',

    alias : 'controller.cn_treenavviewport-navigationtoolbarviewcontroller',

    /**
     * An object keyed with node ids. The values are the itemId's of the
     * associated toolbar items which should be shown when requested.
     * @type {Object} nodeNavItemIds
     * @private
     * @see #activateNavigationForNode
     */
    nodeNavItemIds : null,

    /**
     * The currently active id for which toolbar items are shown.
     * @type {String} activeNodeId
     * @private
     */
    activeNodeId : null,

    /**
     * The insert position of the toolbar, where node navigation items should be
     * added by calling toolbar.insert()
     * @type {String} nodeNavInsertPosition
     * @private
     */
    nodeNavInsertPosition : 2,


    /**
     * Creates and adds toolbar items which are handled as permanent navigation
     * items.
     *
     * @param {Array} items
     *
     * @returns {Array} an array with the itemIds of the added items
     *
     * @throws bubbles exceptions from #buildToolbarItems
     *
     * @see #buildToolbarItems
     */
    buildPermaNavItems : function(items) {
        var me = this,
            createdItems = me.buildToolbarItems(items, false),
            view         = me.getView(),
            itemIds      = [];

        for (var i = 0, len = createdItems.length; i < len; i++) {
            itemIds.push(view.add(createdItems[i]).getItemId());
        }

        return itemIds;
    },


    /**
     * Creates and adds toolbar items which are handled as navigation items
     * belonging to a specific id. Belonging items can be set active by calling
     * #activateNavigationForNode.
     *
     * @param {Array} items
     *
     * @returns {Array} an array with the itemIds of the added items
     *
     * @throws bubbles exceptions from #buildToolbarItems
     *
     * @see #buildToolbarItems
     * @see #activateNavigationForNode
     */
    buildNodeNavItems : function(items, id) {

        var me           = this,
            createdItems = me.buildToolbarItems(items, true),
            view         = me.getView(),
            itemIds      = [];

        for (var i = createdItems.length - 1; i > -1; i--) {
            itemIds.push(
                view.insert(me.nodeNavInsertPosition, createdItems[i]).getItemId()
            );
        }

        if (!me.nodeNavItemIds) {
            me.nodeNavItemIds = {};
        }

        me.nodeNavItemIds[id] = itemIds;

        return itemIds.reverse();
    },


    /**
     * Makes sure that items associated with the specified id are switched to
     * hidden=false. If the property cn_hidden is found in an item, and it's
     * value is set to true, it is assumed that this controller should not
     * manage the visibility state of this item, and leave it be.
     * Items associated with an existing activeNodeId will be set to be hidden.
     * activeNodeId will be set to the new id.
     *
     * @param {String} nodeId the id for which the associated items should be set
     * to be visible.
     *
     * @return {String} nodeId or null if there are no registered nodeNavItemIds
     * in this class/if nodeNavItemIds has no property "nodeId"
     *
     * @see switchItemVisibility
     */
    activateNavigationForNode : function(nodeId) {
        var me       = this,
            activeId = me.activeNodeId,
            itemIds;

        if (!me.nodeNavItemIds || !me.nodeNavItemIds.hasOwnProperty(nodeId)) {
            return null;
        }

        if (nodeId === activeId) {
            return nodeId;
        }

        // set old hidden
        if (me.nodeNavItemIds[activeId]) {
            itemIds = me.nodeNavItemIds[activeId];
            for (var i = 0, len = itemIds.length; i < len; i++) {
                me.switchItemVisibility(itemIds[i], false);
            }
        }

        // set new visible
        if (me.nodeNavItemIds[nodeId]) {
            itemIds = me.nodeNavItemIds[nodeId];
            for (var i = 0, len = itemIds.length; i < len; i++) {
                me.switchItemVisibility(itemIds[i], true)
            }
        }

        me.activeNodeId = nodeId;

        return nodeId;
    },


    /**
     * Adds new items this controller's toolbar. This method will check the entries
     * in items for validity, and also apply itemId's if not already specified
     * in the items' entries. Additionally, a flag "cn_hidden" will be set
     * with the original state of "hidden" when this method was called
     * with initalHide=true. This is so a further call to activation of this items
     * (treated as id-associated navigation) does not accidentally set them to
     * visible if they where initially set to be hidden.
     *
     * @param {Array}   items
     * @param {Boolean} initialHide Whether the item should be initially set
     * to be hidden. This should be "true" for calls from #buildNodeNavItems.
     * The cn_hidden flag will be automatically applied to the item entries with
     * the original value.
     *
     * @protected
     *
     * @throws if items is not an array or entries of the array where misconfigured.
     */
    buildToolbarItems : function(items, initialHide) {

        var me         = this,
            itemsToAdd = [],
            item, start, end;

        if (!Ext.isArray(items)) {
            Ext.raise({
                sourceClass : Ext.getClassName(this),
                items       : items,
                msg         : Ext.getClassName(this) + "#buildToolbarItems needs items to be an array"
            });
        }

        start  = -1;
        end    = items.length - 1;

        while (start++ < end) {

            item = items[start];

            if (!Ext.isObject(item) ||
                (!Ext.isString(item.xtype) && !Ext.isString(item.xclass))) {
                Ext.raise({
                    sourceClass : Ext.getClassName(this),
                    item        : item,
                    msg         : Ext.getClassName(this) + "#buildToolbarItems found an invalid configuration for an item"
                });
            }

            if (!item.itemId) {
                item.itemId = Ext.id();
            }

            if (initialHide) {
                item.cn_hidden = item.hidden;
                item.hidden = true;
            }

            itemsToAdd.push(item);
        }

        return itemsToAdd;

    },


    /**
     * Switches the visibility of the item specified with the itemId to either
     * true or false. Makes sure the cn_hidden property of the item is considered
     * when switching the items visibility to "visible".
     *
     * @param {String}  itemId
     * @param {Boolean} show
     *
     * @return {Boolean} true if the item was set to visible, otherwise false
     * @private
     */
    switchItemVisibility : function(itemId, show) {

        var me   = this,
            view = me.getView(),
            item = view.down('#' + itemId);

        if (show) {
            if (!item.cn_hidden) {
                item.suspendEvents();
                item.setHidden(false);
                item.resumeEvents();
                return true;
            }
        } else {
            item.cn_hidden = item.isHidden();
            item.suspendEvents();
            item.setHidden(true);
            item.resumeEvents();
        }

        return false;
    }



});