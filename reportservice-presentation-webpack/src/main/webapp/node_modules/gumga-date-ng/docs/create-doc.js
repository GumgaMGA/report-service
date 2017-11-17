var fs = require('fs');
var path = require('path');
var versions = require('./versions.json');

var copyRecursiveSync = function(src, dest) {
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);
  var isDirectory = exists && stats.isDirectory();
  if (exists && isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName),
                        path.join(dest, childItemName));
    });
  } else {
    fs.linkSync(src, dest);
  }
};

// var deleteFolderRecursive = function(path) {
//   if( fs.existsSync(path) ) {
//     fs.readdirSync(path).forEach(function(file,index){
//       var curPath = path + "/" + file;
//       if(fs.lstatSync(curPath).isDirectory()) { // recurse
//         deleteFolderRecursive(curPath);
//       } else { // delete file
//         fs.unlinkSync(curPath);
//       }
//     });
//     fs.rmdirSync(path);
//   }
// };

copyRecursiveSync(`./docs/${versions[versions.length -2]}`, `./docs/${versions[versions.length -1]}`);


// deleteFolderRecursive(`./docs/${versions[versions.length -1]}/dist`);
