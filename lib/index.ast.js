"use strict";

const generateSassAST = argv => {
  console.log(argv);
  const
    gonzales = require('gonzales-pe'), 
    walk = require('walk'),
    fs = require('fs'),
    path = require('path'),
    srcDir = argv.i || process.cwd(),
    packageDir = argv.o,
    packageName = argv.n,
    filterType = argv.filterType || ['scss'],
    walker = walk.walk(srcDir, {
      followLinks: false,
      filters: ['node_modules']
    });
    
    
    let finalTree = [];
    walker.on("file", (root, fileStats, next) => {
        const fspath = path.join(root, fileStats.name);
    if (filterType.indexOf(fileStats.name.split('.')[1]) === -1) { 
        next();
    } else {
        fs.readFile(fspath, 'utf8', (err, data) => {
            if (err) throw err;
                
            const parseTree = gonzales.parse(data,{syntax:'scss'});
            
            // finalTree.push(gonzales.createNode({type: 'multilineComment', content: `source file: ${fspath}`}));
            // finalTree.push(gonzales.createNode({type: 'space', content: '\n\n'}));

            // parseTree.traverse(function(node, index, parent) {
            //     if (node.is('variable') || node.is('placeholder')) {
            //         console.log(node, typeof node.is('variable'));
            //     }
            //     if (!node.is('mixin')) {
            //         console.log("\n Not Mixin",index, node);
            //         parent.removeChild(index);
            //     }
            // });
            let types = ['multilineComment', 'singlelineComment', 'class', 'id', 'attributeSelector'];
            parseTree.traverseByTypes(types, function(node, index, parent) {
                parent.removeChild(index);
            });
            
            // if (uglify) {
            //     // keep comments and spaces
            // } else {
            //     // minify the code
            // }
            finalTree.push(parseTree);

            next();
        });
    }
  });
  
    walker.on("end", () => {
    //  console.log(finalTree[1]);
        const content = finalTree.reduce((prev, current) => {
            return prev + current.toString();
        });
        
        fs.writeFile(`./${packageName}.scss`, content, function (err) {
        if (err) return console.log(err);
        });
    });
}

exports.generateSassAST = generateSassAST;