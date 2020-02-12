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
 * An {@link Ext.Toolbar} to provide a component to serve as a placeholder for
 * app informations (e.g. a logo), and a button for showing/hiding the navigation
 * of the {@link coon.navport}, and provide space for module-related
 * (meta) navigation/information items, such as node navigation and permanent navigation.
 *
 * +--------------------------------------------------------------------------------+
 * | logo | hidenavbtn |  [node navigation items]   | [permanent navigation items]
 * +--------------------------------------------------------------------------------+
 *
 * @bug
 * This class is an abstract base class since the version for the modern toolkit needs
 * to require the HBox-layout. This is not required by the Toolbar base class in
 * the Modern Toolkit by default.
 */
Ext.define('coon.navport.view.AbstractNavigationToolbar', {

    extend : 'Ext.Toolbar',

    requires : [
        "coon.navport.view.controller.NavigationToolbarViewController"
    ],

    alias : 'widget.cn_navport-tbar',

    cls : 'cn_navport-tbar',

    controller : 'cn_navport-navigationtoolbarviewcontroller',

    items : [{
        xtype     : 'component',
        reference : 'cn_navport_ref_applogo'
    }, {
        margin    : '0 0 0 8',
        xtype     : 'button',
        reference : 'cn_navport_ref_hidenavbtn',
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
     * @throws bubbles the exceptions of {@link coon.navport.view.controller.NavigationToolbarViewController#buildPermaNavItems}
     *
     * @see coon.navport.view.controller.NavigationToolbarViewController#buildPermaNavItems
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
     * @throws bubbles the exceptions of {@link coon.navport.view.controller.NavigationToolbarViewController#buildNodeNavItems}
     *
     * @see coon.navport.view.controller.NavigationToolbarViewController#buildNodeNavItems
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
     * @see coon.navport.view.controller.NavigationToolbarViewController#activateNodeNavFor
     * @see #showNavigationForNode
     */
    showNavigationForNode : function(id) {
        var me = this;
        me.getController().activateNavigationForNode(id);
    }

});