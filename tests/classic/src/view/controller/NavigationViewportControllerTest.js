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

describe('conjoon.cn_treenavviewport.view.controller.NavigationViewportControllerTest', function(t) {

    var viewportCtrl;

    t.afterEach(function() {
        if (viewportCtrl) {
            viewportCtrl.destroy();
            viewportCtrl = null;
        }
    });

    t.it("Should create the ViewportController", function(t) {
        viewportCtrl = Ext.create('conjoon.cn_treenavviewport.view.controller.NavigationViewportController');
        t.expect(viewportCtrl instanceof Ext.app.ViewController).toBe(true);

        t.expect(viewportCtrl.alias).toContain('controller.cn_treenavviewport-ctrl');
    });

    /**
     * conjoon/app-cn_treenavviewport/#2
     */
    t.it("Should test addPermaNavItem() properly", function(t) {

        viewportCtrl = Ext.create('conjoon.cn_treenavviewport.view.controller.NavigationViewportController');

        // no toolbar available
        var exc = e = undefined;
        try{viewportCtrl.addPermaNavItem({});} catch (e) {exc = e;}
        t.expect(exc).toBeDefined();
        t.expect(exc.msg).toContain("needs toolbar with reference");

        // MOCK LOOKUP() - EMPTY OBJECT
        viewportCtrl.lookup = function() {return {}};

        // toolbar not the proper type
        exc = e = undefined;
        try{viewportCtrl.addPermaNavItem({});} catch (e) {exc = e;}
        t.expect(exc).toBeDefined();
        t.expect(exc.msg).toContain("needs toolbar to be instance of");

        // MOCK LOOKUP() - EMPTY OBJECT
        // TOOLBAR
        var toolbar = Ext.create('conjoon.cn_treenavviewport.view.NavigationToolbar');
        viewportCtrl.lookup = function() {
            return toolbar;
        };

        // item falsy
        exc = e = undefined;
        try{viewportCtrl.addPermaNavItem();} catch (e) {exc = e;}
        t.expect(exc.item).not.toBeDefined();
        t.expect(exc.msg).toContain("found an invalid configuration");

        // item no xtype, no xclass
        exc = e = undefined;
        try{viewportCtrl.addPermaNavItem({});} catch (e) {exc = e;}
        t.expect(exc.item).toBeDefined();
        t.expect(exc.item.xtype).not.toBeDefined();
        t.expect(exc.item.xclass).not.toBeDefined();
        t.expect(exc.msg).toContain("found an invalid configuration");

        // item xtype a number
        exc = e = undefined;
        try{viewportCtrl.addPermaNavItem({xtype : 2});} catch (e) {exc = e;}
        t.expect(exc.item.xtype).toBeDefined();
        t.expect(exc.item.xclass).not.toBeDefined();
        t.expect(exc.msg).toContain("found an invalid configuration");

        // item xclass a number
        exc = e = undefined;
        try{viewportCtrl.addPermaNavItem({xclass : {}});} catch (e) {exc = e;}
        t.expect(exc.item.xtype).not.toBeDefined();
        t.expect(exc.item.xclass).toBeDefined();
        t.expect(exc.msg).toContain("found an invalid configuration");

        // valid
        t.expect(toolbar.down('#buttonA')).toBeFalsy();
        t.expect(toolbar.down('#buttonB')).toBeFalsy();
        viewportCtrl.addPermaNavItem({xclass : 'Ext.Button', itemId : 'buttonA'});
        t.expect(toolbar.down('#buttonA')).toBeTruthy();
        viewportCtrl.addPermaNavItem({xtype : 'button', itemId : 'buttonB'});
        t.expect(toolbar.down('#buttonB')).toBeTruthy();

        toolbar.destroy();
        toolbar = null;

    })

});
