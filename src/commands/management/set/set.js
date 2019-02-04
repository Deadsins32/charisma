var fs = require('fs');
var Discord = require('discord.js');

module.exports = function(imports, parameters) {
    var embed = new Discord.RichEmbed();
    embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);

    function index(obj, is, value) {
        try {
            if (typeof is == 'string') { return index(obj,is.split('.'), value) }
            else if (is.length == 1 && value !== undefined) { return obj[is[0]] = value }
            else if (is.length == 0) { return obj }
            else { return index(obj[is[0]], is.slice(1), value) }
        }

        catch(error) {}
    }
    
    /*
    > obj = {a:{b:{etc:5}}}

    > index(obj,'a.b.etc')
    5
    > index(obj,['a','b','etc'])   #works with both strings and lists
    5

    > index(obj,'a.b.etc', 123)    #setter-mode - third argument (possibly poor form)
    123

    > index(obj,'a.b.etc')
    123
    */

    var keys = {
        charisma: {
            status: 'string'
        },

        guild: {
            config: {
                prefix: 'string',
                expcurve: 'number',
                logchannel: 'channel',
                autorole: 'role',
                flavor: 'flavor'
            },

            colors: {
                accent: 'color',
                logs: {
                    joins: 'color',
                    leaves: 'color',
                    nicknamechanges: 'color',
                    usernamechanges: 'color'
                }
            }
        }
    }

    var methods = {
        string: function(input) { return input },
        color: function(input) { if (imports.Command.methods.color(input).pass) { embed.setColor(input); return input } },
        number: function(input) { if (!isNaN(input)) { return eval(input) } },
        channel: function(input) { if (imports.Command.methods.channel(input).pass) { if (imports.guild.channels.get(imports.Command.methods.channel(input).value)) { return imports.Command.methods.channel(input).value } } },
        role: function(input) { if (imports.guild.roles.find('name', input)) { return imports.guild.roles.find('name', input).id } },
        flavor: function(input) { if (imports.Flavors.check(input)) { return input } }
    }

    var maps = {
        guild: imports.data.guilds[imports.guild.id]
    }

    var overwrites = {
        charisma: {
            status: function(input) { imports.client.user.setPresence({ game: { name: input }, status: 'online' }) }
        }
    }

    if (index(keys, parameters[0])) {
        var type = index(keys, parameters[0]);
        if (methods[type](parameters[1])) {
            if (index(overwrites, parameters[0])) { index(overwrites, parameters[0])(methods[type](parameters[1])) }
            else { index(maps, parameters[0], methods[type](parameters[1])) }
            if (typeof methods[type](parameters[1]) == 'string') { parameters[1] = `"${parameters[1]}"` }
            embed.setDescription(`\`${parameters[0]}\` has been set to ${parameters[1]}`);
        }

        else { embed.setDescription(`${parameters[1]} is not a \`${type}\``) }
    }

    else { embed.setDescription(`\`${parameters[0]}\` does not exist`) }

    imports.channel.send(embed);
}