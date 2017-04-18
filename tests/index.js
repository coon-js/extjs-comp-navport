var harness = new Siesta.Harness.Browser.ExtJS();

harness.configure({
    title          : 'My Tests',
    disableCaching : true,
    loaderPath     : {

        'conjoon.test.view.mock' : './classic/src/view/mock',

        /**
         * Universal
         */
        'conjoon.cn_treenavviewport' : '../src',
        'conjoon.cn_treenavviewport.view.controller.NavigationToolbarViewController' : '../src/view/controller/NavigationToolbarViewController.js',



        /**
         * Classic
         */
        'conjoon.cn_treenavviewport.view' : '../classic/src/view',

        /**
         * Requirements
         */
        'conjoon.cn_core.app'       : '../../lib-cn_core/src/app',
        'conjoon.cn_core.data'      : '../../lib-cn_core/src/data',
        'conjoon.cn_comp.container' : '../../lib-cn_comp/classic/src/container',
        'conjoon.cn_comp.app'       : '../../lib-cn_comp/src/app',
        'conjoon.cn_comp.list'      : '../../lib-cn_comp/classic/src/list',
        'conjoon.cn_comp.window'    : '../../lib-cn_comp/classic/src/window'
    },
    preload        : [
        conjoon.tests.config.paths.extjs.css.url,
        conjoon.tests.config.paths.extjs.js.url
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
                    './classic/src/view/NavigationViewportIsolatedTest_4.js',
                    './classic/src/view/NavigationViewportIsolatedTest_5.js'
                ]
            }]
    }]


}, {
    group : 'universal',
    items : [{
        group : 'data',
        items : [{
            group : 'schema',
            items : [
                'src/data/schema/BaseSchemaTest.js'
            ]
        }]
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
