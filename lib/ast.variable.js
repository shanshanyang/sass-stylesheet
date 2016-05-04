'use strict';

// Get all level-1 variable
const gonzales = require('gonzales-pe');

// ignore variables as argument
const variableAST = (node, index, parent) => {
  let variables = [];
  if (node.is('declaration')
    && parent.type === 'stylesheet'
    && node.content[0].content[0].type === 'variable'
  ) {
    variables.push(node);
    // add comma
    variables.push(gonzales.createNode({
      type: 'declarationDelimiter',
      content: ';',
      syntax: 'scss'
    }))
    // add line break
    variables.push(gonzales.createNode({
      type: 'space',
      content: '\n',
      syntax: 'scss'
    }))
  }

  // Bubble up global variable from ruleset
  if (node.is('declaration')
    && parent.type === 'block'
    ) {
    node.forEach((n, index) => {
      if (typeof n.content === 'object'
        && n.contains('global')
      ) {
        node.traverse((node, index, parent) => {
          if (node.is('global')
            || node.is('space')
          ) {
            parent.removeChild(index);
          }
        });
        // add Node
        variables.push(node);
        // add comma
        variables.push(gonzales.createNode({
          type: 'declarationDelimiter',
          content: ';',
          syntax: 'scss'
        }))
        // add line break
        variables.push(gonzales.createNode({
          type: 'space',
          content: '\n',
          syntax: 'scss'
        }))
      }
    });
    }

  return variables;
}

module.exports = (node, index, parent) => variableAST(node, index, parent);
