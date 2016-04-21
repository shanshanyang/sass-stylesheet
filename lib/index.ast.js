"use strict";

const generateSassAST = argv => {
  const
    gonzales = require('gonzales-pe'), 
    walk = require('walk'),
    fs = require('fs'),
    chalk = require('chalk'),
    log_error = chalk.bold.red,
    log_warning = chalk.bold.yellow,
    log_success = chalk.bold.green,
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
        const fspath = path.join(root, fileStats.name),
            length = finalTree.length;
    if (filterType.indexOf(fileStats.name.split('.')[1]) === -1) { 
        next();
    } else {
        fs.readFile(fspath, 'utf8', (err, data) => {
            if (err) throw err;
                
            const parseTree = gonzales.parse(data,{syntax:'scss'});

            parseTree.traverse( (node, index, parent) => {
                // cleanup 
                if (node.is('multilineComment')
                    || node.is('singlelineComment')
                ){
                    parent.removeChild(index);
                }
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
                ) {
                   node.forEach( (n,index) => {
                        if (typeof n.content === 'object'
                            && n.contains('global')
                        ) {
                            node.traverse( (node, index, parent) => {
                                if (node.is('global')
                                    || node.is('space')
                                ) {
                                    parent.removeChild(index);
                                }
                            });
                            // add Node
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
                    });
                }
                
                // Get all placeholders
                if (node.is('selector')
                    && node.contains('placeholder')
                    && !parent.is('extend')
                ) {
                    finalTree.push(parent);
                    // add line break
                    finalTree.push(gonzales.createNode({
                        type: 'space',
                        content: '\n',
                        syntax: 'scss'
                    }))
                }
                
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
            } else {
                // add Meta info 
                if (finalTree.length > length) {
                    finalTree.splice(length, 0, gonzales.createNode({type: 'multilineComment', content: `source file: ${fspath}`, syntax: 'scss'}));
                    finalTree.splice(length+1, 0, gonzales.createNode({type: 'space', content: '\n', syntax: 'scss'}));
                }
            }
            
            next();
        });
    }
  });
  
    walker.on("end", () => {
        if (finalTree.length === 0) { return console.log(log_warning('Warning: No SCSS source file found')); }
    
        const content = finalTree.reduce((prev, current) => {
            return prev + current.toString();
        });
        
        fs.writeFile(`./${packageName}.scss`, content, function (err) {
            
            if (err) return console.log(log_error(err) );
            return console.log(log_success(`LOG: Ouput ./${packageName}.scss`))
        });
    });
}

exports.generateSassAST = generateSassAST;