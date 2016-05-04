'use strict';
// Get all level-1 mixins
const gonzales = require('gonzales-pe');

const mixinAST = (node, index, parent) => {
  let mixins = [];
  if (node.is('mixin')
    && parent.type === 'stylesheet'
  ) {
    mixins.push(node);
    // add line break
    mixins.push(gonzales.createNode({
      type: 'space',
      content: '\n',
      syntax: 'scss'
    }))
  }
  return mixins;
}

module.exports = (node, index, parent) => mixinAST(node, index, parent);
