var Discord = require('discord.js');
var emoji = require('node-emoji');

module.exports = {
    config: {
        permissions: [],
        description: 'sell something',
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        params: [
            { type: 'string', required: true, name: 'item/emoji' },
            { type: 'number', required: false, name: 'quantity' }
        ]
    },

    command: async function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
        
        var quantity = 1;
        if (parameters[1]) { quantity = parameters[1] }

        var items = imports.Data.getItems();
        var item;
        if (items[parameters[0]]) { item = items[parameters[0]] }
        else { for (var i in items) { if (items[i].emoji == emoji.unemojify(parameters[0])) { item = items[i] } } }
        
        if (item) {
            var getItem = await imports.Data.inventory.getItem(imports.user.id, item.name);
            if (getItem) {
                if (getItem < quantity) { embed.setDescription(`you don't have ${item.emoji}x${quantity}`) }
                else {
                    var value = imports.Shop.getValue(item);
                    var total = value * quantity;
                    await imports.Data.inventory.removeItem(imports.user.id, item.name, quantity);
                    await imports.Data.inventory.addMoney(imports.user.id, total);
                    embed.setDescription(`you sold ${item.emoji}x${quantity} and got **$${total}**`);
                }
            }

            else { embed.setDescription(`you don't have any ${item.emoji}'s`) }
        }

        else { embed.setDescription(`that item doesn't exist`) }
        imports.channel.send(embed);
    }
}