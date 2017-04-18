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

        // MOCK LOOKUP() - EMPTY OBJECT
        // TOOLBAR
        var toolbar = Ext.create('conjoon.cn_treenavviewport.view.NavigationToolbar');
        viewportCtrl.lookup = function() {
            return toolbar;
        };

        var res = viewportCtrl.addPermaNavItems([{xtype : 'button', itemId : 'foo'}]);
        t.expect(res[0]).toBe('foo');
        toolbar.destroy();
        toolbar = null;
    });


    t.describe('createNavigationModelFrom()', function(t) {

        var exc, e, rec;

        viewportCtrl = Ext.create(
            'conjoon.cn_treenavviewport.view.controller.NavigationViewportController'
        );

        exc, e = undefined;
        try{viewportCtrl.createNavigationModelFrom(
            {}
        );}catch(e){exc = e};
        t.expect(exc.msg).toContain('invalid configuration');

        exc, e = undefined;
        try{viewportCtrl.createNavigationModelFrom(
            {text : 'text'}
        );}catch(e){exc = e};
        t.expect(exc.msg).toContain('invalid configuration');

        exc, e = undefined;
        try{viewportCtrl.createNavigationModelFrom(
            {route : 'route'}
        );}catch(e){exc = e};
        t.expect(exc.msg).toContain('invalid configuration');

        rec = viewportCtrl.createNavigationModelFrom(
            {id : 'a', text : 'text', route : 'route', nodeNav : {},
                view : 'myView', iconCls : 'myIconCls'}
        );

        t.isInstanceOf(rec, 'conjoon.cn_treenavviewport.model.NavigationModel');

        t.isStrict(rec.getId(),        'a');
        t.isStrict(rec.get('leaf'),    true);
        t.isStrict(rec.get('text'),    'text');
        t.isStrict(rec.get('route'),   'route');
        t.isStrict(rec.get('view'),    'myView');
        t.isStrict(rec.get('iconCls'), 'myIconCls');
        t.expect(rec.get('nodeNav')).toBeUndefined();

    });


});
