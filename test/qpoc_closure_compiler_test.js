'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.qpoc_closure_compiler = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  run_success: function(test) {
    test.expect(1);

    var exp = grunt.file.read('./test/expected/module_app.js');
    var res = grunt.file.read('./tmp/module_app.js');

    test.equal(res, exp, 'Module application check');
    test.done();
  }
};
