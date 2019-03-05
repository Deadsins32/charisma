var fs = require('fs');

module.exports = {
    readDir: function(path) {
        return new Promise(function(resolve, reject) {
            fs.readdir(path, function(error, files) {
                if (error) { reject(error) }
                else { resolve(files) }
            });
        });
    },

    writeFile: function(path, data) {
        return new Promise(function(resolve, reject) {
            fs.writeFile(path, data, function(error) {
                if (error) { reject(error) }
                else { resolve(true) }
            });
        });
    },

    createDirectory: function(path) {
        return new Promise(function(resolve, reject) {
            fs.mkdir(path, function(error) {
                if (error) { reject(error) }
                else { resolve(true) }
            });
        });
    },

    exists: function(path) {
        return new Promise(function(resolve, reject) {
            fs.exists(path, function(bool) { resolve(bool) });
        });
    }
}