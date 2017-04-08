/**
 * conjoon
 * (c) 2007-2016 conjoon.org
 * licensing@conjoon.org
 *
 * app-cn_treenavviewport
 * Copyright (C) 2016 Thorsten Suckow-Homberg/conjoon.org
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

describe('conjoon.cn_treenavviewport.view.NavigationViewportIsolatedTest_4', function(t) {

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


    t.it("Should properly process requests to empty hash", function(t) {

        var app = Ext.create('Ext.app.Application', {
            name : 'check'
        });

        viewport = Ext.create('conjoon.cn_treenavviewport.view.NavigationViewport');

        var navTree = viewport.down('cn_treenavviewport-navtree'),
            store   = navTree.getStore(),
            pg, pg2 = null;

        console.warn("Adding custom hash so test processes properly");
        // browser not firing hashchange if this is not set by hand
        // might be n issue with the iframe the test runs in
        Ext.util.History.add('');

        viewport.addPostLaunchInfo(postLaunchInfo);

        pg = Ext.ComponentQuery.query('cn_treenavviewport-pg404');
        t.expect(pg).toBeTruthy();
        t.expect(pg.length).toBe(0);

        if (pg.length === 0) {
            Ext.util.History.add('foobar');

            t.waitForMs(500, function() {
                pg = Ext.ComponentQuery.query('cn_treenavviewport-pg404');

                t.expect(pg).toBeTruthy();
                t.expect(pg.length).toBe(1);

                if (pg.length) {
                    t.expect(pg[0] instanceof conjoon.cn_treenavviewport.view.pages.Page404).toBe(true);
                }

                Ext.util.History.add('');

                t.waitForMs(500, function() {
                    pg2 = Ext.ComponentQuery.query('cn_treenavviewport-pg404');

                    t.expect(pg2).toBeTruthy();
                    t.expect(pg2.length).toBe(0);

                    Ext.util.History.add('snafu');

                    t.waitForMs(500, function() {
                        pg2 = Ext.ComponentQuery.query('cn_treenavviewport-pg404');

                        t.expect(pg2).toBeTruthy();
                        t.expect(pg2.length).toBe(1);

                        Ext.util.History.add('#');

                        t.waitForMs(500, function() {
                            pg2 = Ext.ComponentQuery.query('cn_treenavviewport-pg404');

                            t.expect(pg2).toBeTruthy();
                            t.expect(pg2.length).toBe(0);

                            app.destroy();
                            app = null;
                        });

                    });

                });
            });
        } else {
            app.destroy();
            app = null;
        }
    });




});
