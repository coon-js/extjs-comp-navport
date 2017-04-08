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

describe('conjoon.cn_treenavviewport.view.NavigationTreeTest', function(t) {

    var tree,
        treeConfig;

    t.afterEach(function() {return;
        if (tree) {
            tree.destroy();
            tree = null;
        }
    });

    t.beforeEach(function(){
        treeConfig = {
            renderTo : document.body
        };
    });

    t.it("Should create and show the tree", function(t) {
        tree = Ext.create('conjoon.cn_treenavviewport.view.NavigationTree', treeConfig);

        t.expect(tree instanceof conjoon.cn_comp.list.Tree).toBe(true);
        t.expect(tree.alias).toContain('widget.cn_treenavviewport-navtree');
        t.expect(tree.getCls()).toContain('cn_treenavviewport-navtree');
        t.expect(tree.getStore()).toBeTruthy();
        t.expect(tree.getStore() instanceof conjoon.cn_treenavviewport.store.NavigationTreeStore).toBe(true);

        t.expect(tree.defaultConfig.expanderOnly).toBe(false);
        t.expect(tree.defaultConfig.expanderFirst).toBe(false);
    });



});
