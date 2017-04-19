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

Ext.define('conjoon.test.view.mock.ApplicationMock', {

    extend : 'conjoon.cn_comp.app.Application',

    name : 'test',

    requires : [
        'conjoon.cn_treenavviewport.view.NavigationViewport'
    ],

    controllers : [
        'conjoon.test.view.mock.PackageControllerMock'
    ],

    applicationViewClassName : 'conjoon.cn_treenavviewport.view.NavigationViewport'


});