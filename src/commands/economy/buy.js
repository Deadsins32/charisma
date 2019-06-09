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
            if (imports.Shop.isAvailable(item)) {
                var price = imports.Shop.getPrice(item);
                var balance = await imports.Data.inventory.getMoney(imports.user.id);
                if (balance >= price * quantity) {
                    await imports.Data.inventory.removeMoney(imports.user.id, price * quantity);
                    await imports.Data.inventory.addItem(imports.user.id, item.name, quantity);
                    var itemName = item.name;
                    if (quantity != 1) { if (itemName.endsWith('s')) { itemName = `${itemName}es` } else { itemName - `${itemName}s` } }
                    embed.setDescription(`you purchased ${quantity} ${itemName}`);
                }

                else { embed.setDescription(`you don't have enough money to buy that`) }
            }

            else { embed.setDescription(`that item isn't available`) }
        }

        else { embed.setDescription(`that item doesn't exist`) }
        imports.channel.send(embed);
    }
}