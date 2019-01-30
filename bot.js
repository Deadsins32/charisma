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

var aliases = require('./src/config/aliases.json');
var shorthands = require('./src/config/shorthands.json');
var config = require('./src/config/config.json');

var Discord = require('discord.js');
var client = new Discord.Client();

var readline = require('readline');

var chalk = require('chalk');

var fs = require('fs');
var YouTube = require('simple-youtube-api');
var ytdl = require('ytdl-core');

var Command = require(`./src/core/Command.js`);
var Flavors = require(`./src/core/Flavors.js`);
var Seed = require('./src/core/Seed.js');

var CONSOLE = console;
var imports = {};

console.ready = function(str) {
    CONSOLE.log(chalk.greenBright('[+]'), str);
}

console.warn = function(str) {
    CONSOLE.log(chalk.yellowBright('[-]'), str);
}

console.error = function(str) {
    CONSOLE.log(chalk.redBright('[!]'), str);
}

console.info = function(str) {
    CONSOLE.log(chalk.cyanBright('[?]'), str);
}

var data = {
    users: new Object(),
    guilds: new Object()
}

var consoleCommands = new Object();
var daemons = new Array();
var commandTotal = 0;
var consoleCommandTotal = 0;
var daemonTotal = 0;
var userTotal = 0;
var guildTotal = 0;

async function initialize() {
    var groups = await readDir('./src/commands');
    for (g in groups) {
        var commands = await readDir(`./src/commands/${groups[g]}`);
        for (c in commands) {
            commandTotal++;
            Command.commands[commands[c]] = require(`./src/commands/${groups[g]}/${commands[c]}/${commands[c]}.js`);
            Command.configs[commands[c]] = require(`./src/commands/${groups[g]}/${commands[c]}/config.json`);
        }
    }

    var consoleCommandFiles = await readDir('./src/console');
    for (c in consoleCommandFiles) {
        consoleCommandTotal++;
        consoleCommands[consoleCommandFiles[c].split('.js')[0]] = require(`./src/console/${consoleCommandFiles[c]}`);
    }

    var users = client.users.array();
    for (u in users) {
        if (await exists(`./data/users/${users[u].id}`)) {
            userTotal++;
            data.users[users[u].id] = require(`./data/users/${users[u]/id}`);
        }
    }

    var guilds = client.guilds.array();
    for (g in guilds) {
        if (await exists(`./data/guilds/${guilds[g].id}`)) {
            guildTotal++;
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

    var daemonFiles = await readDir('./src/daemons');
    for (d in daemonFiles) {
        daemonTotal++;
        daemons.push(require(`./src/daemons/${daemonFiles[d]}`));
    }

    if (await exists('./data/defaults.json')) { data.defaults = require('./data/defaults.json') }
    else { data.defaults = require('./data/defaults.example.json') }

    imports = {
        client: client,
        error: function(error) { console.log(error.stack) },
    
        youtube: new YouTube(config.googleApiKey),
        ytdl: ytdl,
    
        Command: Command,
        Flavors: Flavors,
        Seed: Seed,
    
        data: data,
    
        config: config,
        shorthands: shorthands,
        aliases: aliases,
    
        console: console,
    
        music: new Object()
    }

    for (d in daemons) { daemons[d](imports) }

    console.ready(`${commandTotal} commands have been loaded`);
    console.ready(`${consoleCommandTotal} console commands have been loaded`);
    console.ready(`${guildTotal} guilds have been loaded`);
    console.ready(`${userTotal} users have been loaded`);
    console.ready(`${daemonTotal} daemons have been initialized`);
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

client.on('ready', async function() {
    await initialize();
    console.ready(`logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
    setInterval(function() {
        save();
    }, 1800000);
});

async function exit() {
    var connections = client.voiceConnections.array();
    for (c in connections) { connections[c].disconnect() }
    await save();
    process.exit();
}

//process.stdin.resume();

process.on('SIGINT', exit.bind());

client.on('error', function(error) { console.log(error.stack) });

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', function(input) {
    try {
        var parsed = input.split(' ');
        var command = parsed[0];
        if (consoleCommands[command]) {
            parsed.shift();
            consoleCommands[command](imports, parsed);
        }

        else {
            console.log('unknown command');
        }
    }

    catch(error) { console.log(error.stack) }
});

process.on('unhandledRejection', function(error, promise) {
    console.log('An unhandledRejection occurred');
    console.log(promise);
    console.log(`Rejection: ${error}`);
});

if (!config.sharded) { client.login(config.token) }