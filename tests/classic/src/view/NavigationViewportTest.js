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

describe('conjoon.cn_treenavviewport.view.NavigationViewportTest', function(t) {

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


    t.afterEach(function() {
        if (viewport) {
            viewport.destroy();
            viewport = null;
        }
    });


    t.it("Should create and show Viewport", function(t) {
        viewport = Ext.create('conjoon.cn_treenavviewport.view.NavigationViewport');
        t.expect(viewport instanceof conjoon.cn_comp.container.Viewport).toBeTruthy();

        t.expect(viewport.alias).toContain('widget.cn_treenavviewport');
        t.expect(viewport.cls).toBe('cn_treenavviewport');
        t.expect(viewport.referenceHolder).toBe(true);
        t.expect(viewport.getLayout() instanceof Ext.layout.container.VBox).toBe(true);
        t.expect(viewport.getLayout().align).toBe('stretch');

    });


    t.it("Should have the ContentWrap", function(t) {
        viewport = Ext.create('conjoon.cn_treenavviewport.view.NavigationViewport');
        t.expect(viewport.lookup('cn_treenavviewport_ref_conwrap') instanceof conjoon.cn_treenavviewport.view.ContentWrap).toBe(true);
        t.expect(viewport.lookup('cn_treenavviewport_ref_conwrap').flex).toBe(1);
    });


    t.it("Should have the Toolbar", function(t) {
        viewport = Ext.create('conjoon.cn_treenavviewport.view.NavigationViewport');
        t.expect(viewport.lookup('cn_treenavviewport_ref_tbar') instanceof conjoon.cn_treenavviewport.view.NavigationToolbar).toBe(true);
    });


    t.it("Should be possible to hide the navigation", function(t) {
        viewport = Ext.create('conjoon.cn_treenavviewport.view.NavigationViewport');

        t.expect(viewport.down('cn_treenavviewport-navtree').isVisible()).toBe(true);
        viewport.hideNavigation(true);
        t.expect(viewport.down('cn_treenavviewport-navtree').isVisible()).toBe(false);
        viewport.hideNavigation(false);
        t.expect(viewport.down('cn_treenavviewport-navtree').isHidden()).toBe(false);
    });


    t.it("Should be possible to click the hideNavigation Button and hide the navigation", function(t) {
        viewport = Ext.create('conjoon.cn_treenavviewport.view.NavigationViewport');
        var btn = viewport.down('button[reference=cn_treenavviewport_ref_hidenavbtn]');

        t.expect(btn).toBeTruthy();
        t.expect(viewport.down('cn_treenavviewport-navtree').isHidden()).toBe(false);
        t.click(btn);
        t.expect(viewport.down('cn_treenavviewport-navtree').isHidden()).toBe(true);
    });


    t.it("Should be possible to call addPostLaunchInfo and populate the NavigationTree", function(t) {
        viewport = Ext.create('conjoon.cn_treenavviewport.view.NavigationViewport');

        var store = viewport.down('cn_treenavviewport-navtree').getStore();

        t.expect(store.getRange().length).toBe(0);
        t.expect(store.getRootNode().childNodes.length).toBe(0);

        viewport.addPostLaunchInfo(postLaunchInfo);

        t.expect(store.getRange().length).toBe(2);
        t.expect(store.getRootNode().childNodes.length).toBe(2);
    });


    t.it("Should process showUnmatchedRouteNotification properly", function(t) {
        viewport = Ext.create('conjoon.cn_treenavviewport.view.NavigationViewport');

        var w = viewport.showUnmatchedRouteNotification('somehash');

        t.expect(w instanceof conjoon.cn_comp.window.LockingWindow).toBe(true);

        w.destroy();
        w = null;
    });

    t.it("Should addViewForHash properly", function(t) {

        viewport = Ext.create('conjoon.cn_treenavviewport.view.NavigationViewport');

        viewport.addPostLaunchInfo({
            navigation : [{
                text  : 'Text',
                route : 'testroute',
                view  : 'Ext.Panel'
            }]
        });

        var w = viewport.addViewForHash('somehash');

        t.expect(w).toBeFalsy();

        w = viewport.addViewForHash('testroute');

        t.expect(w instanceof Ext.Panel).toBe(true);

        var v = viewport.addViewForHash('testroute');

        t.expect(w).toBe(v);

        w.destroy();
        v = null;
        w = null;

    });

    /**
     * conjoon/app-cn_treenavviewport/#2
     */
    t.it("Should test addPostLaunchInfo() with permaNav properly", function(t) {

        viewport = Ext.create('conjoon.cn_treenavviewport.view.NavigationViewport');

        t.expect(viewport.down('cn_treenavviewport-tbar').down('#buttonA')).toBeFalsy();
        t.expect(viewport.down('cn_treenavviewport-tbar').down('#buttonB')).toBeFalsy();
        viewport.addPostLaunchInfo({
            permaNav : [{
                xtype  : 'button',
                itemId : 'buttonA'
            }, {
                xtype  : 'button',
                itemId : 'buttonB'
            }]
        });
        t.expect(viewport.down('cn_treenavviewport-tbar').down('#buttonA')).toBeTruthy();
        t.expect(viewport.down('cn_treenavviewport-tbar').down('#buttonB')).toBeTruthy();

    });


    /**
     * conjoon/app-cn_treenavviewport/#2
     */
    t.it("Should test addPostLaunchInfo() with nodeNav properly", function(t) {

        viewport = Ext.create('conjoon.cn_treenavviewport.view.NavigationViewport');

        t.expect(viewport.down('cn_treenavviewport-tbar').down('#buttonA')).toBeFalsy();
        t.expect(viewport.down('cn_treenavviewport-tbar').down('#buttonB')).toBeFalsy();
        viewport.addPostLaunchInfo({
            navigation : [{
                route : 'route',
                text  : 'text',
                nodeNav : [{
                    xtype  : 'button',
                    itemId : 'buttonA'
                }, {
                    xtype  : 'button',
                    itemId : 'buttonB'
                }]
            }]
        });
        t.expect(viewport.down('cn_treenavviewport-tbar').down('#buttonA')).toBeTruthy();
        t.expect(viewport.down('cn_treenavviewport-tbar').down('#buttonB')).toBeTruthy();

    });
});
