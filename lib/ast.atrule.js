"use strict";

// Get all level-1 atrules
const gonzales = require('gonzales-pe');
const nodeTypes = ['global', 'mixin', 'variable', 'placeholder', 'function'];

const atruleAST = (node, index, parent) => {
  //console.log(node, index, parent);
  let atrules = [];
  if (node.is('atrule')
    && parent.type === 'stylesheet'
    && nodeTypes.indexOf(node.content[0].content[0].content) > -1
  ) {
    atrules.push(node);
    // add line break
    atrules.push(gonzales.createNode({
      type: 'space',
      content: '\n',
      syntax: 'scss'
    }))
  }
  return atrules;
}

module.exports = (node, index, parent) => { return atruleAST(node, index, parent); }
