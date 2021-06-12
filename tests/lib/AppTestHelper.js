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

export const appConfig = {};

export default async function (t, postLaunchInfo) {

    let app = null,
        ONPROFILESREADY;

    const switchOnProfilesReady = (origin) => {
        if (!origin) {
            ONPROFILESREADY = coon.core.app.Application.prototype.onProfilesReady;
            coon.core.app.Application.prototype.onProfilesReady = Ext.app.Application.prototype.onProfilesReady;
            return ONPROFILESREADY;
        } else if (ONPROFILESREADY) {
            coon.core.app.Application.prototype.onProfilesReady = ONPROFILESREADY;
        }
    };

    t.beforeEach(() => {
        Ext.isModern && Ext.viewport.Viewport.setup();
        switchOnProfilesReady();

        appConfig.postLaunchInfo = postLaunchInfo;
    });

    t.afterEach(function () {

        switchOnProfilesReady(true);
        if (app) {
            app.destroy();
            app = null;
        }

        coon.core.Environment._vendorBase = undefined;

        if (Ext.isModern && Ext.Viewport) {
            Ext.Viewport.destroy();
            Ext.Viewport = null;
        }
    });

    return new Promise((resolve, reject) => {
        t.requireOk(
            "coon.core.app.Application",
            "coon.navport.view.NavigationViewport", () => {
                resolve (t);
            });
    });

}

