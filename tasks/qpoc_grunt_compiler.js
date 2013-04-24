// Generated by CoffeeScript 1.6.2
(function() {
  'use strict';
  var child_process, exec, path;

  path = require('path');

  child_process = require('child_process');

  exec = child_process.exec;

  module.exports = function(grunt) {
    return grunt.registerMultiTask('qpoc_closure_compiler', 'Google Closure Compiler task.', function() {
      var done, execCalcDeps, mod, options, progCalcDeps, success, workspace, _i, _j, _len, _len1, _ref, _ref1;
      done = this.async();
      success = true;
      options = this.options({
        closureCompiler: process.env.CLOSURE_COMPILER,
        closureLibrary: process.env.CLOSURE_LIBRARY,
        javaPath: 'java',
        workspaces: [],
        includeClosureLibrary: true,
        modules: [],
        level: {
          advanced: false,
          simple: true
        },
        prettyPrint: true,
        outputDir: './tmp/',
        modulePrefix: '',
        sourceMaps: false
      });
      grunt.verbose.writeflags(options, 'Options');
      if (typeof options.closureCompiler === 'undefined') {
        throw new Error('Closure Compiler path not set. Use Configuration or' + 'set an environment variable: CLOSURE_COMPILER');
      }
      if (typeof options.closureLibrary === 'undefined') {
        throw new Error('Closure Library path not set. Use Configuration (closureLibrary) ' + 'or set an environment variable: CLOSURE_LIBRARY');
      }
      progCalcDeps = path.join(options.closureLibrary, 'closure/bin/calcdeps.py');
      execCalcDeps = [progCalcDeps];
      if (options.includeClosureLibrary) {
        options.workspaces.push({
          path: options.closureLibrary
        });
      }
      _ref = options.workspaces;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        workspace = _ref[_i];
        execCalcDeps.push('--path ' + workspace.path);
      }
      _ref1 = options.modules;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        mod = _ref1[_j];
        execCalcDeps.push('--input ' + mod.path);
      }
      execCalcDeps.push('--output_mode list');
      return exec(execCalcDeps.join(' '), function(err, stdout, stderr) {
        var currentIndex, execCompiler, files, jsFile, lastIndex, lines, modCommand, modIndex, modMap, modPath, _k, _l, _len2, _len3, _ref2;
        if (err || stderr.match(/Error/)) {
          grunt.log.error(err || stderr);
          success = false;
          return done(success);
        } else {
          lines = stdout.split('\n');
          modMap = [];
          lastIndex = 0;
          files = 0;
          _ref2 = options.modules;
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            mod = _ref2[_k];
            modPath = path.relative(process.cwd(), mod.path);
            modIndex = 1 + lines.indexOf(modPath);
            currentIndex = modIndex - lastIndex;
            lastIndex = modIndex;
            files += currentIndex;
            modCommand = '--module ' + mod.name + ':' + currentIndex;
            if (typeof mod.dependencies !== 'undefined') {
              modCommand += ':' + mod.dependencies.join(',');
            }
            modMap.push(modCommand);
          }
          execCompiler = [options.javaPath, '-jar', options.closureCompiler];
          if (options.level.advanced) {
            execCompiler.push('--compilation_level ADVANCED_OPTIMIZATIONS');
          }
          Array.prototype.push.apply(execCompiler, modMap);
          execCompiler.push('--module_output_path_prefix ' + path.join(options.outputDir, options.modulePrefix));
          for (_l = 0, _len3 = lines.length; _l < _len3; _l++) {
            jsFile = lines[_l];
            if (jsFile !== '') {
              execCompiler.push('--js ' + jsFile);
            }
          }
          if (options.sourceMaps) {
            execCompiler.push("--create_source_map " + options.outputDir + "/module.js.map");
            execCompiler.push('--source_map_format=V3');
          }
          if (options.prettyPrint) {
            execCompiler.push('--formatting pretty_print');
          }
          grunt.log.debug(execCompiler.join('\n'));
          return exec(execCompiler.join(' '), function(err, stdout, stderr) {
            var errorNum, errorNumStr;
            errorNumStr = stderr.match(/([0-9]+) error/);
            errorNum = 0;
            grunt.log.debug('Error: ' + err);
            grunt.log.debug('Stdout: ' + stdout);
            grunt.log.debug('Stderr: ' + stderr);
            if (errorNumStr) {
              errorNum = parseInt(errorNumStr[1], 10);
            }
            if (errorNum > 0 || err) {
              success = false;
              grunt.log.error(stderr);
            }
            return done(success);
          });
        }
      });
    });
  };

}).call(this);
