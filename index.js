var Discord = require('discord.js');
var fs = require('fs');

function readDir(path) {
    return new Promise(function(resolve, reject) {
        fs.readdir(path, function(error, files) {
            if (error) { reject(error) }
            else { resolve(files) }
        });
    });
}

function writeFile(path, data) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(path, data, function(error) {
            if (error) { reject(error) }
            else { resolve(true) }
        });
    });
}

async function start() {
    var commandData = new Object();
    var dirs = await readDir(`./src/commands`);
    for (d in dirs) {
        var commands = await readDir(`./src/commands/${dirs[d]}`);
        for (c in commands) { commandData[commands[c]] = require(`./src/commands/${dirs[d]}/${commands[c]}/config.json`) }
    }

    await writeFile('./docs/commands.json', JSON.stringify(commandData, null, 4));

    var Manager = new Discord.ShardingManager('./bot.js');
    Manager.spawn(2);
}

start();