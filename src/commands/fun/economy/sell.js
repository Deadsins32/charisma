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
            [
                { type: 'string', required: true, name: 'item/emoji' },
                { type: 'number', required: false, name: 'quantity' }
            ],

            [
                { type: 'string', required: true, name: 'item' },
                { type: 'itemQuery', required: true, name: 'query' }
            ]
        ]
    },

    command: [
        async function(imports, parameters) {
            var embed = new Discord.RichEmbed();
            embed.setColor(imports.local.guild.colors.accent);
        
            let quantity = 1;
            if (parameters[1]) { quantity = parameters[1] }

            let items = imports.economy.items;
            let item;
            if (items[parameters[0]]) { item = items[parameters[0]] }
            else { for (let i in items) { if (items[i].emoji == emoji.unemojify(parameters[0])) { item = items[i] } } }
        
            if (item) {
                let getItem = await imports.Data.inventory.item.get(imports.user.id, item.name);
                if (getItem) {
                    if (getItem.length < quantity) { embed.setDescription(`you don't have ${item.emoji}x${quantity}`) }
                    else {
                        let value = imports.shop.getValue(item);
                        let total = value * quantity;
                        await imports.Data.inventory.item.remove(imports.user.id, item.name, quantity);
                        await imports.Data.inventory.money.add(imports.user.id, total);
                        embed.setDescription(`you sold ${item.emoji}x${quantity} and got **$${total}**`);
                    }
                }

                else { embed.setDescription(`you don't have any ${item.emoji}'s`) }
            }

            else { embed.setDescription(`that item doesn't exist`) }
            imports.channel.send(embed);
        },

        async function(imports, parameters) {
            console.log(parameters[1]);
        }
    ]
}