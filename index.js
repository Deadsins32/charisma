var fs = require('fs');
var path = require('path');
var Discord = require('discord.js');
var client = new Discord.Client();

var snekfetch = require('snekfetch');

var Guild = require('./core/Guild.js');
var User = require('./core/User.js');
var Command = require('./core/Command.js');
var Flavors = require('./core/Flavors.js');
var Seed = require('./core/Seed.js');

var aliases = require('./commands/aliases.json');

var config = require('./config.json');
var events = require('./events.js');

var settings = {
    blacklist: require('./data/settings/blacklist.json'),
    defaults: require('./data/settings/defaults.json'),
    guilds: require('./data/settings/guilds.json'),
    users: require('./data/settings/users.json')
}

var exports = {
    client: client,
    settings: settings,
    Guild: Guild,
    User: User,
    Command: Command,
    Flavors: Flavors,
    Seed: Seed,
    config: config,
    aliases: aliases,
    fs: require('fs'),
    snekfetch: require('snekfetch'),
    Discord: require('discord.js'),
    treeify: require('treeify'),
    anime: require('node-kitsu')
}

client.on('message', function(message) {
    events.message(exports, message);
});

client.on('guildCreate', function(guild) {
    events.guildCreate(exports, guild);
});

client.on('guildDelete', function(guild) {
    events.guildDelete(exports, guild);
});

client.login(config.token);