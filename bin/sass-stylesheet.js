#!/usr/bin/env node

const
fs = require('fs'),
argv = require('yargs')
  .usage('Usage: sass-stylesheet [options]')
  .config('settings', function (configPath) {
    const defaultConfig = {
      "filterStr": ["placeholder", "variables", "mixins"],
      "filterType": ["scss"],
      "filterPlatform": ["desktop", "mobile"]
    };
    return configPath ? JSON.parse(fs.readFileSync(configPath, 'utf-8')) : defaultConfig;
  })
  .options({
    'i': {
      alias: 'input',
      demand: true,
      describe: 'Provide source directory path as input',
      type: 'string'
    },
    'o': {
      alias: 'output',
      demand: false,
      default: `${process.cwd()}`,
      describe: 'Provide output directory path, relative to current directory',
      type: 'string'
    },
    'n': {
      alias: 'name',
      demand: false,
      default: 'global',
      describe: 'Provide Output File name prefix',
      type: 'string'
    },
    'u': {
      alias: 'uglify',
      demand: false,
      default: false,
      describe: 'Minify scss',
      type: 'boolean'
    }
  })
  .argv,
// gonzales = require('gonzales-pe'), 
walk = require('walk'),
// fs = require('fs'),
// chalk = require('chalk'),
// log_error = chalk.bold.red,
// log_warning = chalk.bold.yellow,
// log_success = chalk.bold.green,
// path = require('path'),
srcDir = `${process.cwd()}/${argv.i}`,
// packageDir = argv.o,
// packageName = argv.n,
// uglify = argv.u,
// filterType = argv.filterType || ['scss'],
// nodeTypes = ['global', 'mixin', 'variable', 'placeholder', 'function'],
walker = walk.walk(srcDir, {
  followLinks: false,
  filters: ['node_modules']
}),
lib = require('../lib/index.ast.js');
console.log(srcDir, argv);

walker.on("file", lib.config(argv).fileHandler);
walker.on("end", lib.config(argv).endHandler);


// const lib= require('../lib/index.js');
// const libast = require('../lib/index.ast.js');

// if (argv.settings) {
//   lib.generateSass(argv);
// } else {
//   libast.generateSassAST(argv);
// }
