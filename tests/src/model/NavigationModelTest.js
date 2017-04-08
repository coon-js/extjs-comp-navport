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

describe('conjoon.cn_treenavviewport.model.NavigationModelTest', function(t) {


// +----------------------------------------------------------------------------
// |                    =~. Unit Tests .~=
// +----------------------------------------------------------------------------

    var model,
        modelName = 'conjoon.cn_treenavviewport.model.NavigationModel',
        getModelBaseClass = function() {
            return eval('Ext.data.TreeModel');
        },
        getSchemaClass = function() {
            return conjoon.cn_treenavviewport.data.schema.BaseSchema;
        },
        entityName = 'NavigationModel',
        data = {
            route    : 'myroute',
            text     : 'NavigationText',
            view     : 'ViewClass'
        },
        presenceFields = [
            'route',
            'text'
        ],
        expected = {},
        expectedIdProperty = 'id',
        modelShouldBeValid = function(t, model) {
            t.expect(model.isValid()).toBeTruthy();
        },
        modelShouldBeInvalid = function(t, model) {
            t.expect(model.isValid()).toBeFalsy();
        };


    t.beforeEach(function() {
        model = Ext.create(modelName, Ext.apply({}, data));
    });

// +----------------------------------------------------------------------------
// |                    =~. Unit Tests .~=
// +----------------------------------------------------------------------------

    /**
     * Test create
     */
    t.it('Should read out the proper idProperty', function(t) {
        t.expect(model.getIdProperty()).toBe(expectedIdProperty);
    });


    /**
     * Test create
     */
    t.it(Ext.String.format('Should create an instance of {0}', modelName), function(t) {
        t.expect(model instanceof getModelBaseClass()).toBeTruthy();
    });

    /**
     * Test Schema
     */
    t.it('Should return the proper schema', function(t) {
        t.expect(model.schema instanceof getSchemaClass()).toBeTruthy();
    });

    /**
     * Test EntityName
     */
    t.it('Should return the entity name', function(t) {
        t.expect(model.schema.getEntityName(model)).toBe(entityName);
    });

    /**
     * Test getter fields
     */
    t.it('Should check the fields\' values', function(t) {
        // valid model
        for (var i in data) {
            if (!data.hasOwnProperty(i)) {
                continue;
            }

            t.expect(model.get(i)).toBe(
                expected.hasOwnProperty(i) ? expected[i] : data[i]
            );
        }
        modelShouldBeValid(t, model);
    });


    /**
     * Test field validators: presence
     */
    t.it('Should properly check field validators', function(t) {
        for (var i = 0, len = presenceFields.length; i < len; i++) {
            var msg = Ext.String.format(
                'Should not be valid if {0} is null',
                presenceFields[i]
            );
            (function(field) {

                t.it(msg, function(t) {
                    modelShouldBeValid(t, model);
                    model.set(field, null);
                    modelShouldBeInvalid(t, model);
                });

            })(presenceFields[i]);
        }
    });

    /**
     * Test EntityName
     */
    t.it('Should return proper value for toUrl', function(t) {
        t.expect(model.toUrl()).toBe(model.get('route'));
    });

});
