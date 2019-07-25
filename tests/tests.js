require.config({
    paths: {
        music21: '../src/music21',
        qunit: '../tests/qUnit/qunit-2.0.1',
        m21Tests: '../build/music21.tests',
    },
    baseUrl: '../src',
    shim: {
        qunit: {
            exports: 'QUnit',
            init() {
                QUnit.config.autoload = false;
                QUnit.config.autostart = false;
            },
        },
    },
});

require(['music21', 'qunit', 'm21Tests'], (music21, QUnit, m21Tests) => {
    const globalThis = typeof window !== 'undefined' ? window : global;
    globalThis.music21 = music21;
    for (const testModule in m21Tests) {
        if (typeof m21Tests[testModule] === 'function') {
            const testSuite = m21Tests[testModule];
            testSuite();
        }
    }
    QUnit.load();
    QUnit.start();
});
