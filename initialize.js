var Discord = require('discord.js');

var config = require('./src/config/config.json');
var syncFs = require('./src/core/syncFs.js');
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
        var manager = new Discord.ShardingManager('./bot.js', {
            totalShards: 'auto',
            token: config.token
        });
    
        manager.spawn(manager.totalShards, 2000);
        
        manager.on('launch', function(shard) {
            //console.ready(`shard ${shard.id+1}/${manager.totalShards} launched`);
        });
    }

    else {
        var bot = require('./bot.js');
        bot();
    }
}

start();