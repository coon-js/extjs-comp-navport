/**
 * coon.js
 * extjs-comp-navport
 * Copyright (C) 2017 - 2020 Thorsten Suckow-Homberg https://github.com/coon-js/extjs-comp-navport
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
 * An {@link coon.comp.list.Tree} to provide a view for the main navigation of the
 * {@link coon.navport.view.NavigationViewport}.
 */
Ext.define("coon.navport.view.NavigationTree", {

    extend: "coon.comp.list.Tree",

    requires: [
        "coon.navport.store.NavigationTreeStore"
    ],

    alias: "widget.cn_navport-navtree",

    cls: "cn_navport-navtree",

    store: {
        type: "cn_navport-navtreestore"
    },

    expanderOnly: false,

    expanderFirst: false

});