#!/usr/bin/env node

const
fs = require('fs'),
argv = require('yargs')
  .usage('Usage: sass-stylesheet [options]')
  .config('settings', function (configPath) {
    // console.log(configPath, fs.readFileSync(`${process.cwd()}/config.json`, 'utf-8'));
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
    }
  })
  .argv;

const lib= require('../lib/index.js');

lib.generateSass(argv);
