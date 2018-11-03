var fs = require('fs');

var chalk = require('chalk');
var Discord = require('discord.js');
var client = new Discord.Client();

var Command = require(`./src/core/Command.js`);
var Flavors = require(`./src/core/Flavors.js`);
var Seed = require('./src/core/Seed.js');

var aliases = require('./src/config/aliases.json');
var shorthands = require('./src/config/shorthands.json');

var config = require('./src/config/config.json');
var events = require('./src/events.js');

var CONSOLE = console;

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

var commandTotal = 0;
var groups = fs.readdirSync('./src/commands');
for (g in groups) {
    var commands = fs.readdirSync('./src/commands/' + groups[g]);
    for (c in commands) {
        commandTotal++;
        //exports.Command.commands[name] = file;
        Command.commands[commands[c]] = require('./src/commands/' + groups[g] + '/' + commands[c] + '/' + commands[c] + '.js');
        Command.configs[commands[c]] = require('./src/commands/' + groups[g] + '/' + commands[c] + '/config.json');
    }
}

var users = fs.readdirSync('./data/users');
var userTotal = 0;
for (u in users) {
    if (users[u] != '.gitkeep') {
        userTotal++;
        data.users[users[u].split('.json')[0]] = require('./data/users/' + users[u]);
    }
}

var guilds = fs.readdirSync('./data/guilds');
var guildTotal = 0;

for (g in guilds) {
    if (guilds[g] != '.gitkeep') {
        guildTotal++;
        var object = new Object();
        object.members = new Object();

        var curr = fs.readdirSync(`./data/guilds/${guilds[g]}`);
        for (c in curr) { if (curr[c] != 'members') { object[curr[c].split('.json')[0]] = require(`./data/guilds/${guilds[g]}/${curr[c]}`) } }

        /*var object = {
            config: require('./data/guilds/' + guilds[g] + '/config.json'),
            colors: require('./data/guilds/' + guilds[g] + '/colors.json'),
            features: require('./data/guilds/' + guilds[g] + '/features.json'),
            selfroles: require('./data/guilds/' + guilds[g] + '/selfroles.json'),
            whitelist: require('./data/guilds/' + guilds[g] + '/whitelist.json'),
            blacklist: require('./data/guilds/' + guilds[g] + '/blacklist.json'),
            members: new Object()
        }*/

        var members = fs.readdirSync('./data/guilds/' + guilds[g] + '/members');
        for (m in members) {
            if (members[m] != '.gitkeep') {
                object.members[members[m].split('.json')[0]] = require('./data/guilds/' + guilds[g] + '/members/' + members[m]);
            }
        }

        data.guilds[guilds[g]] = object;
    }
}

if (fs.existsSync('./data/defaults.json')) { data.defaults = require('./data/defaults.json') }
else { data.defaults = require('./data/defaults.example.json') }

var exports = {
    client: client,

    Command: Command,
    Flavors: Flavors,
    Seed: Seed,

    data: data,

    config: config,
    shorthands: shorthands,
    aliases: aliases,

    console, console
}

console.ready(commandTotal + ' commands have been loaded');
console.ready(guildTotal + ' guilds have been loaded');
console.ready(userTotal + ' users have been loaded');

function save() {
    console.ready('saving guild and user information...');
    /*client.user.setStatus('dnd').then(async function() {
        var guilds = data.guilds;
        var users = data.users;

        for (g in guilds) {
            var gerror = await access('./data/guilds/' + g);
            console.log(gerror);
            if (gerror) {
                await mkdir('./data/guilds/' + g);
            }

            for (p in guilds[g]) {
                if (p != 'members') {
                    await writefile('./data/guilds/' + g + '/' + p + '.json', JSON.stringify(guilds[g][p], null, 4));
                }
            
                var merror = await access('./data/guilds/' + g + '/members');
                if (merror) {
                    await mkdir('./data/guilds/' + g + '/members');
                }

                for (m in guilds[g].members) {
                    await writefile('./data/guilds/' + g + '/members/' + m + '.json', JSON.stringify(guilds[g].members[m]));
                }
            }
        }

        for (u in users) {
            await writefile('./data/users/' + u + '.json', JSON.stringify(users[u], null, 4));
        }

        console.log(false);
    });*/

    for (g in data.guilds) {
        if (!fs.existsSync(`./data/guilds/${g}`)) { fs.mkdirSync(`./data/guilds/${g}`) }
        for (p in data.guilds[g]) {
            if (p != 'members') { fs.writeFileSync(`./data/guilds/${g}/${p}.json`, JSON.stringify(data.guilds[g][p], null, 4), 'utf8') }
            else { if (!fs.existsSync(`./data/guilds/${g}/members`)) { fs.mkdirSync(`./data/guilds/${g}/members`) } }
        }

        for (m in data.guilds[g].members) { fs.writeFileSync(`./data/guilds/${g}/members/${m}.json`, JSON.stringify(data.guilds[g].members[m], null, 4), 'utf8') }
    }

    for (u in data.users) { fs.writeFileSync(`./data/users/${u}.json`, JSON.stringify(data.users[u], null, 4), 'utf8') }
}

client.on('ready', function() {
    console.ready(`logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
    setInterval(function() {
        save();
    }, 1800000);
});

function exit() {
    save();
    client.user.setStatus('online').then(process.exit)
}

//process.stdin.resume();

process.on('SIGINT', exit.bind());

client.on('message', function(message) { try { events.message(exports, message) } catch(error) { console.error(error.stack) }});
client.on('guildMemberAdd', function(member) { try { events.guildMemberAdd(exports, member) } catch(error) { console.error(error.stack) }});
client.on('guildMemberRemove', function(member) { try { events.guildMemberRemove(exports, member) } catch(error) { console.error(error.stack) }});
client.on('guildMemberUpdate', function(oldMember, newMember) { try { events.guildMemberUpdate(exports, oldMember, newMember) } catch(error) { console.error(error.stack) }});
client.on('userUpdate', function(oldUser, newUser) { try { events.userUpdate(exports, oldUser, newUser) } catch(error) { console.error(error.stack) }});
client.on('error', function(error) { console.error(error.stack) });

client.login(config.token);