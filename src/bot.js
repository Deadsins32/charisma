var Discord = require('discord.js');

var config = require('./config/config.json');
var syncFs = require('./core/syncFs.js');
var readDir = syncFs.readDir;
var isFolder = syncFs.isFolder;
var writeFile = syncFs.writeFile;

async function start() {
    var commandData = new Object();
    async function scavenge(path) {
        var items = await readDir(path);
        for (i in items) {
            items[i] = `${path}/${items[i]}`;
            if (await isFolder(items[i])) { await scavenge(items[i]) }
            else {
                var file = require(items[i]);
                var name = items[i].split('.js')[0].split('/')[items[i].split('.js')[0].split('/').length - 1];
                commandData[name] = file.config;
            }
        }
    }

    //await scavenge('./src/commands');
    //await writeFile('./docs/commands.json', JSON.stringify(commandData, null, 4));

    if (config.sharded) {
        var manager = new Discord.ShardingManager('./src/shard.js', {
            //totalShards: 'auto',
            totalShards: 3,
            token: config.token
        });

        manager.spawn(manager.totalShards, 2000);
        
        manager.on('launch', function(shard) {
            console.log(`shard ${shard.id+1}/${manager.totalShards} launched`);
        });
    }

    else {
        var child_process = require('child_process');
        var child = child_process.spawn('node', ['src/shard.js']);
        child.on('exit', function(code, signal) { console.log(`code: ${code}, signal: ${signal}`) })
        child.on('error', function(error) { console.log(error) })
        child.stdout.pipe(process.stdout);
        process.on('SIGINT', function() { child.kill('SIGINT'); process.exit(); }.bind());
    }
}

start();