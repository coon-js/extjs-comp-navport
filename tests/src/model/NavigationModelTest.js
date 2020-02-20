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

describe('coon.navport.model.NavigationModelTest', function(t) {


// +----------------------------------------------------------------------------
// |                    =~. Unit Tests .~=
// +----------------------------------------------------------------------------

    var model,
        modelName = 'coon.navport.model.NavigationModel',
        getModelBaseClass = function() {
            return eval('Ext.data.TreeModel');
        },
        getSchemaClass = function() {
            return coon.navport.data.schema.BaseSchema;
        },
        entityName = 'NavigationModel',
        data = {
            route    : 'myroute',
            text     : 'NavigationText',
            view     : 'ViewClass',
            packageController : 'MyController'
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


    /**
     * Test Field packageController
     */
    t.it('Should have packageController-field configured', function(t) {

        t.expect(model.getField("packageController")).toBeDefined();
        t.expect(model.getField("packageController").type).toBe("string");

    });


    /**
     * Test Field inheritNodeNav
     */
    t.it('Should have inheritNodeNav-field configured', function(t) {

        t.expect(model.getField("inheritNodeNav")).toBeDefined();
        t.expect(model.getField("inheritNodeNav").type).toBe("bool");
        t.expect(model.getField("inheritNodeNav").defaultValue).toBe(false);

    });


});
