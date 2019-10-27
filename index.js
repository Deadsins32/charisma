var child_process = require('child_process');
var child = child_process.spawn('node', ['./src/bot.js']);
child.stdout.pipe(process.stdout);

var config = require('./config.json');
var io = require('socket.io').listen(config.hostPort);
var fs = require('fs');
var syncFs = require('./src/core/syncFs.js');

var list = new Array();

var path = require('path');
var rimraf = require('rimraf');

var config = require('./src/config/config.json');

function ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) { return true }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

io.on('connection', function(socket) {
    socket.on('update', function(files) {
        config = require('./src/config/config.json');
        rimraf.sync('./*');
        list = files;
        child.on('close', function() { socket.emit('request', list[0]) });
        child.kill('SIGINT');
    });

    socket.on('fulfill', function(path, data) {
        list.shift();
        ensureDirectoryExistence(path);
        fs.writeFileSync(path, data);
        if (list.length != 0) { socket.emit('request', list[0]) }
        else {
            fs.writeFileSync('./src/config/config.json', JSON.stringify(config, null, 4));
            socket.emit('doneFiles');
        }
    });

    socket.on('npmInstall', function() {
        var windowsEnviroment = require('os').platform() == 'win32';
        var cmd = 'npm';
        if (windowsEnviroment) { cmd = 'npm.cmd' }
        var installProcess = child_process.spawn(cmd, ['install']);
        installProcess.stdout.setEncoding('utf-8');
        installProcess.stdout.pipe(process.stdout);
        installProcess.on('exit', function() {
            socket.emit('botStart');
            child = child_process.spawn('node', ['src/bot.js']);
            child.on('error', function(error) { console.log(error) })
            child.stdout.pipe(process.stdout);
        });
    });
});

process.on('SIGINT', function() { io.close() }.bind());
