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

describe('conjoon.cn_treenavviewport.view.ContentContainerTest', function(t) {

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
            'conjoon.cn_treenavviewport.view.ContentContainer', containerConfig);

        t.expect(container instanceof Ext.Container).toBe(true);
        t.expect(container.getLayout() instanceof Ext.layout.container.Card).toBe(true);
        t.expect(container.cls).toBe('cn_treenavviewport-conctr');
        t.expect(container.alias).toContain('widget.cn_treenavviewport-conctr');

    });

});
