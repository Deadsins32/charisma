var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        description: 'check your inventory',
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        params: [
            { type: 'string', required: false, name: 'detailed?' },
            { type: 'number', required: false, name: 'page number' }
        ]
    },

    command: async function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
        var page = 1;
        
        if (parameters[0]) {

        }

        else {
            var items = new Array();
            var inventory = await imports.Data.inventory.get(imports.user.id);
            for (var i in inventory.items) { items.push(`${imports.Data.getItems()[i].emoji}x${inventory.items[i].count}`) }
            embed.setDescription(items.join(' '));
        }

        if (!embed.description) { embed.setDescription(`you don't have anything in your inventory`) }
        imports.channel.send(embed);
    }
}