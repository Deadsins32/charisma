var io = require('socket.io-client');
var socket = io.connect('http://localhost:531');

var nodePath = require('path');
var syncFs = require('./src/core/syncFs.js');

var rawList = new Array();
var list = new Array();

var excluded = [
    '.git/',
    'node_modules/',
    'docs/',
    'patreon/',
    'data/guilds/',
    'data/users/',
    'data/defaults.json',
    'avatar.png',
    'update.js'
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

    socket.on('done', function() {
        console.log('finished all file transfers');
        socket.disconnect();
    });
});