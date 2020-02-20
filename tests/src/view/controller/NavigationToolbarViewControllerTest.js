/**
 * coon.js
 * lib-cn_navport
 * Copyright (C) 2020 Thorsten Suckow-Homberg https://github.com/coon-js/lib-cn_navport
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
describe('coon.navport.view.controller.NavigationToolbarViewControllerTest', function(t) {

    var sharedController,
        toolbar;

    t.chain({
        action : function(next) {
            t.it('sanitize', function(t) {
                sharedController = Ext.create('coon.navport.view.controller.NavigationToolbarViewController');
                toolbar = Ext.create('Ext.Toolbar', {renderTo : document.body, controller : sharedController});

                t.isInstanceOf(sharedController, 'Ext.app.ViewController');
                t.expect(sharedController.alias).toContain('controller.cn_navport-navigationtoolbarviewcontroller');
                t.expect(sharedController.nodeNavItemIds).toBe(null);
                t.expect(sharedController.activeNodeId).toBe(null);
                t.isStrict(sharedController.nodeNavInsertPosition, 2);

                next(sharedController, toolbar);
            });
        }
    }, {
        action : function(next, controller, toolbar) {
            // buildToolbarItems
            t.it('buildToolbarItems()', function(t) {
                var exc = e = undefined, itemIds;
                try {controller.buildToolbarItems();}catch(e){exc = e};
                t.expect(exc.msg).toContain('to be an array');

                exc = e = undefined;
                try {controller.buildToolbarItems([{}]);}catch(e){exc = e};
                t.expect(exc.msg).toContain('invalid configuration');

                exc = e = undefined;
                try {controller.buildToolbarItems([{text : 'bla'}]);}catch(e){exc = e};
                t.expect(exc.msg).toContain('invalid configuration');

                itemIds = controller.buildToolbarItems(
                    [{xtype : 'button', itemId : 'foo', hidden : true}],
                    true
                );
                t.isArray(itemIds);
                t.is(itemIds.length, 1);
                t.isStrict(itemIds[0].itemId,    'foo');
                t.isStrict(itemIds[0].cn_hidden, true);
                t.isStrict(itemIds[0].hidden,    true);

                itemIds = controller.buildToolbarItems([{xclass : 'Ext.Button'}]);
                t.isArray(itemIds);
                t.is(itemIds.length, 1);
                t.ok(itemIds[0].itemId);
                t.notOk(itemIds[0].cn_hidden);
                t.notOk(itemIds[0].hidden);

                next(controller, toolbar);
            });
        }
    }, {
        action : function(next, controller, toolbar) {
            // buildPermaNavItems
            t.it('buildPermaNavItems()', function(t) {
                var itemIds = controller.buildPermaNavItems(
                    [{xtype : 'button', itemId : 'foo', hidden : true},
                     {xtype : 'button', itemId : 'bar', hidden : true}]
                );
                t.isArray(itemIds);
                t.is(itemIds.length, 2);
                t.isStrict(itemIds[0], 'foo');
                t.expect(toolbar.items.getAt(0).getItemId()).toBe('foo');
                t.expect(toolbar.items.getAt(1).getItemId()).toBe('bar');

                next(controller, toolbar);
            });
        }
    }, {
        action : function(next, controller, toolbar) {
            // buildNodeNavItems
            t.it('buildNodeNavItems()', function(t) {
                var itemIds = controller.buildNodeNavItems(
                    [{xtype : 'button', itemId : 'foobar', hidden : true},
                     {xtype : 'button', itemId : 'barfoo'}],
                    'myId'
                );
                t.isArray(itemIds);
                t.is(itemIds.length, 2);
                t.isStrict(itemIds[0], 'foobar');
                t.isStrict(itemIds[1], 'barfoo');
                t.expect(toolbar.items.getAt(2).getItemId()).toBe('foobar');
                t.expect(toolbar.items.getAt(3).getItemId()).toBe('barfoo');
                t.expect(controller.nodeNavItemIds['myId']).toEqual(['foobar', 'barfoo'])

                next(controller, toolbar);
            });
        }
    }, {
        action : function(next, controller, toolbar) {
            // switchItemVisibility
            t.it('switchItemVisibility()', function(t) {

                var foobar = toolbar.down('#foobar'),
                    barfoo = toolbar.down('#barfoo');

                t.expect(foobar.isHidden()).toBe(true);
                t.expect(foobar.cn_hidden).toBe(true);
                t.expect(barfoo.isHidden()).toBe(true);
                t.expect(barfoo.cn_hidden).toBeFalsy();

                t.notOk(controller.switchItemVisibility('foobar', true));
                t.expect(foobar.cn_hidden).toBe(true);
                t.expect(foobar.isHidden()).toBe(true);
                t.ok(controller.switchItemVisibility('barfoo', true));
                t.expect(barfoo.isHidden()).toBe(false);
                t.expect(barfoo.cn_hidden).toBeFalsy();

                t.notOk(controller.switchItemVisibility('foobar', false));
                t.expect(foobar.cn_hidden).toBe(true);
                t.expect(foobar.isHidden()).toBe(true);
                t.notOk(controller.switchItemVisibility('barfoo', false));
                t.expect(barfoo.isHidden()).toBe(true);
                t.expect(barfoo.cn_hidden).toBeFalsy();

                next(controller, toolbar);
            });
        }
    }, {
        action : function(next, controller, toolbar) {
            /**
             * activateNavigationForNode
             */
            t.it('activateNavigationForNode()', function(t) {

                var itemIds = controller.buildNodeNavItems(
                    [{xtype : 'button', itemId : 'foofoo'},
                     {xtype : 'button', itemId : 'barbar'}],
                    'myId2'
                );

                var foobar = toolbar.down('#foobar'),
                    barfoo = toolbar.down('#barfoo'),
                    foofoo = toolbar.down('#foofoo'),
                    barbar = toolbar.down('#barbar');

                t.expect(foobar.isHidden()).toBe(true);
                t.expect(barfoo.isHidden()).toBe(true);
                t.expect(foofoo.isHidden()).toBe(true);
                t.expect(barbar.isHidden()).toBe(true);

                t.expect(controller.activateNavigationForNode('myId')).toBe('myId');
                t.expect(foobar.isHidden()).toBe(true);
                t.expect(barfoo.isHidden()).toBe(false);
                t.expect(foofoo.isHidden()).toBe(true);
                t.expect(barbar.isHidden()).toBe(true);

                t.expect(controller.activateNavigationForNode('unknown')).toBe(null);

                t.expect(foobar.isHidden()).toBe(true);
                t.expect(barfoo.isHidden()).toBe(true);
                t.expect(foofoo.isHidden()).toBe(true);
                t.expect(barbar.isHidden()).toBe(true);

                t.expect(controller.activateNavigationForNode('myId')).toBe('myId');
                t.expect(foobar.isHidden()).toBe(true);
                t.expect(barfoo.isHidden()).toBe(false);
                t.expect(foofoo.isHidden()).toBe(true);
                t.expect(barbar.isHidden()).toBe(true);

                t.expect(controller.activateNavigationForNode('myId2')).toBe('myId2');
                t.expect(foobar.isHidden()).toBe(true);
                t.expect(barfoo.isHidden()).toBe(true);
                t.expect(foofoo.isHidden()).toBe(false);
                t.expect(barbar.isHidden()).toBe(false);

                foobar.setHidden(false);

                t.expect(controller.activateNavigationForNode('myId')).toBe('myId');
                t.expect(foobar.isHidden()).toBe(false);
                t.expect(barfoo.isHidden()).toBe(false);
                t.expect(foofoo.isHidden()).toBe(true);
                t.expect(barbar.isHidden()).toBe(true);

                barfoo.setHidden(true);

                t.expect(controller.activateNavigationForNode('myId2')).toBe('myId2');
                t.expect(foobar.isHidden()).toBe(true);
                t.expect(barfoo.isHidden()).toBe(true);
                t.expect(foofoo.isHidden()).toBe(false);
                t.expect(barbar.isHidden()).toBe(false);

                t.expect(barfoo.cn_hidden).toBe(true);

                t.expect(controller.activateNavigationForNode('myId')).toBe('myId');
                t.expect(foobar.isHidden()).toBe(false);
                t.expect(barfoo.isHidden()).toBe(true);
                t.expect(foofoo.isHidden()).toBe(true);
                t.expect(barbar.isHidden()).toBe(true);

                next(controller, toolbar);
            });
        }
    }, {
        action : function(next, controller, toolbar) {

            t.it("hasNodeNavigation()", function(t) {

                t.expect(controller.hasNodeNavigation("myId")).toBe(true);
                t.expect(controller.hasNodeNavigation("myId2")).toBe(true);
                t.expect(controller.hasNodeNavigation("foofoobarbar")).toBe(false);

            });

        }
    })

});
