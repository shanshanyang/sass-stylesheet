#!/usr/bin/env node

const argv = require('../lib/cli');
const lib= require('../lib/index.js');
const libast = require('../lib/index.ast.js');

if (argv.settings) {
  lib.generateSass(argv);
} else {
  libast.parse(argv);
}
