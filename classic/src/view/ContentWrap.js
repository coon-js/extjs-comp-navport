/**
 * coon.js
 * app-cn_navport
 * Copyright (C) 2019 Thorsten Suckow-Homberg https://github.com/coon-js/app-cn_navport
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
 * This container wraps bot hthe {@link coon.navport.view.NavigationTree}
 * and {@link coon.navport.view.ContentContainer}. Its purpose is
 * to mainly arrange and order the main navigation and the content panel and provide
 * a layout for the main elements of the viewport.
 */
Ext.define('coon.navport.view.ContentWrap', {

    extend : 'Ext.container.Container',

    alias : 'widget.cn_navport-conwrap',

    requires: [
        'coon.navport.view.NavigationTree',
        'coon.navport.view.ContentContainer'
    ],

    cls : 'cn_navport-conwrap',

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
        reference : 'cn_navport_ref_navtree',
        xtype     : 'cn_navport-navtree',
        width     : 250
    }, {
        reference : 'cn_navport_ref_conctr',
        flex      : 1,
        xtype     : 'cn_navport-conctr'
    }]


});