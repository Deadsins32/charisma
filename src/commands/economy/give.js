var Discord = require('discord.js');
var emoji = require('node-emoji');

module.exports = {
    config: {
        permissions: [],
        description: 'give someone some items',
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        params: [
            { type: "mention", required: true, "name": "user" },
            { type: "string", required: true, "name": "item/emoji" },
            { type: "number", required: false, "name": "quantity" }
        ]
    },

    command: async function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
        
        var items = imports.Data.getItems();
        var item;
        if (items[parameters[1]]) { item = items[parameters[1]] }
        else { for (var i in items) { if(items[i].emoji == emoji.unemojify(parameters[1])) { item = items[i] } } }

        if (item) {
            var getItem = await imports.Data.inventory.getItem(imports.user.id, item.name);
            if (getItem) {
                var quantity = 1;
                if (parameters[2]) { quantity = parameters[2] }
                if (quantity <= getItem) {
                    var user = imports.guild.members.get(parameters[0]);
                    if (user) {
                        await imports.Data.inventory.removeItem(imports.user.id, item.name, quantity);
                        await imports.Data.inventory.addItem(parameters[0], item.name, quantity);
                        embed.setDescription(`you gave **${user.displayName}** ${item.emoji}x${quantity}`);
                    }

                    else { embed.setDescription(`that user doesn't exist`) }
                }

                else { embed.setDescription(`you don't have ${item.emoji}x${quantity}`) }
            }

            else { embed.setDescription(`you don't have that item`) }
        }

        else { embed.setDescription(`that item doesn't exist`) }

        imports.channel.send(embed);
    }
}