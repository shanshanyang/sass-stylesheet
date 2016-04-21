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
    uglify = argv.u,
    filterType = argv.filterType || ['scss'],
    nodeTypes = ['global', 'mixin', 'variable', 'placeholder', 'function'],
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
            // add Meta info 
            parseTree.insert(0, gonzales.createNode({type: 'multilineComment', content: `source file: ${fspath}`, syntax: 'scss'}));
            parseTree.insert(1, gonzales.createNode({type: 'space', content: '\n', syntax: 'scss'}));          

            finalTree.push(parseTree.first('multilineComment'));
            finalTree.push(parseTree.first('space'));
            
            parseTree.traverse( (node, index, parent) => {
                // Get all level-1 atrules
                if (node.is('atrule')
                    && parent.type === 'stylesheet'
                    && nodeTypes.indexOf(node.content[0].content[0].content) > -1
                ) { 
                    finalTree.push(node);
                    // add line break
                    finalTree.push(gonzales.createNode({
                        type: 'space',
                        content: '\n',
                        syntax: 'scss'
                    }))
                }
                // ignore variables as argument
                // Get all level-1 variable
                if (node.is('declaration')
                    && parent.type === 'stylesheet'
                    && node.content[0].content[0].type === 'variable'
                ) {
                    finalTree.push(node);
                    // add comma
                    finalTree.push(gonzales.createNode({
                        type: 'declarationDelimiter',
                        content: ';',
                        syntax: 'scss'
                    }))
                    // add line break
                    finalTree.push(gonzales.createNode({
                        type: 'space',
                        content: '\n',
                        syntax: 'scss'
                    }))
                }
                
                // Get all level-1 mixins
                if (node.is('mixin')
                    && parent.type === 'stylesheet'
                ) {
                    finalTree.push(node);
                    // add line break
                    finalTree.push(gonzales.createNode({
                        type: 'space',
                        content: '\n',
                        syntax: 'scss'
                    }))
                }
                
                // Bubble up global variable from ruleset
                if (node.is('declaration')
                    && parent.type === 'block'
                    && node.content[3].contains('global')
                ) {
                    node.content[3].traverse( (node, index, parent) => {
                        if (node.is('global')
                            || node.is('space')
                        ) {
                            parent.removeChild(index);
                        }
                    });
                    finalTree.push(node);
                    // add comma
                    finalTree.push(gonzales.createNode({
                        type: 'declarationDelimiter',
                        content: ';',
                        syntax: 'scss'
                    }))
                    // add line break
                    finalTree.push(gonzales.createNode({
                        type: 'space',
                        content: '\n',
                        syntax: 'scss'
                    }))
                }
                
                // Todo: Get all placeholders
                
            });
            
            if (uglify) {
                // minify the code
                finalTree.forEach(node => {
                    node.traverse((node, index, parent) => {
                        if (node.is('space')
                            && node.content.indexOf('\n') > -1
                        ) {
                            if (!parent) {
                                node.content = '';
                            } else {
                                parent.removeChild(index);
                            }
                        }
                    }); 
                });
            }
            // finalTree.push(parseTree);

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