/*
 * grunt-qpoc-closure-compiler
 * https://github.com/Eric/qpoc-closure-compiler
 *
 * Copyright (c) 2013 Eric Schneller
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    qpoc_closure_compiler: {
      run_success: {
        options: {
          level: {
            advanced: true
          },
          sourceMaps: true,
          prettyPrint: false,
          modulePrefix: 'module_',
          workspaces: [
            {
              path: './test/lib'
            }
          ],
          modules: [
            {
              path: './test/lib/init.js',
              name: 'app'
            },
            {
              path: './test/lib/test.js',
              name: 'test',
              dependencies: ['app']
            },
            {
              path: './test/lib/module_sec.js',
              name: 'secound',
              dependencies: ['app']
            }
          ]
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'qpoc_closure_compiler', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
