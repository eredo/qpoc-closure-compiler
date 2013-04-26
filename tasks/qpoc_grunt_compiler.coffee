'use strict';

path = require 'path'
child_process = require 'child_process'
exec = child_process.exec

module.exports = (grunt) ->

  grunt.registerMultiTask 'qpoc_closure_compiler', 'Google Closure Compiler task.', () ->
    done = @async()
    success = true

    options = @options({
      closureCompiler: process.env.CLOSURE_COMPILER,
      closureLibrary: process.env.CLOSURE_LIBRARY,
      javaPath: 'java',
      workspaces: [],
      includeClosureLibrary: true,
      modules: [],
      defines: {},
      level: {
        advanced: false,
        simple: true
      },
      prettyPrint: true
      outputDir: './tmp/'
      modulePrefix: '',
      sourceMaps: false
    })

    grunt.log.debug 'Start closure compiler export.'
    grunt.log.debug JSON.stringify(options, null, 2)

    grunt.verbose.writeflags options, 'Options';

    # Check if required options are set
    if typeof options.closureCompiler == 'undefined'
      grunt.log.error 'Closure Compiler path not set. Use Configuration or' +
        'set an environment variable: CLOSURE_COMPILER'

    if typeof options.closureLibrary == 'undefined'
      grunt.log.error 'Closure Library path not set. Use Configuration (closureLibrary) ' +
        'or set an environment variable: CLOSURE_LIBRARY'


    progCalcDeps = path.join options.closureLibrary, 'closure/bin/calcdeps.py'

    # Build the command for executing the calculate deps
    execCalcDeps = [progCalcDeps]

    # Check if the closure library should be used in paths too
    if options.includeClosureLibrary
      options.workspaces.push {path: options.closureLibrary}

    # Add all workspaces
    execCalcDeps.push '--path ' + workspace.path for workspace in options.workspaces

    # If modules are used add the input parameter
    execCalcDeps.push '--input ' + mod.path for mod in options.modules

    # Output mode for working with the list
    execCalcDeps.push '--output_mode list'

    grunt.log.debug 'Run DepsCalculator script: ' + execCalcDeps.join(' ')
    exec execCalcDeps.join(' '), (err, stdout, stderr) ->
      if err || stderr.match(/Error/)
        grunt.log.error err || stderr
        success = false
        done(success)
      else
        lines = stdout.split '\n'

        grunt.log.debug 'Dependencies calculated: ' + lines.join(' ')

        # Build the module map by checking each line of the result
        # and add those to the modules array
        modMap = []
        lastIndex = 0
        files = 0

        # Run through the modules and check the position of the path
        for mod in options.modules
          modPath = path.relative process.cwd(), mod.path
          modIndex = 1 + lines.indexOf modPath
          currentIndex = modIndex - lastIndex
          lastIndex = modIndex
          files += currentIndex
          modCommand = '--module ' + mod.name + ':' + currentIndex
          if typeof mod.dependencies != 'undefined'
            modCommand += ':' + mod.dependencies.join ','

          modMap.push modCommand

        # Build the command to run the compiler
        execCompiler = [options.javaPath, '-jar', options.closureCompiler]

        if options.level.advanced
          execCompiler.push '--compilation_level ADVANCED_OPTIMIZATIONS'
        else if options.level.simple
          execCompiler.push '--compilation_level SIMPLE_OPTIMIZATIONS'

        Array.prototype.push.apply execCompiler, modMap
        execCompiler.push '--module_output_path_prefix ' + path.join(options.outputDir, options.modulePrefix)

        # Add all JS files
        execCompiler.push '--js ' + jsFile for jsFile in lines when jsFile != ''

        # Add all defines
        for defKey, defVal of options.defines
          execCompiler.push "--define \"#{ defKey }=#{ defVal }\""

        if options.sourceMaps
          execCompiler.push "--create_source_map #{ options.outputDir }/module.js.map"
          execCompiler.push '--source_map_format=V3'

        if options.prettyPrint
          execCompiler.push '--formatting pretty_print'

        grunt.log.debug execCompiler.join('\n')

        exec execCompiler.join(' '), (err, stdout, stderr) ->
          errorNumStr = stderr.match(/([0-9]+) error/);
          errorNum = 0

          grunt.log.debug 'Error: ' + err
          grunt.log.debug 'Stdout: ' + stdout
          grunt.log.debug 'Stderr: ' + stderr

          if errorNumStr
            errorNum = parseInt(errorNumStr[1], 10);

          if errorNum > 0 || err
            success = false
            grunt.log.error stderr

          done success
