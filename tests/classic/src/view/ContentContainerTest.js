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

describe('coon.navport.view.ContentContainerTest', function(t) {

    var container,
        containerConfig;

    t.afterEach(function() {
        if (container) {
            container.destroy();
            container = null;
        }
    });

    t.beforeEach(function() {
        containerConfig = {
            renderTo : document.body
        };
    })


    t.it("Should create and show Container", function(t) {
        container = Ext.create(
            'coon.navport.view.ContentContainer', containerConfig);

        t.expect(container instanceof Ext.Container).toBe(true);
        t.expect(container.getLayout() instanceof Ext.layout.container.Card).toBe(true);
        t.expect(container.cls).toBe('cn_navport-conctr');
        t.expect(container.alias).toContain('widget.cn_navport-conctr');

    });

});
