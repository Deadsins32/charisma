var fs = require('fs');
var chalk = require('chalk');
var Discord = require('discord.js');
var client = new Discord.Client();

var config = require('./src/config/config.json');

console.info = function(str) {
    CONSOLE.log(chalk.cyanBright('[?]'), str);
}

Function.prototype.clone = function() {
    var that = this;
    var temp = function temporary() { return that.apply(this, arguments); };
    for(var key in this) {
        if (this.hasOwnProperty(key)) {
            temp[key] = this[key];
        }
    }
    return temp;
}

var CONSOLE = {
    log: console.log.clone()
}

global.console.log = function(string) {
    var error = new Error();
    var marker = '\x1b[1m\x1b[36m[?]\x1b[0m';
    var from = error.stack.split('\n')[2].split('\\')[error.stack.split('\n')[2].split('\\').length - 1].slice(0, -1);
    if (typeof string !== 'string') { CONSOLE.log(string) }
    else {
        var lines = string.split('\n');
        console.log(lines.length);
        if (lines.length > 1) {
            for (l in lines) { lines[l] = `${marker} ${lines[l]}` }
            CONSOLE.log(lines.join('\n'));
        }

        else { CONSOLE.log(`${marker} ${from}: ${string}`) }
    }
}

global.console.ready = function(string) {
    var marker = '\x1b[1m\x1b[32m[+]\x1b[0m';
    var lines = string.split('\n');
    if (lines.length > 1) {
        for (l in lines) { lines[l] = `${marker} ${lines[l]}` }
        CONSOLE.log(lines.join(`\n`));
    }

    else { CONSOLE.log(`${marker} ${string}`) }
}

global.console.error = function(error) {
    var marker = '\x1b[1m\x1b[31m[!]\x1b[0m';
    if (error instanceof Error) {
        //CONSOLE.log(`${error.stack.split('\n').join('\n\x1b[1m\x1b[31m[!] \x1b[0m')}`)
        var lines = error.stack.split('\n');
        for (l in lines) { lines[l] = `${marker} ${lines[l].trim()}` }
        CONSOLE.log(lines.join('\n'));
    }

    else { CONSOLE.log(`${marker} ${error}`) }
}

global.print = function(str) {
    var error = new Error();
    console.log(__dirname);
    console.log(__filename);
    //str = str.replace(/abc/g, '');
    //console.log(error.stack.split('\n')[2].split(__dirname)[1].slice(0, -1).substring(1).replace(/\\/g, '/'));
    //console.log(error.stack.split('\n')[2].split('\\')[error.stack.split('\n')[2].split('\\').length - 1].join('/').slice(0, -1).substring(1));
    console.log(error.stack.split('\n')[2].split('\\')[error.stack.split('\n')[2].split('\\').length - 1].slice(0, -1));
    //console.log(error.stack.split('\n')[1].split('\\'));
}

var data = {
    users: new Object(),
    guilds: new Object()
}

var YouTube = require('simple-youtube-api');

var imports = {
    client: client,

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
var isFolder = syncFs.isFolder;

var load = {
    commands: async function() {
        var total = 0;
        async function scavenge(path) {
            var items = await readDir(path);
            for (i in items) {
                items[i] = `${path}/${items[i]}`;
                if (await isFolder(items[i])) { await scavenge(items[i]) }
                else {
                    var file = require(items[i]);
                    var name = items[i].split('.js')[0].split('/')[items[i].split('.js')[0].split('/').length - 1];
                    imports.Command.commands[name] = file.command;
                    imports.Command.configs[name] = file.config;
                    total++;
                }
            }
        }

        await scavenge('./src/commands');
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

client.on('error', function(error) { console.error(error) });

process.on('unhandledRejection', function(error, promise) {
    console.error(error);
    //console.log('An unhandledRejection occurred');
    //console.log(promise);
    //console.log(`Rejection: ${error}`);
});

if (!config.sharded) { client.login(config.token) }

start();