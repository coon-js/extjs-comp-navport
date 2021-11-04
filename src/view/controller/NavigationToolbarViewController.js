/**
 * coon.js
 * extjs-comp-navport
 * Copyright (C) 2017-2021 Thorsten Suckow-Homberg https://github.com/coon-js/extjs-comp-navport
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
 * An {@link Ext.app.ViewController} to provide functionality for adding/managing
 * permanent navigation- and id-associated navigation-items in a toolbar.
 *
 *
 * @see coon.navport.view.NavigationToolbar
 */
Ext.define("coon.navport.view.controller.NavigationToolbarViewController", {

    extend: "Ext.app.ViewController",

    alias: "controller.cn_navport-navigationtoolbarviewcontroller",

    /**
     * An object keyed with node ids. The values are the itemId's of the
     * associated toolbar items which should be shown when requested.
     * @type {Object} nodeNavItemIds
     * @private
     * @see #activateNavigationForNode
     */
    nodeNavItemIds: null,

    /**
     * The currently active id for which toolbar items are shown.
     * @type {String} activeNodeId
     * @private
     */
    activeNodeId: null,

    /**
     * The insert position of the toolbar, where node navigation items should be
     * added by calling toolbar.insert()
     * @type {String} nodeNavInsertPosition
     * @private
     */
    nodeNavInsertPosition: 2,

    /**
     * The initial insert position of permanent navigation (perma nav) items
     *
     * @type {Number}
     * @private
     */
    permaNavIndex: 3,

    /**
     * Creates and adds toolbar items which are handled as permanent navigation
     * items.
     *
     * @param {Array|Object} items An array with items to add, or an object with
     * the properties "index" for the desired insert-position, and "items" with
     * the items to add. If "index" is not specified, items will get added to the end
     * of the item-list.
     *
     * @returns {Array} an array with the itemIds of the added items
     *
     * @throws bubbles exceptions from #buildToolbarItems
     *
     * @see #buildToolbarItems
     */
    buildPermaNavItems: function (items) {

        const
            me = this,
            view = me.getView();

        let passItems = items,
            index = false;

        if (items.items) {
            passItems = items.items;
            index = items.index ? items.index : false;
        }

        let maxIndex = index;
        if (index === false) {
            maxIndex = 0;
            view.items.items.forEach(
                item => maxIndex = item.cn_index  > maxIndex ? item.cn_index + 1 : maxIndex
            );

        }

        const
            createdItems = me.buildToolbarItems(passItems, false),
            itemIds      = [];

        createdItems.map(item => item.cn_index = maxIndex++);

        for (var i = 0, len = createdItems.length; i < len; i++) {
            itemIds.push(
                view.insert(
                    view.items.findInsertionIndex(createdItems[i], (item, itemNext) => {

                        if (item.cn_index < itemNext.cn_index) {
                            return -1;
                        }

                        if (item.cn_index > itemNext.cn_index) {
                            return 1;
                        }

                        return 0;
                    }),
                    createdItems[i]
                ).getItemId()
            );
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
    buildNodeNavItems: function (items, id) {

        var me           = this,
            createdItems = me.buildToolbarItems(items, true),
            view         = me.getView(),
            itemIds      = [];

        for (var i = createdItems.length - 1; i > -1; i--) {
            itemIds.push(
                view.insert(me.nodeNavInsertPosition, createdItems[i]).getItemId()
            );
            me.permaNavIndex++;
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
     * The nodeId does not necessarily have to hold a navigation. If that is not the case,
     * previous navigation will simply be set to hidden.
     *
     * @param {String} nodeId the id for which the associated items should be set
     * to be visible.
     *
     * @return {String} nodeId or null if there are no registered nodeNavItemIds
     * in this class
     *
     * @see switchItemVisibility
     */
    activateNavigationForNode: function (nodeId) {
        var me       = this,
            activeId = me.activeNodeId,
            itemIds, i, len;

        // no node navigation - exit
        if (!me.nodeNavItemIds) {
            return null;
        }

        // do nothing if nothing changes in nav
        if (nodeId === activeId) {
            return nodeId;
        }

        // set to new nodeId - its okay if not existing
        me.activeNodeId = nodeId;

        // set old hidden
        if (me.nodeNavItemIds[activeId]) {
            itemIds = me.nodeNavItemIds[activeId];
            for (i = 0, len = itemIds.length; i < len; i++) {
                me.switchItemVisibility(itemIds[i], false);
            }
        }

        // no node-navigation to show? Exit.
        if (!me.nodeNavItemIds[nodeId]) {
            return null;
        }

        // set new visible
        if (me.nodeNavItemIds[nodeId]) {
            itemIds = me.nodeNavItemIds[nodeId];
            for (i = 0, len = itemIds.length; i < len; i++) {
                me.switchItemVisibility(itemIds[i], true);
            }
        }


        return nodeId;
    },


    /**
     * Returns true if a node navigation for the specific id exists,
     * otherwise false.
     *
     * @param {String} id
     *
     * @returns {Boolean}
     */
    hasNodeNavigation: function (id) {
        return this.nodeNavItemIds && !!this.nodeNavItemIds[id];
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
    buildToolbarItems: function (items, initialHide) {

        var itemsToAdd = [],
            item, start, end;

        if (!Ext.isArray(items)) {
            Ext.raise({
                sourceClass: Ext.getClassName(this),
                items: items,
                msg: Ext.getClassName(this) + "#buildToolbarItems needs items to be an array"
            });
        }

        start  = -1;
        end    = items.length - 1;

        while (start++ < end) {

            item = items[start];

            if (!Ext.isObject(item) ||
                (!Ext.isString(item.xtype) && !Ext.isString(item.xclass))) {
                Ext.raise({
                    sourceClass: Ext.getClassName(this),
                    item: item,
                    msg: Ext.getClassName(this) + "#buildToolbarItems found an invalid configuration for an item"
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
    switchItemVisibility: function (itemId, show) {

        var me   = this,
            view = me.getView(),
            item = view.down("#" + itemId);

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
