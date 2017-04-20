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

describe('conjoon.cn_treenavviewport.view.NavigationViewportIsolatedTest_2', function(t) {

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

            t.it("Should be possible to click a Tree's Menu Item and trigger routing", function(t) {
                console.warn("Adding custom hash so test processes properly");
                // browser not firing hashchange if this is not set by hand
                // might be n issue with the iframe the test runs in
                Ext.util.History.add('');

                var app = Ext.create('conjoon.cn_comp.app.Application', {
                    name        : 'check',
                    mainView    : 'conjoon.cn_treenavviewport.view.NavigationViewport',
                    controllers : [
                        'conjoon.cn_treenavviewport.app.PackageController'
                    ]
                });

                var viewport = app.getMainView(),
                    navTree  = viewport.down('cn_treenavviewport-navtree'),
                    store    = navTree.getStore();



                viewport.addPostLaunchInfo(postLaunchInfo);



                t.click(navTree.getItem(store.getAt(0)));

                t.waitForMs(500, function() {
                    Ext.util.History.add('myRoute1');
                    t.waitForMs(500, function() {
                        t.expect(navTree.getSelection()).toBe(store.getAt(1));

                    });

                });


            });

        }});



});
