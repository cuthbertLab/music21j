require.config({
    paths: {
        'music21': '../src/music21',
        'qunit': '../tests/qUnit/qunit-2.0.1',
    },
    baseUrl: '../src',
    shim: {
        'qunit': {
            exports: 'QUnit',
            init: function() {
                QUnit.config.autoload = false;
                QUnit.config.autostart = false;
            }
        } 
     }
});

require(['music21','qunit'], function (music21, QUnit) {
    for (var module in music21) {
        if (typeof(music21[module].tests) == 'function') {
            var testSuite = music21[module].tests;
            testSuite();
        }
    }
    QUnit.load();
    QUnit.start();
});

