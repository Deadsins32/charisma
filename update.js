var io = require('socket.io-client');
var config = require('./config.json');

var socket = io.connect(`http://${config.hostIp}:${config.hostPort}`);

var nodePath = require('path');
var syncFs = require('./src/core/syncFs.js');

var rawList = new Array();
var list = new Array();

var excluded = [
    '.git/',
    'node_modules/',
    'docs/',
    'patreon/',
    'src/config/config.json',
    'avatar.png',
]

async function scavenge(path) {
    var items = await syncFs.readDir(path);
    for (i in items) {
        items[i] = `${path}/${items[i]}`;
        if (await syncFs.isFolder(items[i])) { await scavenge(`${items[i]}`) }
        else { rawList.push(nodePath.normalize(`${items[i]}`).replace(/\\/g, '/')) }
    }
}

async function getFiles() {
    await scavenge('./');
    for (var r = 0; r < rawList.length; r++) {
        var isExcluded = false;
        for (var e = 0; e < excluded.length; e++) {
            if (rawList[r].startsWith(excluded[e])) { isExcluded = true }
        }

        if (!isExcluded) { list.push(rawList[r]) }
    }
    
    return list;
}

socket.on('connect', async function() {
    socket.emit('update', await getFiles());
    socket.on('request', async function(path) {
        console.log(`sending ${path}`);
        socket.emit('fulfill', path, await syncFs.readFile(path));
    });

    socket.on('doneFiles', function() {
        console.log('finished all file transfers... starting install script');
        socket.emit('npmInstall');
    });

    socket.on('botStart', function() {
        console.log('finished install script... starting bot');
        socket.close();
    });
});