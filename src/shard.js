var Discord = require('discord.js');
var config = require('./config/config.json');
var YouTube = require('simple-youtube-api');
var rethink = require('rethinkdb');

var syncFs = require('./core/syncFs.js');
var exists = syncFs.exists;
var readDir = syncFs.readDir;
var isFolder = syncFs.isFolder;

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

var CONSOLE = { log: console.log.clone() }

global.console.log = function(string) {
    var error = new Error();
    var marker = '\x1b[1m\x1b[36m[?]\x1b[0m';
    var from = error.stack.split('\n')[2].split('\\')[error.stack.split('\n')[2].split('\\').length - 1].slice(0, -1);
    if (typeof string !== 'string') { CONSOLE.log(string) }
    else {
        var lines = string.split('\n');
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

var client = new Discord.Client();

var data = {
    users: new Object(),
    guilds: new Object()
}

var imports = {
    client: client,

    youtube: new YouTube(config.googleApiKey),
    ytdl: require('ytdl-core'),

    Command: require(`./core/Command.js`),
    Flavors: require(`./core/Flavors.js`),
    Seed: require('./core/Seed.js'),
    Experience: require('./core/Experience'),
    Data: require('./core/Data.js'),
    defaults: require('./../data/defaults.json'),

    config: config,
    shorthands: require('./config/shorthands.json'),
    aliases: require('./config/aliases.json'),

    console: console,
    music: new Object()
}

var load = {
    commands: async function() {
        var total = 0;
        async function scavenge(path) {
            var items = await readDir(path);
            for (var i = 0; i < items.length; i++) {
                items[i] = `${path}/${items[i]}`;
                if (await isFolder(items[i])) { await scavenge(items[i]) }
                else {
                    items[i] = items[i].split('/src').join('');
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

    /*users: async function(users) {
        var total = 0;
        for (u in users) {
            if (!data.users[users[u]] && await exists(`./data/users/${users[u].id}.json`)) {
                total++;
                data.users[users[u].id] = require(`./../data/users/${users[u].id}.json`);
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
                for (c in current) { if (current[c] != 'members') { object[current[c].split('.json')[0]] = require(`./../data/guilds/${guilds[g].id}/${current[c]}`) } }
                var members = guilds[g].members.array();
                for (m in members) {
                    if (await exists(`./data/guilds/${guilds[g].id}/members/${members[m].id}.json`)) {
                        object.members[members[m].id] = require(`./../data/guilds/${guilds[g].id}/members/${members[m].id}.json`);
                    }
                }

                data.guilds[guilds[g].id] = object;
            }
        }

        return total;
    },*/

    daemons: async function() {
        var total = 0;
        var files = await readDir('./src/daemons');
        for (f in files) {
            total++;
            require(`./daemons/${files[f]}`)(imports);
            if (!config.sharded) { console.ready(`${files[f].split('.js')[0]} daemon has been initialized`) }
        }

        return total;
    }
}

async function start() {
    await imports.Data.start();
    console.ready(`successfully connected to the database`);
    console.ready(`${await load.daemons()} daemons have been loaded`);
    console.ready(`${await load.commands()} commands have been loaded`);
    client.on('ready', async function() {
        console.ready(`logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
    });

    
    /*if (!config.sharded) {
        if (await exists('./data/defaults.json')) { data.defaults = require('./../data/defaults.json') }
        else { data.defaults = require('./../data/defaults.example.json') }
        console.ready(`${await load.daemons()} daemons have been loaded`);
        console.ready(`${await load.commands()} commands have been loaded`);
        client.on('ready', async function() {
            console.log(`shard: ${client.shard}`);
            console.ready(`${await load.guilds(client.guilds.array())} guilds have been loaded`);
            console.ready(`${await load.users(client.users.array())} users have been loaded`);
            console.ready(`logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
        });
    }

    else {
        if (await exists('./data/defaults.json')) { data.defaults = require('./../data/defaults.json') }
        else { data.defaults = require('./../data/defaults.example.json') }
        await load.daemons();
        await load.commands();
        client.on('ready', async function() {
            console.log(process);
            await load.guilds(client.guilds.array());
            await load.users(client.users.array());
            console.ready(`initiated shard [${client.guilds.array().length} guilds / ${client.users.array().length} users]`);
        });
    }*/
}

client.on('error', function(error) { console.error(error) });
//process.on('SIGINT', async function() {}.bind());
client.login(config.token);
start();