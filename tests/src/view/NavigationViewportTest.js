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

    var viewport,
        postLaunchInfo;

    t.beforeEach(() => {

        postLaunchInfo = {
            navigation: [{
                route: "myRoute",
                text: "my route"
            }, {
                route: "myRoute1",
                text: "my route 1"
            }]
        };
    });


    t.afterEach(() => {
        if (viewport) {
            viewport.destroy();
            viewport = null;
        }
    });


    // +--------------------------------
    // | Tests
    // +--------------------------------


    t.it("Should create and show Viewport", (t) => {
        viewport = Ext.create("coon.navport.view.NavigationViewport");
        t.expect(viewport instanceof coon.comp.container.Viewport).toBeTruthy();

        t.expect(viewport.alias).toContain("widget.cn_navport");
        t.expect(Ext.isModern ? viewport.getCls() : viewport.cls)[Ext.isModern ? "toContain" : "toBe"]("cn_navport");
        t.expect(viewport.referenceHolder).toBe(true);
        t.isInstanceOf(viewport.getLayout(), Ext.isModern ? "Ext.layout.VBox" : "Ext.layout.container.VBox");
        t.expect(Ext.isModern ? viewport.getLayout().getAlign() : viewport.getLayout().align).toBe("stretch");

    });


    t.it("Should have the ContentWrap", (t) => {
        viewport = Ext.create("coon.navport.view.NavigationViewport");
        let cwrap = viewport.lookup("cn_navport_ref_conwrap");
        t.expect(cwrap instanceof coon.navport.view.ContentWrap).toBe(true);
        t.expect(Ext.isModern ? cwrap.getFlex() : cwrap.flex).toBe(1);
    });


    t.it("Should have the Toolbar", (t) => {
        viewport = Ext.create("coon.navport.view.NavigationViewport");
        t.expect(viewport.lookup("cn_navport_ref_tbar") instanceof coon.navport.view.NavigationToolbar).toBe(true);
    });


    t.it("Should be possible to hide the navigation", (t) => {
        viewport = Ext.create("coon.navport.view.NavigationViewport", Ext.isModern ? {
            renderTo: document.body
        } : {});

        t.expect(viewport.down("cn_navport-navtree").isVisible()).toBe(true);
        viewport.hideNavigation(true);
        t.expect(viewport.down("cn_navport-navtree").isVisible()).toBe(false);
        viewport.hideNavigation(false);
        t.expect(viewport.down("cn_navport-navtree").isHidden()).toBe(false);
    });


    t.it("Should be possible to click the hideNavigation Button and hide the navigation", (t) => {
        viewport = Ext.create("coon.navport.view.NavigationViewport", Ext.isModern ? {
            renderTo: document.body
        } : undefined);
        var btn = viewport.down("button[reference=cn_navport_ref_hidenavbtn]");

        t.expect(btn).toBeTruthy();
        t.expect(viewport.down("cn_navport-navtree").isHidden()).toBe(false);
        t.click(btn, () => {
            t.expect(viewport.down("cn_navport-navtree").isHidden()).toBe(true);
        });

    });


    t.it("Should be possible to call addPostLaunchInfo and populate the NavigationTree", (t) => {
        viewport = Ext.create("coon.navport.view.NavigationViewport");

        var store = viewport.down("cn_navport-navtree").getStore();

        t.expect(store.getRange().length).toBe(0);
        t.expect(store.getRootNode().childNodes.length).toBe(0);

        viewport.addPostLaunchInfo(postLaunchInfo);

        t.expect(store.getRange().length).toBe(2);
        t.expect(store.getRootNode().childNodes.length).toBe(2);
    });


    t.it("Should process showUnmatchedRouteNotification properly", (t) => {
        viewport = Ext.create("coon.navport.view.NavigationViewport");

        var w = viewport.showUnmatchedRouteNotification("somehash");

        t.expect(w instanceof coon.comp.window.LockingWindow).toBe(true);

        w.destroy();
        w = null;
    });


    t.it("activateViewForHash()", (t) => {

        viewport = Ext.create("coon.navport.view.NavigationViewport", Ext.isModern ? {
            renderTo: document.body
        } : {});

        viewport.addPostLaunchInfo({
            navigation: [{
                text: "Text",
                route: "testroute",
                view: "Ext.Panel"
            }]
        });

        var w = viewport.activateViewForHash("somehash");

        t.expect(w).toBeFalsy();

        w = viewport.activateViewForHash("testroute");

        t.expect(w instanceof Ext.Panel).toBe(true);

        var v = viewport.activateViewForHash("testroute");

        t.expect(w).toBe(v);

        w.destroy();
        v = null;
        w = null;

    });


    /**
     * coon/extjs-comp-navport/#2
     */
    t.it("Should test addPostLaunchInfo() with permaNav properly", (t) => {

        viewport = Ext.create("coon.navport.view.NavigationViewport");

        t.expect(viewport.down("cn_navport-tbar").down("#buttonA")).toBeFalsy();
        t.expect(viewport.down("cn_navport-tbar").down("#buttonB")).toBeFalsy();
        viewport.addPostLaunchInfo({
            permaNav: [{
                xtype: "button",
                itemId: "buttonA"
            }, {
                xtype: "button",
                itemId: "buttonB"
            }]
        });
        t.expect(viewport.down("cn_navport-tbar").down("#buttonA")).toBeTruthy();
        t.expect(viewport.down("cn_navport-tbar").down("#buttonB")).toBeTruthy();

    });


    /**
     * coon/extjs-comp-navport/#2
     */
    t.it("Should test addPostLaunchInfo() with nodeNav properly", (t) => {

        viewport = Ext.create("coon.navport.view.NavigationViewport");

        t.expect(viewport.down("cn_navport-tbar").down("#buttonA")).toBeFalsy();
        t.expect(viewport.down("cn_navport-tbar").down("#buttonB")).toBeFalsy();
        viewport.addPostLaunchInfo({
            navigation: [{
                route: "route",
                text: "text",
                nodeNav: [{
                    xtype: "button",
                    itemId: "buttonA"
                }, {
                    xtype: "button",
                    itemId: "buttonB"
                }]
            }]
        });
        t.expect(viewport.down("cn_navport-tbar").down("#buttonA")).toBeTruthy();
        t.expect(viewport.down("cn_navport-tbar").down("#buttonB")).toBeTruthy();

    });


    t.it("extjs-comp-navport#7", (t) => {

        let gA = Ext.getApplication, w;

        let CONFIGURE_VIEW = false;

        Ext.getApplication = () => {
            return {
                getController: function (key) {
                    if (key === "MyController") {
                        return {
                            configureView: function (view, created, hash, node) {
                                if (!Ext.isObject(CONFIGURE_VIEW)) {
                                    CONFIGURE_VIEW = {view: [], hash: [], node: [], created: []};
                                }

                                CONFIGURE_VIEW.view.push(view);
                                CONFIGURE_VIEW.hash.push(hash);
                                CONFIGURE_VIEW.node.push(node);
                                CONFIGURE_VIEW.created.push(created);

                                return view;
                            }
                        };
                    }
                }
            };
        };

        viewport = Ext.create("coon.navport.view.NavigationViewport", Ext.isModern ? {
            renderTo: document.body
        } : {});

        let postLaunchInfo = {
            navigation: [{
                text: "Text",
                route: "testroute",
                view: "Ext.Panel",
                packageController: "MyController"
            }, {
                text: "Text",
                route: "testroute2",
                view: "Ext.Panel",
                packageController: "MyController"
            }, {
                text: "Text",
                route: "testroute3",
                view: "Ext.Panel",
                packageController: "MyControllerFOOBAR"
            }, {
                text: "Window",
                route: "window",
                view: "Ext.Window",
                packageController: "MyController"
            }]
        };

        viewport.addPostLaunchInfo(postLaunchInfo);

        t.expect(CONFIGURE_VIEW).toBe(false);
        w = viewport.activateViewForHash("testroute");
        t.expect(w.cn_routeId).toBe("testroute");
        t.isInstanceOf(w, "Ext.Panel");
        t.expect(CONFIGURE_VIEW.view).toEqual([w, w]);
        t.expect(CONFIGURE_VIEW.hash).toEqual(["testroute", "testroute"]);
        t.isInstanceOf(CONFIGURE_VIEW.node[0], "coon.navport.model.NavigationModel");
        t.isInstanceOf(CONFIGURE_VIEW.node[1], "coon.navport.model.NavigationModel");
        t.expect(CONFIGURE_VIEW.node[0]).toBe(CONFIGURE_VIEW.node[0]);
        t.expect(CONFIGURE_VIEW.node[0]).toBe(viewport.down("treelist").getStore().getAt(0));
        t.expect(CONFIGURE_VIEW.created).toEqual([true, false]);

        // configureView only called once since comp does not get created
        CONFIGURE_VIEW = false;
        let newW = viewport.activateViewForHash("testroute");
        t.expect(newW).toBe(w);
        t.expect(CONFIGURE_VIEW.created).toEqual([false]);

        // configureView only called once since window
        // does not get activated after creating it
        CONFIGURE_VIEW = false;
        w = viewport.activateViewForHash("window");
        t.isInstanceOf(w, "Ext.Window");
        t.expect(CONFIGURE_VIEW.created).toEqual([true]);


        let SECOND = false;
        Ext.getApplication = () => {
            return {
                getController: function (packageController) {
                    if (packageController !== "MyController") {
                        return null;
                    }
                    SECOND = true;
                    return {
                        configureView: true
                    };
                }
            };
        };

        CONFIGURE_VIEW = false;
        viewport.activateViewForHash("testroute");
        t.expect(CONFIGURE_VIEW).toBe(false);

        let k = viewport.activateViewForHash("testroute2");
        t.expect(k.cn_routeId).toBe("testroute2");
        t.expect(SECOND).toBe(true);

        SECOND = false;
        viewport.activateViewForHash("testroute3");
        t.expect(SECOND).toBe(false);


        w.destroy();
        w = null;

        Ext.getApplication = gA;

    });


    t.it("extjs-comp-navport#8", (t) => {

        let gA = Ext.getApplication, w1, w2, w3;

        let CONFIGURE_VIEW = false;

        Ext.getApplication = () => {
            return {
                getController: function (key) {
                    if (key === "MyController") {
                        return {
                            configureView: function (view, node, hash, created) {
                                if (!Ext.isArray(CONFIGURE_VIEW)) {
                                    CONFIGURE_VIEW = [];
                                }
                                CONFIGURE_VIEW.push(view);
                                return view;
                            }
                        };
                    }
                }
            };
        };

        viewport = Ext.create("coon.navport.view.NavigationViewport", Ext.isModern ? {
            renderTo: document.body
        } : {});

        let viewCfg = {xclass: "Ext.Panel", id: Ext.id()},
            postLaunchInfo = {
                navigation: [{
                    text: "Text",
                    route: "testroute",
                    view: viewCfg,
                    packageController: "MyController"
                }, {
                    text: "Text",
                    route: "testroute2",
                    view: viewCfg,
                    packageController: "MyController"
                }, {
                    text: "Text",
                    route: "testroute3",
                    view: {xclass: "Ext.Panel", id: Ext.id()},
                    packageController: "MyController"
                }]
            };

        viewport.addPostLaunchInfo(postLaunchInfo);

        // extjs-comp-navport#11
        t.isCalled("activateNodeNavigation", viewport.getController());

        w1 = viewport.activateViewForHash("testroute");
        w2 = viewport.activateViewForHash("testroute2");
        w3 = viewport.activateViewForHash("testroute3");


        t.expect(w1.cn_routeId).toBeUndefined();
        t.expect(w2.cn_routeId).toBeUndefined();
        t.expect(w3.cn_routeId).toBeUndefined();

        t.isInstanceOf(w1, "Ext.Panel");
        t.isInstanceOf(w2, "Ext.Panel");
        t.isInstanceOf(w3, "Ext.Panel");
        t.expect(w1).toBe(w2);
        t.expect(w2).not.toBe(w3);


        w1.destroy();
        w3.destroy();

        Ext.getApplication = gA;

    });

});
