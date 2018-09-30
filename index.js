var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var Discord = require('discord.js');
var client = new Discord.Client();

var Guild = require('./core/Guild.js');
var User = require('./core/User.js');
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
    shorthands: shorthands
}

process.stdin.resume();

function exitHandler() {
    CONSOLE.log('exiting!');
    process.exit();
}

process.on('SIGINT', exitHandler.bind());

client.on('ready', function() {
    console.ready('client ready!');
    console.warn('client ready!');
    console.error('client ready!');
    console.info('client ready!');
});

client.on('message', function(message) {
    events.message(exports, message);
});

client.on('guildCreate', function(guild) {
    events.guildCreate(exports, guild);
});

client.on('guildDelete', function(guild) {
    events.guildDelete(exports, guild);
});

client.on('guildMemberAdd', function(member) {
    events.guildMemberAdd(exports, member);
});

client.on('guildMemberRemove', function(member) {
    events.guildMemberRemove(exports, member);
});

client.on('guildMemberUpdate', function(oldMember, newMember) {
    events.guildMemberUpdate(exports, oldMember, newMember);
});

client.on('userUpdate', function(oldUser, newUser) {
    events.userUpdate(exports, oldUser, newUser);
});

client.login(config.token);