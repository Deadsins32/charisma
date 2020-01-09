var Discord = require('discord.js');
var config = require('./berry.json');

if (config.sharded) {
    var manager = new Discord.ShardingManager('./src/shard.js', {
        totalShards: 'auto',
        token: config.token
    });

    manager.spawn(manager.totalShards, 2000);
    manager.on('launch', function(shard) {
        console.log(`shard ${shard.id+1}/${manager.totalShards} launched`);
    });
}

else {
    var child_process = require('child_process');
    var child = child_process.spawn('node', ['src/bot.js']);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stdout);
    process.on('SIGINT', function() { console.log('exited!'); process.exit() });
}