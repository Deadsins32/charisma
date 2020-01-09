var Discord = require('discord.js');
let emoji = require('node-emoji');

module.exports = {
    config: {
        permissions: [],
        description: 'gets the ping of the bot in milliseconds',
        hidden: false,
        nsfw: false,
        tags: ['management', 'utility'],
        params: [
            { type: 'string', required: true, name: 'item' },
        ]
    },

    command: async function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);

        /*var item = items[parameters[0]];
        if (!item) { for (var i in items) { if (items[i].emoji == emoji.unemojify(parameters[0]).split(' ').join('')) { item = items[i] } } }*/

        let items = imports.economy.items;

        if (!items[parameters[0]]) { for (let i in items) { if (items[i].emoji == emoji.unemojify(parameters[0]).split(' ').join('')) { parameters[0] = items[i].name } } }
        
        if (items[parameters[0]]) {
            let inventory = await imports.Data.inventory.get(imports.user.id);
            if (inventory.items[parameters[0]]) {
                if (inventory.items[parameters[0]].length != 1) {
                    embed.setDescription(`which slot of ${items[parameters[0]].emoji} do you want to equip? (1-${inventory.items[parameters[0]].length})`);
                    let sentEmbed = await imports.channel.send(embed);
                    let messages = await imports.channel.awaitMessages(m => m.author.id == imports.user.id && !isNaN(m) && inventory.items[parameters[0]][parseInt(m) + 1], { time: 30000, errors: ['time'] });
                    let slot = parseInt(messages.first().content);
                    let newEmbed = new Discord.RichEmbed();
                    newEmbed.setColor(imports.local.guild.colors.accent);
                    newEmbed.setDescription(`you equipped ${items[parameters[0]].emoji}`);
                    sentEmbed.edit(newEmbed);
                    await imports.Data.inventory.item.key.set(imports.user.id, parameters[0], inventory.items[parameters[0]][slot]);
                    await imports.Data.inventory.item.remove(imports.user.id, parameters[0], slot);
                }

                else {
                    await imports.Data.inventory.item.key.set(imports.user.id, parameters[0], inventory.items[parameters[0]][0]);
                    await imports.Data.inventory.item.remove(imports.user.id, parameters[0], 0);
                    embed.setDescription(`you equipped ${items[parameters[0]].emoji}`);
                    imports.channel.send(embed);
                }
            }

            else { embed.setDescription(`you don't have a ${items[parameters[0]].emoji} to equip`); imports.channel.send(embed) }
        }

        else { embed.setDescription(`that item doesn't exist`); imports.channel.send(embed) }
    }
}