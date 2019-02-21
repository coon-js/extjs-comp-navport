var harness = new Siesta.Harness.Browser.ExtJS();

harness.configure({
    title          : 'app-cn_navport',
    disableCaching : true,
    loaderPath     : {

        'coon.test.view.mock' : './classic/src/view/mock',

        /**
         * Universal
         */
        'coon.navport' : '../src',
        'coon.navport.view.controller.NavigationToolbarViewController' : '../src/view/controller/NavigationToolbarViewController.js',
        'coon.navport.view.controller.NavigationViewportController' : '../src/view/controller/NavigationViewportController.js',



        /**
         * Classic
         */
        'coon.navport.view' : '../classic/src/view',

        /**
         * Requirements
         */
        'coon.core.app'       : '../../lib-cn_core/src/app',
        'coon.core.data'      : '../../lib-cn_core/src/data',
        'coon.comp.container' : '../../lib-cn_comp/classic/src/container',
        'coon.comp.app'       : '../../lib-cn_comp/src/app',
        'coon.comp.list'      : '../../lib-cn_comp/classic/src/list',
        'coon.comp.window'    : '../../lib-cn_comp/classic/src/window'
    },
    preload        : [
        coon.tests.config.paths.extjs.css.url,
        coon.tests.config.paths.extjs.js.url
    ]
});

harness.start({
    group : 'classic',
    items : [{
        group : 'view',
        items : [
            './classic/src/view/ContentContainerTest.js',
            './classic/src/view/ContentWrapTest.js',
            './classic/src/view/NavigationToolbarTest.js',
            './classic/src/view/NavigationTreeTest.js',
            './classic/src/view/NavigationViewportTest.js',{
            group : 'controller',
            items : ['./classic/src/view/controller/NavigationViewportControllerTest.js']
        }, {
            group : 'pages',
            items : ['./classic/src/view/pages/Page404Test.js']
        }, {
                group : '(isolated tests)',
                items : [
                    './classic/src/view/NavigationViewportIsolatedTest_1.js',
                    './classic/src/view/NavigationViewportIsolatedTest_2.js',
                    './classic/src/view/NavigationViewportIsolatedTest_3.js',
                    './classic/src/view/NavigationViewportIsolatedTest_4.js'
                ]
            }]
    }]


}, {
    group : 'universal',
    items : [{
        group : 'app',
        items : [
            'src/app/PackageControllerTest.js'
        ]
    },{
        group : 'data',
        items : [{
            group : 'schema',
            items : [
                'src/data/schema/BaseSchemaTest.js'
            ]
        }]
    }, {
        group : 'mixin',
        items : [
            'src/mixin/ViewportManageableTest.js'
        ]
    }, {
        group : 'model',
        items : [
            'src/model/NavigationModelTest.js'
        ]
    }, {
        group : 'store',
        items : [
            'src/store/NavigationTreeStoreTest.js'
        ]
    }, {
        group : 'view',
        items : [{
            group : 'controller',
            items : [
                'src/view/controller/NavigationToolbarViewControllerTest.js'
            ]
        }]
    }]
});
