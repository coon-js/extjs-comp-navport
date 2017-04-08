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

describe('conjoon.cn_treenavviewport.view.ContentWrapTest', function(t) {

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
            'conjoon.cn_treenavviewport.view.ContentWrap', cwrapConfig);

        t.expect(cwrap instanceof Ext.Container).toBe(true);

        t.expect(cwrap.alias).toContain('widget.cn_treenavviewport-conwrap');
        t.expect(cwrap.cls).toBe('cn_treenavviewport-conwrap');
        t.expect(cwrap.referenceHolder).toBe(true);

        t.expect(cwrap.lookup('cn_treenavviewport_ref_navtree')).toBeTruthy();
        t.expect(cwrap.lookup('cn_treenavviewport_ref_navtree') instanceof conjoon.cn_treenavviewport.view.NavigationTree).toBeTruthy();

        t.expect(cwrap.lookup('cn_treenavviewport_ref_navtree').getWidth()).toBe(250);

        t.expect(cwrap.lookup('cn_treenavviewport_ref_conctr')).toBeTruthy();
        t.expect(cwrap.lookup('cn_treenavviewport_ref_conctr') instanceof conjoon.cn_treenavviewport.view.ContentContainer).toBeTruthy();
    });

    t.it("Should use the proper layout", function(t) {
        cwrap = Ext.create(
            'conjoon.cn_treenavviewport.view.ContentWrap', cwrapConfig);

        t.expect(cwrap.getLayout() instanceof Ext.layout.container.HBox).toBe(true);
        t.expect(cwrap.getLayout().align).toBe('stretch');

    });

});
