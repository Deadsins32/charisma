var Discord = require('discord.js');
var emoji = require('node-emoji');

module.exports = {
    config: {
        permissions: [],
        description: 'eat something from your inventory',
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        cooldown: 60000,
        params: [ {type: "string", required: true, "name": "item/emoji"} ]
    },

    command: async function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
        
        var items = imports.Data.getItems();
        var item;
        if (items[parameters[0]]) { item = items[parameters[0]] }
        else { for (var i in items) { if(items[i].emoji == emoji.unemojify(parameters[0])) { item = items[i] } } }

        if (item) {
            var getItem = await imports.Data.inventory.getItem(imports.user.id, item.name);
            if (getItem) {
                if (item.tags.includes('food')) {
                    await imports.Data.inventory.removeItem(imports.user.id, item.name);
                    var description = `you ate a ${item.emoji}`;
                    var randMoney = Math.floor(Math.random() * 5);
                    if (randMoney == 0) {
                        var money = Math.floor(Math.random() * 200) + 10;
                        await imports.Data.inventory.addMoney(imports.user.id, money);
                        description = `${description} and found **$${money}**`;
                    }
    
                    else {
                        if (items[`${item.name} seed`]) {
                            var randSeed = Math.floor(Math.random() * 15);
                            if (randSeed == 0) {
                                await imports.Data.inventory.addItem(imports.user.id, `${item.name} seed`);
                                description = `${description} and found an ${items[`${item.name} seed`].emoji} **${item.name} seed**`;
                            }
                        }
                    }
    
                    embed.setDescription(description);
                }

                else { imports.local.user.cooldowns.eat = -1; embed.setDescription(`you can't eat that item`) }
            }

            else { imports.local.user.cooldowns.eat = -1; embed.setDescription(`you don't have that item`) }
        }

        else { imports.local.user.cooldowns.eat = -1; embed.setDescription(`that item doesn't exist`) }

        imports.channel.send(embed);
    }
}