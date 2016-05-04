'use strict';

// Get all placeholders
const gonzales = require('gonzales-pe');

const placeholderAST = (node, index, parent) => {
  let placeholders = [];
  if (node.is('selector')
    && node.contains('placeholder')
    && !parent.is('extend')
  ) {
    placeholders.push(parent);
    // add line break
    placeholders.push(gonzales.createNode({
      type: 'space',
      content: '\n',
      syntax: 'scss'
    }))
  }
  return placeholders;
}

module.exports = (node, index, parent) => placeholderAST(node, index, parent);
