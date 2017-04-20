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

describe('conjoon.cn_treenavviewport.view.NavigationViewportIsolatedTest_1', function(t) {

    var viewport,
        postLaunchInfo;

    t.beforeEach(function() {
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


    t.chain({
        requireOk : 'conjoon.cn_treenavviewport.view.NavigationViewport'
    }, {
        action : function(next) {

            t.it("Should show a 404 info if the router could not process a route", function(t) {

                console.warn("Adding custom hash so test processes properly");
                // browser not firing hashchange if this is not set by hand
                // might be n issue with the iframe the test runs in
                Ext.util.History.add('');

                var app = Ext.create('conjoon.cn_comp.app.Application', {
                    name : 'check',
                    mainView : 'conjoon.cn_treenavviewport.view.NavigationViewport',
                    controllers : [
                        'conjoon.cn_treenavviewport.app.PackageController'
                    ]
                });

                viewport = app.getMainView();
                viewport.addPostLaunchInfo(postLaunchInfo);

                var navTree = viewport.down('cn_treenavviewport-navtree'),
                    store   = navTree.getStore(),
                    pg      = null;


                pg = Ext.ComponentQuery.query('cn_treenavviewport-pg404');

                t.expect(pg).toBeTruthy();
                t.expect(pg.length).toBe(0);

                if (pg.length === 0) {
                    Ext.util.History.add('foo');

                    t.waitForMs(500, function() {
                        pg = Ext.ComponentQuery.query('cn_treenavviewport-pg404');

                        t.expect(pg).toBeTruthy();
                        t.expect(pg.length).toBe(1);

                        if (pg.length) {
                            t.expect(pg[0] instanceof conjoon.cn_treenavviewport.view.pages.Page404).toBe(true);
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
