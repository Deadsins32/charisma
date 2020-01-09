var Discord = require('discord.js');
let sharded = require('./config/options.json').sharding;
let token = require('./../berry.json').token;
async function sleep(ms) { return new Promise(function(resolve, reject) { setInterval(function() { resolve() }, ms) }) }

if (sharded) {
    var manager = new Discord.ShardingManager('./src/shard.js', {
        totalShards: 'auto',
        token: token
    });

    manager.spawn(manager.totalShards, 2000);
    manager.on('launch', function(shard) { console.log(`shard ${shard.id+1}/${manager.totalShards} launched`) });
}

else {
    var child_process = require('child_process');
    var child = child_process.spawn('node', ['src/shard.js']);

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);

    //if (process.platform === 'win32') {
    //    var rl = require('readline').createInterface({ input: process.stdin, output: process.stdout });
    //    rl.on('SIGINT', function() { process.emit('SIGINT') });
    //}
}