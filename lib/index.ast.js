'use strict';

const sassAST = argv => {
  const gonzales = require('gonzales-pe'),
    walk = require('walk'),
    fs = require('fs'),
    chalk = require('chalk'),
    ast = require('./ast'),
    log_error = chalk.bold.red,
    log_warning = chalk.bold.yellow,
    log_success = chalk.bold.green,
    path = require('path'),
    packageDir = argv.o || process.cwd(),
    packageName = argv.n,
    uglify = argv.u,
    srcDir = argv.i || process.cwd(),
    filterType = argv.filterType || ['scss'],
    nodeTypes = ['global', 'mixin', 'variable', 'placeholder', 'function'],
    walker = walk.walk(srcDir, {
      followLinks: false,
      filters: ['node_modules']
    });

  let finalTree = [];

  const fileHandler = (root, fileStats, next) => {
    const fspath = path.join(root, fileStats.name),
      length = finalTree.length;
    if (filterType.indexOf(fileStats.name.split('.')[1]) === -1) {
      next();
    } else {
      fs.readFile(fspath, 'utf8', (err, data) => {
        if (err) throw err;

        const parseTree = gonzales.parse(data, { syntax: 'scss' });
        let fileTree = [];

        parseTree.traverse((node, index, parent) => {
          // cleanup
          if (node.is('multilineComment')
            || node.is('singlelineComment')
          ) {
            parent.removeChild(index);
          }

          fileTree = fileTree.concat(ast.parse(node, index, parent));

        });

        if (uglify) {
          // minify the code
          fileTree.forEach((node,i) => {
            node.traverse((node, index, parent) => {
              if (node.is('space')
                && node.content.indexOf('\n') > -1
              ) {
                  if (parent) {
                    parent.removeChild(index);
                  } else {
                    fileTree.splice(i,1);
                  }
              }
            });
          });
        }

        finalTree = finalTree.concat(fileTree);

        if (!uglify && finalTree.length > length) {
            finalTree.splice(length, 0, gonzales.createNode({ type: 'multilineComment', content: `source file: ${fspath}`, syntax: 'scss' }));
            finalTree.splice(length + 1, 0, gonzales.createNode({ type: 'space', content: '\n', syntax: 'scss' }));
        }

        next();
      });
    }
  }

  const endHandler = () => {
    if (finalTree.length === 0) { return console.log(log_warning('Warning: No SCSS source file found')); }
    const content = finalTree.reduce((prev, current) => {
      return prev + current.toString();
    });

    fs.writeFile(`${packageDir}/${packageName}.scss`, content, function (err) {
      if (err) return console.log(log_error(err));
      return console.log(log_success(`LOG: Ouput ${packageDir}/${packageName}.scss`))
    });
  }

  walker.on("file", fileHandler);
  walker.on("end", endHandler);
}
module.exports.parse = sassAST;
