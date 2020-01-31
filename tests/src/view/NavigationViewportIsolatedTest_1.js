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

describe('coon.navport.view.NavigationViewportIsolatedTest_1', function(t) {

    var viewport,
        postLaunchInfo;

    t.beforeEach(function() {
        if (Ext.isModern) {
            Ext.viewport.Viewport.setup();
        }

        postLaunchInfo = {
            navigation : [{
                route : 'myRoute',
                text  : 'my route'
            }, {
                route : 'myRoute1',
                text  : 'my route 1'
            }]
        };
    });

    t.afterEach(function() {
        if (Ext.isModern && Ext.Viewport) {
            Ext.Viewport.destroy();
            Ext.Viewport = null;
        }
    });

    t.chain({
        requireOk : 'coon.navport.view.NavigationViewport'
    }, {
        action : function(next) {

            t.it("Should show a 404 info if the router could not process a route", function(t) {

                console.warn("Adding custom hash so test processes properly");
                // browser not firing hashchange if this is not set by hand
                // might be n issue with the iframe the test runs in
                Ext.util.History.add('');

                var app = Ext.create('coon.comp.app.Application', {
                    name : 'check',
                    mainView : 'coon.navport.view.NavigationViewport',
                    controllers : [
                        'coon.navport.app.PackageController'
                    ]
                });

                viewport = app.getMainView();
                viewport.addPostLaunchInfo(postLaunchInfo);

                var navTree = viewport.down('cn_navport-navtree'),
                    store   = navTree.getStore(),
                    pg      = null;


                pg = Ext.ComponentQuery.query('cn_navport-pg404');

                t.expect(pg).toBeTruthy();
                t.expect(pg.length).toBe(0);

                if (pg.length === 0) {
                    Ext.util.History.add('foo');

                    t.waitForMs(500, function() {
                        pg = Ext.ComponentQuery.query('cn_navport-pg404');

                        t.expect(pg).toBeTruthy();
                        t.expect(pg.length).toBe(1);

                        if (pg.length) {
                            t.expect(pg[0] instanceof coon.navport.view.pages.Page404).toBe(true);
                            pg[0].destroy();
                        }

                        app.destroy();
                        app = null;
                    });
                } else {
                    app.destroy();
                    app = null;
                }

            });



        }

    });


});
