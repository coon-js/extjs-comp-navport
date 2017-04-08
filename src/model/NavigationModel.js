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

/**
 * Model class for model entities representing Nagivations.
 * The route can be used as the href for a button/item, triggering the routing
 * process of a controller.
 *
 *      @example
 *      var navigationNode = Ext.create('conjoon.cn_core.model.NavigationModel', {
 *          text  : 'Users',
 *          route : '/users/getAll',
 *          view  : 'MyView.Panel'
 *      ));
 *
 * Each navigation node is represented by a view which can be specified by the
 * "view" property.
 *
 *
 * This model's {@link #toUrl} method is overridden so instances of this class
 * can directly be passed to {@link conjoon.cn_treenavviewport.view.controller.NavigationViewPortController#redirectTo}.
 *
 *
 */
Ext.define('conjoon.cn_treenavviewport.model.NavigationModel', {

    extend :  'Ext.data.TreeModel',

    requires : [
        'conjoon.cn_treenavviewport.data.schema.BaseSchema'
    ],

    schema : 'cn_treenavviewport-baseschema',

    fields : [{
        name : 'route',
        type : 'string',
        validators : [{
            type : 'presence'
        }]
    }, {
        name : 'text',
        type : 'string',
        validators : [{
            type : 'presence'
        }]
    }, {
        name : 'view',
        type : 'auto'
    }],

    toUrl : function() {
        return this.get('route');
    }

});
