var testCase = require('./task');
testCase.setUp = function(done){
    this.destination = 'doc/basic';
    this.expectedFiles = [
        'index.html',
        'jsdoc-plugin.js.html',
        'module-tasks_jsdoc-plugin.html',
        'lib_exec.js.html',
        'module-exec.html'
    ];
    done();
};

exports.JsDocBasicTest = testCase;
