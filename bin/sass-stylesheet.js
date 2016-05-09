#!/usr/bin/env node

const argv = require('../lib/cli');
const libast = require('../lib/index.ast.js');

libast.parse(argv);
