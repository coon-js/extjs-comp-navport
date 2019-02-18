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
 * LockingWindow to display error message if a route could nt be resolved.
 *
 * see {@link coon.navport.view.NavigationViewport#showUnmatchedRouteNotification}
 */
Ext.define('coon.navport.view.pages.Page404', {

    extend : 'coon.comp.window.LockingWindow',

    mixins : [
        'coon.navport.mixin.ViewportManageable'
    ],

    alias : 'widget.cn_navport-pg404',

    cls : 'cn_navport-pg404',

    layout : {
        type  : 'vbox',
        align : 'center',
        pack  : 'center'
    },

    /**
     * The token to use as the route for redirecting to a "home" route.
     * @cfg {String} homeToken
     */
    homeToken : null,

    items: [{
        cls    : 'inner-container',
        xtype  : 'container',
        width  : 600,
        layout : {
            type  : 'vbox',
            align : 'stretch',
            pack  : 'center'
        },
        items: [{
            cls   : 'top-text',
            xtype : 'label',
            text  : '404'
        }, {
            cls   : 'descr',
            flex  : 1,
            xtype : 'label',
            data  : {
                route : undefined
            },
            tpl  : '<div>Seems like the page you\'ve requested could not be found!</div><div>Return to the <a href="#{route}"> Home page </a></div>'
        }]
    }],

    /**
     * @inheritdoc
     * Overriden to make sure we are using #homeToken for routing.
     */
    initComponent : function() {
       var me = this;

        me.items[0].items[1].data.route = me.homeToken;

        me.callParent(arguments);
    }

});