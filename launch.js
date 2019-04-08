var child_process = require('child_process');
var child = child_process.spawn('node', ['initialize.js']);
child.stdout.pipe(process.stdout);

var io = require('socket.io').listen(531);
var fs = require('fs');
var syncFs = require('./src/core/syncFs.js');

var list = new Array();

var path = require('path');

function ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) { return true }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

io.on('connection', function(socket) {
    socket.on('update', function(files) {
        list = files;
        child.on('close', async function() {
            socket.emit('request', list[0]);
        });

        child.kill();
        child = null;
    });

    socket.on('fulfill', async function(path, data) {
        list.shift();
        ensureDirectoryExistence(path);
        await syncFs.writeFile(path, data);
        if (list.length != 0) { socket.emit('request', list[0]) }
        else {
            socket.emit('done');
            child = child_process.spawn('node', ['initialize.js']);
            child.stdout.pipe(process.stdout);
        }
    });
});