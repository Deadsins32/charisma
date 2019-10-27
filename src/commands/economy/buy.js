var Discord = require('discord.js');
var emoji = require('node-emoji');

module.exports = {
    config: {
        permissions: [],
        description: 'buy something from the shop',
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        params: [
            { type: 'string', required: true, name: 'item/emoji' },
            { type: 'number', required: false, name: 'quantity' }
        ]
    },

    command: async function(imports, parameters) {
        //id, item, quantity
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
        
        var quantity = 1;
        if (parameters[1]) { quantity = parameters[1] }

        var items = imports.Data.getItems();
        var item;
        if (items[parameters[0]]) { item = items[parameters[0]] }
        else { for (var i in items) { if (items[i].emoji == emoji.unemojify(parameters[0])) { item = items[i] } } }
        
        if (item) {
            if (item.tags.includes('key')) { quantity = 1 }
            if (imports.Shop.isAvailable(item)) {
                var price = imports.Shop.getPrice(item);
                var balance = await imports.Data.inventory.getMoney(imports.user.id);
                if (balance >= price * quantity) {
                    await imports.Data.inventory.removeMoney(imports.user.id, price * quantity);
                    if (item.tags.includes('key')) {
                        var hasItem = await imports.Data.inventory.getKeyItem(imports.user.id, item.name);
                        if (!hasItem) {
                            var meta = {};
                            if (item.meta) { meta = item.meta }
                            await imports.Data.inventory.addKeyItem(imports.user.id, item.name, meta);
                            embed.setDescription(`you purchased a ${item.emoji} and it was added to your **key items**`);
                        }

                        else { embed.setDescription(`you already have a ${item.emoji}. you can't have more than one`) }
                    }

                    else {
                        await imports.Data.inventory.addItem(imports.user.id, item.name, quantity);
                        embed.setDescription(`you purchased ${quantity}x${item.emoji}`);
                    }
                }

                else { embed.setDescription(`you don't have enough money to buy that`) }
            }

            else { embed.setDescription(`that item isn't available`) }
        }

        else { embed.setDescription(`that item doesn't exist`) }

        var newDescription = embed.description;
        var split = newDescription.split(' ');
        for (var s = 0; s < split.length; s++) {
            for (var i in items) {
                if (split[s].split('x')[0] == items[i].emoji) {
                    var obtained = await imports.Data.inventory.getObtained(imports.user.id, items[i].name);
                    if (obtained == 1) { newDescription = newDescription.replace(split[s], `${split[s]} (${items[i].name})`) }
                }
            }
        }

        imports.channel.send(embed);
    }
}