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
        let embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
        
        let quantity = 1;
        if (parameters[1]) { quantity = parameters[1] }

        let items = imports.economy.items;
        let item;
        if (items[parameters[0]]) { item = items[parameters[0]] }
        else { for (let i in items) { if (items[i].emoji == emoji.unemojify(parameters[0])) { item = items[i] } } }
        
        if (item) {
            if (imports.shop.isAvailable(item)) {
                let price = imports.shop.getPrice(item);
                let balance = await imports.Data.inventory.money.get(imports.user.id);
                if (balance >= price * quantity) {
                    await imports.Data.inventory.money.remove(imports.user.id, price * quantity);
                    await imports.Data.inventory.item.add(imports.user.id, item.name, {});
                    embed.setDescription(`you purchased ${item.emoji}x${quantity}`);
                }

                else { embed.setDescription(`you don't have enough money to buy that`) }
            }

            else { embed.setDescription(`that item isn't available`) }
        }

        else { embed.setDescription(`that item doesn't exist`) }

        let newDescription = embed.description;
        let split = newDescription.split(' ');
        for (let s = 0; s < split.length; s++) {
            for (let i in items) {
                if (split[s].split('x')[0] == items[i].emoji) {
                    let obtained = await imports.Data.inventory.item.obtained.get(imports.user.id, items[i].name);
                    if (obtained == 1) { newDescription = newDescription.replace(split[s], `${split[s]} (${items[i].name})`); embed.setDescription(newDescription); }
                }
            }
        }

        imports.channel.send(embed);
    }
}