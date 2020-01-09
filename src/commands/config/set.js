var Discord = require('discord.js');
var fs = require('fs');

function index(obj, is, value) {
    try {
        if (typeof is == 'string') { return index(obj,is.split('.'), value) }
        else if (is.length == 1 && value !== undefined) { return obj[is[0]] = value }
        else if (is.length == 0) { return obj }
        else { return index(obj[is[0]], is.slice(1), value) }
    }

    catch(error) {}
}

//var config = require('./../config.json');
//var keys = config.keys;

//var methods = {};
//var typesDir = fs.readdirSync(`${__dirname}/../keyTypes`);
//for (var t = 0; t < typesDir.length; t++) { methods[typesDir[t].split('.js')[0]] = require(`./../keyTypes/${typesDir[t]}`) }

var types = {
    string: function(input) { return input },
    number: function(input) {
        if (!isNaN(input)) { return parseFloat(input) }
        else { return null }
    },

    int: function(input) {
        if (!isNaN(input)) { return parseInt(input) }
        else { return null }
    },

    boolean: function(input) {
        if (input.toLowerCase() == 'true') { return true }
        else if (input.toLowerCase() == 'false') { return false }
        else { return null }
    },

    color: function(input) {
        input = input.toUpperCase();
        if (/^#[0-9A-F]{6}$/i.test(input) || /^#[0-9A-F]{3}$/i.test(input)) { return input }
    }
}

module.exports = {
    config: {
        permissions: ['GUILD.MANAGE'],
        description: 'sets a local value to whatever you specify',
        hidden: false,
        nsfw: false,
        tags: ['management', 'admin'],
        params: [
            { type: 'string', required: true, name: 'key' },
            { type: 'string', required: true, name: 'value' }
        ]
    },

    command: function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        let gets = imports.config.main.gets;
        let sets = imports.config.main.sets;

        var references = {
            guild: imports.local.guild,
            user: imports.local.user,
            bot: {
                status: function(input) { imports.client.user.setPresence({ game: { name: input }, status: 'online' }) }
            }
        }

        if (index(references, parameters[0]) != undefined) {
            var found = false;
            var typePath = parameters[0].split('.');
            while (!found) {
                if (index(sets, typePath.join('.'))) { found = true }
                else { typePath.pop() }
            }

            var type = index(sets, typePath.join('.'));
            if (typeof type == 'object' || typeof index(references, parameters[0]) == 'object') { embed.setDescription(`\`${parameters[0]}\` isn't an individual property`) }
            else {
                var actual = parameters[1];
                var valid = false;
                if (types[type]) {
                    if (types[type](actual) != null) {
                        actual = types[type](actual);
                        valid = true;
                    }

                    else { valid = false }
                }

                else { valid = true }

                if (valid) {
                    if (typeof index(references, parameters[0]) == 'function') { index(references, parameters[0])(actual) }
                    else { index(references, parameters[0], actual) }
                    embed.setDescription(`\`${parameters[0]}\` has been set to **${actual}**`);
                }

                else { embed.setDescription(`**"${actual}"** isn't of type: \`${type}\``) }
            }
        }

        else {
            if (index(gets, parameters[0])) { embed.setDescription(`\`${parameters[0]}\` is a read-only property`) }
            else { embed.setDescription(`\`${parameters[0]}\` doesn't exist`) }
        }

        embed.setColor(imports.local.guild.colors.accent);
        imports.channel.send(embed);
    }
}