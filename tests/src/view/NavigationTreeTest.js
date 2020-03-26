/**
 * coon.js
 * lib-cn_navport
 * Copyright (C) 2017 - 2020 Thorsten Suckow-Homberg https://github.com/coon-js/lib-cn_navport
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

describe("coon.navport.view.NavigationTreeTest", function (t) {

    var tree,
        treeConfig;

    t.afterEach(function () {
        if (tree) {
            tree.destroy();
            tree = null;
        }
    });

    t.beforeEach(function (){
        treeConfig = {
            renderTo : document.body
        };
    });

    t.it("Should create and show the tree", function (t) {
        tree = Ext.create("coon.navport.view.NavigationTree", treeConfig);

        t.expect(tree instanceof coon.comp.list.Tree).toBe(true);
        t.expect(tree.alias).toContain("widget.cn_navport-navtree");
        t.expect(tree.getCls()).toContain("cn_navport-navtree");
        t.expect(tree.getStore()).toBeTruthy();
        t.expect(tree.getStore() instanceof coon.navport.store.NavigationTreeStore).toBe(true);

        t.expect(tree.defaultConfig.expanderOnly).toBe(false);
        t.expect(tree.defaultConfig.expanderFirst).toBe(false);
    });


});
