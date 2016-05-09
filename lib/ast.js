'use strict';

module.exports.parse = (node, index, parent) => {
  const atrule = require('./ast.atrule')(node, index, parent);
  const mixin = require('./ast.mixin')(node, index, parent);
  const placeholder = require('./ast.placeholder')(node, index, parent);
  const variable = require('./ast.variable')(node, index, parent);

  let arr = [];

  if (atrule.length > 0) {
    arr = arr.concat(atrule);
  }

  if (mixin.length > 0) {
    arr = arr.concat(mixin);
  }

  if (placeholder.length > 0) {
    arr = arr.concat(placeholder);
  }

  if (variable.length > 0) {
    arr = arr.concat(variable);
  }

  return arr;
}
