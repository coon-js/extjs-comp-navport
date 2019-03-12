/**
 * coon.js
 * lib-cn_navport
 * Copyright (C) 2019 Thorsten Suckow-Homberg https://github.com/coon-js/lib-cn_navport
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

describe('coon.navport.view.controller.NavigationViewportControllerTest', function(t) {

    var viewportCtrl;

    t.afterEach(function() {
        if (viewportCtrl) {
            viewportCtrl.destroy();
            viewportCtrl = null;
        }
    });

    t.it("Should create the ViewportController", function(t) {
        viewportCtrl = Ext.create('coon.navport.view.controller.NavigationViewportController');
        t.expect(viewportCtrl instanceof Ext.app.ViewController).toBe(true);

        t.expect(viewportCtrl.alias).toContain('controller.cn_navport-ctrl');
    });

    /**
     * coon/lib-cn_navport/#2
     */
    t.it("Should test addPermaNavItem() properly", function(t) {

        viewportCtrl = Ext.create('coon.navport.view.controller.NavigationViewportController');

        // MOCK LOOKUP() - EMPTY OBJECT
        // TOOLBAR
        var toolbar = Ext.create('coon.navport.view.NavigationToolbar');
        viewportCtrl.lookup = function() {
            return toolbar;
        };

        var res = viewportCtrl.addPermaNavItems([{xtype : 'button', itemId : 'foo'}]);
        t.expect(res[0]).toBe('foo');
        toolbar.destroy();
        toolbar = null;
    });


    t.it('createNavigationModelFrom()', function(t) {

        var exc, e, rec;

        viewportCtrl = Ext.create(
            'coon.navport.view.controller.NavigationViewportController'
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

        t.isInstanceOf(rec, 'coon.navport.model.NavigationModel');

        t.isStrict(rec.getId(),        'a');
        t.isStrict(rec.get('leaf'),    true);
        t.isStrict(rec.get('text'),    'text');
        t.isStrict(rec.get('route'),   'route');
        t.isStrict(rec.get('view'),    'myView');
        t.isStrict(rec.get('iconCls'), 'myIconCls');
        t.expect(rec.get('nodeNav')).toBeUndefined();

    });


});
