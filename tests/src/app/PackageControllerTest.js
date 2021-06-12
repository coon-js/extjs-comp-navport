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

    let ctrl;

    t.beforeEach(() => {

    });

    t.afterEach(() => {

        if (ctrl) {
            ctrl.destroy();
            ctrl = null;
        }

    });


    // +--------------------------------------
    // | Tests
    // +--------------------------------------
    t.it("Should create the Controller", (t) => {
        ctrl = Ext.create("coon.navport.app.PackageController");

        t.expect(ctrl.autoDefaultToken).toBe(null);
        t.expect(ctrl instanceof Ext.app.Controller).toBe(true);
    });


    t.it("init()", (t) => {
        ctrl = Ext.create("coon.navport.app.PackageController");

        var app = {
            defaultToken: null,
            getDefaultToken: function () {
                return this.defaultToken;
            },
            setDefaultToken: function (token) {
                this.defaultToken = token;
            }
        };

        ctrl.init(app);
        t.expect(app.getDefaultToken()).toBe(ctrl.autoDefaultToken);

        app.setDefaultToken("myToken");
        var oldToken = ctrl.autoDefaultToken;
        ctrl.init(app);
        t.expect(app.getDefaultToken()).toBe("myToken");
        t.expect(ctrl.autoDefaultToken).toBe(oldToken);

    });


    t.it("processRouteFor()", (t) => {
        ctrl = Ext.create("coon.navport.app.PackageController");

        var CLEANUP = 0,
            ACTIVATED = 0,
            app = {
                getMainView: () => {
                    return {
                        cleanup: () => {
                            CLEANUP++;
                        }
                    };
                },
                activateViewForHash: () => {
                    ACTIVATED++;
                }
            };

        ctrl.getApplication = () => {
            return app;
        };

        t.expect(ACTIVATED).toBe(0);
        ctrl.processRouteFor("someHASH");
        t.expect(ACTIVATED).toBe(1);

        t.expect(CLEANUP).toBe(0);
        ctrl.autoDefaultToken = "someTOKEN";
        ctrl.processRouteFor(ctrl.autoDefaultToken);
        t.expect(CLEANUP).toBe(1);

    });


    t.it("onUnmatchedRoute()", (t) => {
        ctrl = Ext.create("coon.navport.app.PackageController");

        var CLEANUP = 0,
            ACTIVATED = 0,
            app = {
                getMainView: () => {
                    return {
                        cleanup: () => {
                            CLEANUP++;
                        }
                    };
                },
                activateViewForHash: () => {
                    ACTIVATED++;
                }
            };

        ctrl.getApplication = () => {
            return app;
        };

        t.expect(ctrl.onBeforePackageRoute).toBeDefined();

        ctrl.onBeforePackageRoute = function (action) {
            t.expect(action.stop).toBe(Ext.emptyFn);
            action.resume();
        };

        t.expect(ACTIVATED).toBe(0);
        ctrl.onUnmatchedRoute("someHASH");
        t.expect(ACTIVATED).toBe(1);

        t.expect(CLEANUP).toBe(0);
        ctrl.autoDefaultToken = "someTOKEN";
        ctrl.onUnmatchedRoute(ctrl.autoDefaultToken);
        t.expect(CLEANUP).toBe(1);

    });

});
