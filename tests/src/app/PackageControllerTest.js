/**
 * conjoon
 * (c) 2007-2017 conjoon.org
 * licensing@conjoon.org
 *
 * app-cn_treenavviewport
 * Copyright (C) 2017 Thorsten Suckow-Homberg/conjoon.org
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

describe('conjoon.cn_treenavviewport.app.PackageControllerTest', function(t) {


    t.it("Should create the Controller", function(t) {
        ctrl = Ext.create('conjoon.cn_treenavviewport.app.PackageController');

        t.expect(ctrl.autoDefaultToken).toBe(null);
        t.expect(ctrl instanceof Ext.app.Controller).toBe(true);
    });


    t.it("init()", function(t) {
        ctrl = Ext.create('conjoon.cn_treenavviewport.app.PackageController');

        var app = {
            defaultToken    : null,
            getDefaultToken : function() {
                return this.defaultToken;
            },
            setDefaultToken : function(token) {
                this.defaultToken = token;
            }
        };

        ctrl.init(app);
        t.expect(app.getDefaultToken()).toBe(ctrl.autoDefaultToken);

        app.setDefaultToken('myToken');
        var oldToken = ctrl.autoDefaultToken;
        ctrl.init(app);
        t.expect(app.getDefaultToken()).toBe('myToken');
        t.expect(ctrl.autoDefaultToken).toBe(oldToken);

    });


    t.it("processRouteFor()", function(t) {
        ctrl = Ext.create('conjoon.cn_treenavviewport.app.PackageController');

        var CLEANUP = 0,
            ACTIVATED = 0,
            app = {
                getMainView : function() {
                    return {
                        cleanup : function() {
                            CLEANUP++;
                        }
                    }
                },
                activateViewForHash : function() {
                    ACTIVATED++;
                }
            };

        ctrl.getApplication = function() {
            return app;
        };

        t.expect(ACTIVATED).toBe(0);
        ctrl.processRouteFor('someHASH');
        t.expect(ACTIVATED).toBe(1);

        t.expect(CLEANUP).toBe(0);
        ctrl.autoDefaultToken = 'someTOKEN';
        ctrl.processRouteFor(ctrl.autoDefaultToken);
        t.expect(CLEANUP).toBe(1);

    });


    t.it("onUnmatchedRoute()", function(t) {
        ctrl = Ext.create('conjoon.cn_treenavviewport.app.PackageController');

        var CLEANUP = 0,
            ACTIVATED = 0,
            app = {
                getMainView : function() {
                    return {
                        cleanup : function() {
                            CLEANUP++;
                        }
                    }
                },
                activateViewForHash : function() {
                    ACTIVATED++;
                }
            };

        ctrl.getApplication = function() {
            return app;
        };

        t.expect(ctrl.onBeforePackageRoute).toBeDefined();

        ctrl.onBeforePackageRoute = function(action) {
            t.expect(action.stop).toBe(Ext.emptyFn);
            action.resume();
        };

        t.expect(ACTIVATED).toBe(0);
        ctrl.onUnmatchedRoute('someHASH');
        t.expect(ACTIVATED).toBe(1);

        t.expect(CLEANUP).toBe(0);
        ctrl.autoDefaultToken = 'someTOKEN';
        ctrl.onUnmatchedRoute(ctrl.autoDefaultToken);
        t.expect(CLEANUP).toBe(1);

    });

});
