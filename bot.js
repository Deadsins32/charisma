var fs = require('fs');
var chalk = require('chalk');
var Discord = require('discord.js');
var client = new Discord.Client();

var config = require('./src/config/config.json');

var CONSOLE = console;

console.ready = function(str) { CONSOLE.log(chalk.greenBright('[+]'), str) }
console.warn = function(str) { CONSOLE.log(chalk.yellowBright('[-]'), str) }
console.error = function(str) {
    var lines = str.split('\n');
    for (var l = 0; l < lines.length; l++) { CONSOLE.log(chalk.redBright('[!]'), lines[l]) }
}

console.info = function(str) {
    CONSOLE.log(chalk.cyanBright('[?]'), str);
}

var data = {
    users: new Object(),
    guilds: new Object()
}

var YouTube = require('simple-youtube-api');

var imports = {
    client: client,
    errors: {
        date: new Date(),
        logs: new Array()
    },

    error: function(error) {
        this.errors.logs.push(error.stack);
        console.error(error.stack);
    },

    youtube: new YouTube(config.googleApiKey),
    ytdl: require('ytdl-core'),

    Command: require(`./src/core/Command.js`),
    Flavors: require(`./src/core/Flavors.js`),
    Seed: require('./src/core/Seed.js'),
    Experience: require('./src/core/Experience'),

    data: data,

    config: config,
    shorthands: require('./src/config/shorthands.json'),
    aliases: require('./src/config/aliases.json'),

    console: console,
    music: new Object()
}

var syncFs = require('./src/core/syncFs.js');
var exists = syncFs.exists;
var readDir = syncFs.readDir;

var load = {
    commands: async function() {
        var groups = await readDir('./src/commands');
        var total = 0;
        for (g in groups) {
            var commands = await readDir(`./src/commands/${groups[g]}`);
            for (c in commands) {
                var file = require(`./src/commands/${groups[g]}/${commands[c]}`);
                var name = commands[c].split('.js')[0];
                imports.Command.commands[name] = file.command;
                imports.Command.configs[name] = file.config;
                total++;
            }
        }

        return total;
    },

    users: async function(users) {
        var total = 0;
        for (u in users) {
            if (!data.users[users[u]] && await exists(`./data/users/${users[u].id}.json`)) {
                total++;
                data.users[users[u].id] = require(`./data/users/${users[u].id}.json`);
            }
        }

        return total;
    },

    guilds: async function(guilds) {
        var total = 0;
        for (g in guilds) {
            if (!data.guilds[guilds[g]] && await exists(`./data/guilds/${guilds[g].id}`)) {
                total++;
                var object = new Object();
                object.members = new Object();
                var current = await readDir(`./data/guilds/${guilds[g].id}`);
                for (c in current) { if (current[c] != 'members') { object[current[c].split('.json')[0]] = require(`./data/guilds/${guilds[g].id}/${current[c]}`) } }
                var members = guilds[g].members.array();
                for (m in members) {
                    if (await exists(`./data/guilds/${guilds[g].id}/members/${members[m].id}.json`)) {
                        object.members[members[m].id] = require(`./data/guilds/${guilds[g].id}/members/${members[m].id}.json`);
                    }
                }

                data.guilds[guilds[g].id] = object;
            }
        }

        return total;
    },

    daemons: async function() {
        var total = 0;
        var files = await readDir('./src/daemons');
        for (f in files) {
            total++;
            require(`./src/daemons/${files[f]}`)(imports);
            console.ready(`${files[f].split('.js')[0]} daemon has been initialized`);
        }

        return total;
    }
}

async function start() {
    if (await exists('./data/defaults.json')) { data.defaults = require('./data/defaults.json') }
    else { data.defaults = require('./data/defaults.example.json') }
    console.ready(`${await load.daemons()} daemons have been loaded`);
    console.ready(`${await load.commands()} commands have been loaded`);
    client.on('ready', async function() {
        console.ready(`${await load.guilds(client.guilds.array())} guilds have been loaded`);
        console.ready(`${await load.users(client.users.array())} users have been loaded`);
        console.ready(`logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
    });
}

/*async function exit() {
    var connections = client.voiceConnections.array();
    for (c in connections) { connections[c].disconnect() }
    await save();
    process.exit();
}*/

//process.stdin.resume();

//process.on('SIGINT', exit.bind());

client.on('error', function(error) { imports.error(error) });

process.on('unhandledRejection', function(error, promise) {
    imports.error(error);
    console.log('An unhandledRejection occurred');
    console.log(promise);
    console.log(`Rejection: ${error}`);
});

if (!config.sharded) { client.login(config.token) }

start();