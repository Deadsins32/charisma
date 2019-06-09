var Discord = require('discord.js');
var emoji = require('node-emoji');

module.exports = {
    config: {
        permissions: [],
        description: 'look up an item',
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        params: [
            { type: 'string', required: true, name: 'name/emoji' }
        ]
    },

    command: async function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
        var items = imports.Data.getItems();
        var item = items[parameters[0]];
        if (!item) { if (emoji.hasEmoji(parameters[0])) { for (var i in items) { if (items[i].emoji == emoji.unemojify(parameters[0])) { item = items[i] } } } }
        if(item) {
            embed.addField('name', item.name, true);
            embed.addField('emoji', item.emoji, true);
            if (item.shoppable && imports.Shop.isAvailable(item)) { embed.addField('buy price', `**$${imports.Shop.getPrice(item)}**`, true) }
            embed.addField('sell price', `**$${imports.Shop.getValue(item)}**`, true);
            if (item.description) { embed.addField('description', item.description, true) }
            embed.addField('tags', item.tags.join(', '), true);
        }

        else { embed.setDescription(`that item doesn't exist`) }
        imports.channel.send(embed);
    }
}