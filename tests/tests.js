require.config({
    paths: {
        'music21': '../src/music21',
        'q-unit': '../ext/qUnit/qunit-1.12.0',
    },
    baseUrl: '../src',
    shim: {
        'q-unit': {
            exports: 'QUnit',
            init: function() {
                QUnit.config.autoload = false;
                QUnit.config.autostart = false;
            }
        } 
     }
});

require(['music21','q-unit'], function () {
    for (var module in music21) {
        if (typeof(music21[module].tests) == 'function') {
            var testSuite = music21[module].tests;
            testSuite();
        }
    }
    
    QUnit.load();
    QUnit.start();

});

