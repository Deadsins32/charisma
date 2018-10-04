var fs = require('fs');

var chalk = require('chalk');
var Discord = require('discord.js');
var client = new Discord.Client();

var Command = require('./core/Command.js');
var Flavors = require('./core/Flavors.js');
var Seed = require('./core/Seed.js');

var aliases = require('./commands/aliases.json');
var shorthands = require('./data/shorthands.json');

var config = require('./config.json');
var events = require('./events.js');

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

var settings = {
    blacklist: require('./data/settings/blacklist.json'),
    defaults: require('./data/settings/defaults.json'),
    guilds: require('./data/settings/guilds.json'),
    users: require('./data/settings/users.json')
}

var exports = {
    client: client,

    Command: Command,
    Flavors: Flavors,
    Seed: Seed,

    settings: settings,
    config: config,
    aliases: aliases,
    shorthands: shorthands,

    console, console
}

process.stdin.resume();

function exitHandler() {
    CONSOLE.log('exiting!');
    process.exit();
}

process.on('SIGINT', exitHandler.bind());

fs.readdir('./commands', function(error, files) {
    var commandTotal = 0;
    if (error) {
        console.error(error.stack);
    }

    else {
        for (f in files) {
            if (files[f].endsWith('.js')) {
                var file = require('./commands/' + files[f]);
                var name = files[f].split('.js')[0];
                exports.Command.commands[name] = file;
                commandTotal++;
            }
        }
    }

    console.ready(commandTotal + ' commands have been loaded');
});

client.on('ready', function() { console.ready('ready') });
client.on('message', function(message) { try { events.message(exports, message) } catch(error) { console.error(error.stack) }});
client.on('guildMemberAdd', function(member) { try { events.guildMemberAdd(exports, member) } catch(error) { console.error(error.stack) }});
client.on('guildMemberRemove', function(member) { try { events.guildMemberRemove(exports, member) } catch(error) { console.error(error.stack) }});
client.on('guildMemberUpdate', function(oldMember, newMember) { try { events.guildMemberUpdate(exports, oldMember, newMember) } catch(error) { console.error(error.stack) }});
client.on('userUpdate', function(oldUser, newUser) { try { events.userUpdate(exports, oldUser, newUser) } catch(error) { console.error(error.stack) }});
client.on('error', function(error) { console.error(error.stack) });

client.login(config.token);