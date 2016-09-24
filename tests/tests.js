require.config({
    paths: {
        'music21': '../src/music21',
        'qunit': '../tests/qUnit/qunit-2.0.1',
        'm21Tests': '../build/music21.tests',
        'es6Shim': '../ext/es6-shim',
    },
    baseUrl: '../src',
    shim: {
        'qunit': {
            exports: 'QUnit',
            deps: ['es6Shim'],
            init: function() {
                QUnit.config.autoload = false;
                QUnit.config.autostart = false;
            }
        } 
     }
});

require(['es6Shim', 'music21','qunit', 'm21Tests'], 
        function (music21, QUnit, m21Tests) {
    for (var testModule in m21Tests) {
        if (typeof(m21Tests[testModule]) == 'function') {
            var testSuite = m21Tests[testModule];
            testSuite();
        }        
    }
    QUnit.load();
    QUnit.start();
});

