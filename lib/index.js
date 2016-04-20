"use strict";

const generateSass = argv => {
  console.log(argv);
  const
    gonzales = require('gonzales-pre'), 
    walk = require('walk'),
    fs = require('fs'),
    path = require('path'),
    srcDir = argv.i || process.cwd(),
    packageDir = argv.o,
    packageName = argv.n,
    walker = walk.walk(srcDir, {
      followLinks: false,
      filters: ['node_modules']
    });

  let files = [], platforms = [];

  walker.on("file", (root, fileStats, next) => {
    const fspath = path.join(root, fileStats.name);
    fs.readFile(fspath, () => {
      const filterFunc = item => {
        return fileStats.name.indexOf(item) > -1 ? true : false;
      }
      // decide if the file type is what we are looking for
      // decide if this file matches filter strings
      if (argv.filterStr.filter(filterFunc).length > 0
          && argv.filterType.indexOf(fileStats.name.split('.')[1]) > -1) {
        const platform = argv.filterPlatform.filter(filterFunc)[0] || 'base';
        files = files.concat({
          'name': fileStats.name.split('.')[0],
          'path': fspath,
          'platform': platform
        });
        platforms = platforms.concat(platform);
      }

      next();
    });
  });

  walker.on("end", () => {
    let result = {};

    files.forEach( file => {
      [ ...new Set(platforms) ].forEach( platform => {
        if (!result[platform]) result[platform] = [];
        if (file.platform === platform ) {
          result[platform] = result[platform].concat(`\n/* Source File ${file.platform} : ${file.path} */\n`).concat(fs.readFileSync(file.path, { encoding: 'utf8' }).replace(/@import/g, '//@import'));
        }
      })
    });

    for (const platform in result) {
      if (result.hasOwnProperty(platform)) {
        fs.writeFile(`${packageDir}/${packageName}.${platform}.scss`, result[platform].join(''), function (err) {
          if (err) return console.log(err);
        });
      }
    }
    console.log("all done");
  });
}

exports.generateSass = generateSass;
