var Discord = require('discord.js');

function index(obj, is, value) {
    try {
        if (typeof is == 'string') { return index(obj,is.split('.'), value) }
        else if (is.length == 1 && value !== undefined) { return obj[is[0]] = value }
        else if (is.length == 0) { return obj }
        else { return index(obj[is[0]], is.slice(1), value) }
    }

    catch(error) {}
}

module.exports = {
    config: {
        permissions: ['GUILD.MANAGE'],
        description: 'enables a local boolean value',
        hidden: false,
        nsfw: false,
        tags: ['management', 'admin'],
        params: [
            { type: 'string', required: true, name: 'path' }
        ],

        aliases: ['test']
    },

    command: function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        var references = {
            guild: imports.local.guild,
            user: imports.local.user
        }

        if (index(references, parameters[0]) != undefined) {
            var found = false;
            var typePath = parameters[0].split('.');
            while (!found) {
                if (index(imports.sets, typePath.join('.'))) { found = true }
                else { typePath.pop() }
            }

            var type = index(imports.sets, typePath.join('.'));
            if (typeof type == 'object' || typeof index(references, parameters[0]) == 'object') { embed.setDescription(`\`${parameters[0]}\` isn't an individual property`) }
            else {
                if (type == 'boolean') {
                    if (index(references, parameters[0]) == true) { embed.setDescription(`\`${parameters[0]}\` is already enabled`) }
                    else { index(references, parameters[0], true); embed.setDescription(`\`${parameters[0]}\` has been enabled`) }
                }
            }
        }

        else {
            if (index(imports.gets, parameters[0])) { embed.setDescription(`\`${parameters[0]}\` is a read-only property`) }
            else { embed.setDescription(`\`${parameters[0]}\` doesn't exist`) }
        }

        embed.setColor(imports.local.guild.colors.accent);
        imports.channel.send(embed);
    }
}