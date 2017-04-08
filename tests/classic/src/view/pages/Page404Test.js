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

describe('conjoon.cn_treenavviewport.view.pages.404Test', function(t) {

    var page;

    t.afterEach(function() {
        if (page) {
            page.destroy();
            page = null;
        }
    });

    t.beforeEach(function() {

    })


    t.it("Should create and show Page", function(t) {
        page = Ext.create('conjoon.cn_treenavviewport.view.pages.Page404');

        t.expect(page instanceof conjoon.cn_comp.window.LockingWindow).toBe(true);
        t.expect(page.cls).toBe('cn_treenavviewport-pg404');
        t.expect(page.alias).toContain('widget.cn_treenavviewport-pg404');

    });

});
