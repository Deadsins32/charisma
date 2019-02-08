var fs = require('fs');
var chalk = require('chalk');
var Discord = require('discord.js');
var client = new Discord.Client();

var config = require('./src/config/config.json');

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

function createDirectory(path) {
    return new Promise(function(resolve, reject) {
        fs.mkdir(path, function(error) {
            if (error) { reject(error) }
            else { resolve(true) }
        });
    });
}

function exists(path) {
    return new Promise(function(resolve, reject) {
        fs.exists(path, function(bool) { resolve(bool) });
    });
}

var CONSOLE = console;

console.ready = function(str) { CONSOLE.log(chalk.greenBright('[+]'), str) }
console.warn = function(str) { CONSOLE.log(chalk.yellowBright('[-]'), str) }
console.error = function(str) { CONSOLE.log(chalk.redBright('[!]'), str) }
console.info = function(str) { CONSOLE.log(chalk.cyanBright('[?]'), str) }

var data = {
    users: new Object(),
    guilds: new Object()
}

var YouTube = require('simple-youtube-api');

var imports = {
    client: client,
    error: function(error) { console.log(error.stack) },

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

var daemons = new Array();

var load = {
    commands: async function() {
        var groups = await readDir('./src/commands');
        var total = 0;
        for (g in groups) {
            var commands = await readDir(`./src/commands/${groups[g]}`);
            for (c in commands) {
                total++;
                imports.Command.commands[commands[c]] = require(`./src/commands/${groups[g]}/${commands[c]}/${commands[c]}.js`);
                imports.Command.configs[commands[c]] = require(`./src/commands/${groups[g]}/${commands[c]}/config.json`);
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
            daemons.push(require(`./src/daemons/${files[f]}`));
        }

        return total;
    }
}

async function save() {
    console.ready('saving guild and user information...');

    for (g in data.guilds) {
        if (!await exists(`./data/guilds/${g}`)) { await createDirectory(`./data/guilds/${g}`) }
        for (p in data.guilds[g]) {
            if (p != 'members') { await writeFile(`./data/guilds/${g}/${p}.json`, JSON.stringify(data.guilds[g][p], null, 4)) }
            else { if (!await exists(`./data/guilds/${g}/members`)) { await createDirectory(`./data/guilds/${g}/members`) } }
        }

        for (m in data.guilds[g].members) { await writeFile(`./data/guilds/${g}/members/${m}.json`, JSON.stringify(data.guilds[g].members[m], null, 4)) }
    }

    for (u in data.users) { await writeFile(`./data/users/${u}.json`, JSON.stringify(data.users[u], null, 4)) }
}

async function start() {
    if (await exists('./data/defaults.json')) { data.defaults = require('./data/defaults.json') }
    else { data.defaults = require('./data/defaults.example.json') }

    console.ready(`${await load.commands()} commands have been loaded`);
    console.ready(`${await load.daemons()} daemons have been initialized`);
    for (d in daemons) { daemons[d](imports) }
    setInterval(function() { save() }, 1800000);
    client.on('ready', async function() {
        console.ready(`${await load.guilds(client.guilds.array())} guilds have been loaded`);
        console.ready(`${await load.users(client.users.array())} users have been loaded`);
        console.ready(`logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
    });
}

async function exit() {
    var connections = client.voiceConnections.array();
    for (c in connections) { connections[c].disconnect() }
    await save();
    process.exit();
}

//process.stdin.resume();

process.on('SIGINT', exit.bind());

client.on('error', function(error) { console.log(error.stack) });

process.on('unhandledRejection', function(error, promise) {
    console.log('An unhandledRejection occurred');
    console.log(promise);
    console.log(`Rejection: ${error}`);
});

if (!config.sharded) { client.login(config.token) }

start();