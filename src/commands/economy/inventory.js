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
            var inventory = await imports.Data.inventory.get(imports.user.id);
            
            var keyItems = new Array();
            for (var k in inventory.key) { keyItems.push(imports.Data.getItems()[k].emoji) }
            if (keyItems.length == 0) { keyItems.push('no key items') }
            embed.addField('key items', keyItems.join(' '));

            var items = new Array();
            for (var i in inventory.items) { items.push(`${imports.Data.getItems()[i].emoji}x${inventory.items[i]}`) }
            if (items.length == 0) { items.push('nothing ;-;') }
            embed.addField('inventory', items.join(' '));
        }

        imports.channel.send(embed);
    }
}