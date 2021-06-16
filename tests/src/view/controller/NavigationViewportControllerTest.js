/**
 * coon.js
 * extjs-comp-navport
 * Copyright (C) 2017-2021 Thorsten Suckow-Homberg https://github.com/coon-js/extjs-comp-navport
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

StartTest((t) => {

    var viewportCtrl;

    t.afterEach(() => {
        if (viewportCtrl) {
            viewportCtrl.destroy();
            viewportCtrl = null;
        }
    });

    t.it("Should create the ViewportController", (t) => {
        viewportCtrl = Ext.create("coon.navport.view.controller.NavigationViewportController");
        t.expect(viewportCtrl instanceof Ext.app.ViewController).toBe(true);

        t.expect(viewportCtrl.alias).toContain("controller.cn_navport-ctrl");
    });

    /**
     * coon/extjs-comp-navport/#2
     */
    t.it("Should test addPermaNavItem() properly", (t) => {

        viewportCtrl = Ext.create("coon.navport.view.controller.NavigationViewportController");

        // MOCK LOOKUP() - EMPTY OBJECT
        // TOOLBAR
        var toolbar = Ext.create("coon.navport.view.NavigationToolbar");
        viewportCtrl.lookup = () => {
            return toolbar;
        };

        var res = viewportCtrl.addPermaNavItems([{xtype: "button", itemId: "foo"}]);
        t.expect(res[0]).toBe("foo");
        toolbar.destroy();
        toolbar = null;
    });


    t.it("createNavigationModelFrom()", (t) => {

        var exc, rec, nodeNav;

        viewportCtrl = Ext.create(
            "coon.navport.view.controller.NavigationViewportController"
        );

        exc = undefined;
        try{viewportCtrl.createNavigationModelFrom(
            {}
        );}catch(e){exc = e;}
        t.expect(exc.msg).toContain("invalid configuration");

        exc = undefined;
        try{viewportCtrl.createNavigationModelFrom(
            {text: "text"}
        );}catch(e){exc = e;}
        t.expect(exc.msg).toContain("invalid configuration");

        exc = undefined;
        try{viewportCtrl.createNavigationModelFrom(
            {route: "route"}
        );}catch(e){exc = e;}
        t.expect(exc.msg).toContain("invalid configuration");

        [rec, nodeNav] = viewportCtrl.createNavigationModelFrom(
            {id: "a", text: "text", route: "route", nodeNav: [], inheritNodeNav: true,
                view: "myView", iconCls: "myIconCls", packageController: "MyController"}
        );

        t.isInstanceOf(rec, "coon.navport.model.NavigationModel");

        t.expect(nodeNav).toEqual({});

        t.isStrict(rec.getId(),        "a");
        t.isStrict(rec.get("leaf"),    true);
        t.isStrict(rec.get("text"),    "text");
        t.isStrict(rec.get("route"),   "route");
        t.isStrict(rec.get("view"),    "myView");
        t.isStrict(rec.get("iconCls"), "myIconCls");
        t.isStrict(rec.get("inheritNodeNav"), true);
        t.isStrict(rec.get("packageController"), "MyController");
        t.expect(rec.get("nodeNav")).toBeUndefined();

    });


    t.it("createNavigationModelFrom() - with child nodes", (t) => {

        var rec, nodeNav;

        viewportCtrl = Ext.create(
            "coon.navport.view.controller.NavigationViewportController"
        );

        [rec, nodeNav] = viewportCtrl.createNavigationModelFrom(
            {id: "a", text: "text", route: "route", nodeNav: [{text: "foo"}],
                view: "myView", iconCls: "myIconCls", children: [{id: "b", text: "childtext", route: "childroute", nodeNav: [{text: "childfoo"}]}]}
        );

        t.isInstanceOf(rec, "coon.navport.model.NavigationModel");

        t.expect(rec.childNodes.length).toBe(1);

        t.expect(nodeNav).toEqual({
            "a": [{text: "foo"}],
            "b": [{text: "childfoo"}]
        });

        let childRec = rec.childNodes[0];

        t.isStrict(childRec.get("text"),    "childtext");
        t.isStrict(childRec.get("route"),   "childroute");

        t.isInstanceOf(childRec, "coon.navport.model.NavigationModel");

        t.isStrict(rec.getId(),        "a");
        t.isStrict(rec.get("leaf"),    false);
        t.isStrict(rec.get("text"),    "text");
        t.isStrict(rec.get("route"),   "route");
        t.isStrict(rec.get("view"),    "myView");
        t.isStrict(rec.get("iconCls"), "myIconCls");
        t.expect(rec.get("nodeNav")).toBeUndefined();
    });


    t.it("onNavigationTreeSelectionChange() - null values (extjs-comp-navport#10)", (t) => {

        viewportCtrl = Ext.create(
            "coon.navport.view.controller.NavigationViewportController"
        );

        t.isntCalled("redirectTo", viewportCtrl);

        viewportCtrl.onNavigationTreeSelectionChange({}, null);

    });


    t.it("activateNodeNavigation()", (t) => {


        let rec,
            nodeNav,
            getNode = function (id) {
                return rec.findChildBy(function (node) {
                    if (node.getId() === id) {
                        return true;
                    }
                }, null, true);
            };

        viewportCtrl = Ext.create(
            "coon.navport.view.controller.NavigationViewportController"
        );

        viewportCtrl.lookup = () => {
            return {
                hasNodeNavigation: function (id) {

                    if (nodeNav) {
                        return !!nodeNav[id];
                    }
                    return false;
                },
                showNavigationForNode: function (nodeId) {

                }
            };
        };

        [rec, nodeNav] = viewportCtrl.createNavigationModelFrom({
            text: "text",
            route: "route",
            children: [{
                id: "a",
                text: "text_1",
                route: "route_1",
                nodeNav: [{}],
                children: [{
                    id: "id_1_2",
                    text: "text_1_2",
                    route: "route_1_2",
                    inheritNodeNav: true,
                    children: [{
                        id: "text_1_2_1",
                        text: "text_1_2_1",
                        route: "route_1_2_1"
                    }, {
                        id: "id_1_2_2",
                        text: "text_1_2_2",
                        route: "route_1_2_2",
                        inheritNodeNav: true,
                        children: [{
                            id: "id_1_2_2_1",
                            text: "text_1_2_2_1",
                            route: "route_1_2_2_1",
                            children: [{
                                id: "id_1_2_2_1_1",
                                text: "text_1_2_2_1_1",
                                route: "route_1_2_2_1_1",
                                inheritNodeNav: true
                            }]
                        }]
                    }]
                }, {
                    text: "text_1_3",
                    route: "route_1_3"
                }]
            }, {
                nodeNav: [{}],
                id: "id_2",
                text: "text_2",
                route: "route_2"
            }]
        });

        t.expect(viewportCtrl.activateNodeNavigation(getNode("id_1_2_2"))).toBe("a");
        t.expect(viewportCtrl.activateNodeNavigation(getNode("id_1_2_1"))).toBe(null);
        t.expect(viewportCtrl.activateNodeNavigation(getNode("id_2"))).toBe("id_2");
        t.expect(viewportCtrl.activateNodeNavigation(getNode("id_1_2_2_1_1"))).toBe(null);

    });


});
