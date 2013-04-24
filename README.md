# grunt-qpoc-closure-compiler

> Extended closure compiler plugin with module support.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-qpoc-closure-compiler --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-qpoc-closure-compiler');
```

## The "qpoc_closure_compiler" task

### Overview
In your project's Gruntfile, add a section named `qpoc_closure_compiler` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  qpoc_closure_compiler: {
    your_mode: {
      options: {
        // Task-specific options go here.

        // path to compiler.jar of google closure compiler
        // default: environment variable CLOSURE_COMPILER
        closureCompiler: './compiler.jar',

        // path to the closure library folder which contains "closure",
        // "third_party" ...
        // default: environment variable CLOSURE_LIBRARY
        closureLibrary: '/closure-library/',

        // Java executable path
        // default: 'java'
        javaPath: 'java',

        // whether automaticaly add the closure library to the pathes
        includeClosureLibrary: true, // default: true

        workspaces: [
          {
            // paths to libraries which are required in your application
            path: './lib/'
          }
          // ... further ones
        ],


        // defines the way you want to split your application
        modules: [
          // define your main module at the start
          // it's required to define one main module which will be the
          // dependency of all further modules
          {
            // path to the initiate script of the module
            path: './lib/init.js',

            // name of the module
            name: 'app'
          },

          {
            path: './lib/the_mod.js',
            name: 'the_mod',
            // array of modules which are required
            dependencies: ['app']
          }
        ],

        level: {
          advanced: true // default is false
        },

        // formatting of the code exported by the compiler
        prettyPrint: false, // default is true

        // path for the generated files
        // default: ./tmp/
        outputDir: '.',

        // prefix for the exported module javascript files.
        // example: module name "app", prefix: "module_"
        // => "#{ outputDir }/module_app.js"
        modulePrefix: '',

        // automaticaly exports a module.js.map into the outputDir
        sourceMaps: true // default: false
      }
    }
  },
})
```

### Options

#### options.closureCompiler
Type: `String`
Default value: environment $CLOSURE_COMPILER

Description following...

** To be continued... Please look at the example above **

## Release History
_(Nothing yet)_
