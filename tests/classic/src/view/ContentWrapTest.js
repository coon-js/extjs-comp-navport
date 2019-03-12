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

describe('coon.navport.view.ContentWrapTest', function(t) {

    var cwrap,
        cwrapConfig;

    t.afterEach(function() {
        if (cwrap) {
            cwrap.destroy();
            cwrap = null;
        }
    })

    t.beforeEach(function() {
        cwrapConfig = {renderTo : document.body};
    });

    t.it("Should create and show the ContentWrap", function(t) {
        cwrap = Ext.create(
            'coon.navport.view.ContentWrap', cwrapConfig);

        t.expect(cwrap instanceof Ext.Container).toBe(true);

        t.expect(cwrap.alias).toContain('widget.cn_navport-conwrap');
        t.expect(cwrap.cls).toBe('cn_navport-conwrap');
        t.expect(cwrap.referenceHolder).toBe(true);

        t.expect(cwrap.lookup('cn_navport_ref_navtree')).toBeTruthy();
        t.expect(cwrap.lookup('cn_navport_ref_navtree') instanceof coon.navport.view.NavigationTree).toBeTruthy();

        t.expect(cwrap.lookup('cn_navport_ref_navtree').getWidth()).toBe(250);

        t.expect(cwrap.lookup('cn_navport_ref_conctr')).toBeTruthy();
        t.expect(cwrap.lookup('cn_navport_ref_conctr') instanceof coon.navport.view.ContentContainer).toBeTruthy();
    });

    t.it("Should use the proper layout", function(t) {
        cwrap = Ext.create(
            'coon.navport.view.ContentWrap', cwrapConfig);

        t.expect(cwrap.getLayout() instanceof Ext.layout.container.HBox).toBe(true);
        t.expect(cwrap.getLayout().align).toBe('stretch');

    });

});
