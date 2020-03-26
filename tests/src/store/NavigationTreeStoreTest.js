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

describe("coon.navport.store.NavigationTreeStoreTest", function (t) {

    t.it("Should properly create the store and check for default config", function (t) {

        var store = Ext.create("coon.navport.store.NavigationTreeStore");

        t.expect(store instanceof Ext.data.TreeStore).toBe(true);

        t.expect(store.config.model).toBe("coon.navport.model.NavigationModel");

        t.expect(store.alias).toContain("store.cn_navport-navtreestore");

        t.expect(store.getRootNode() instanceof coon.navport.model.NavigationModel).toBe(true);
        t.expect(store.getRootNode().get("expanded")).toBe(true);

    });

});
