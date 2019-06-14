var Discord = require('discord.js');
var emoji = require('node-emoji');

module.exports = {
    config: {
        permissions: [],
        description: 'plant something',
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        cooldown: 120000,
        params: [ {type: "string", required: true, name: "seed"} ]
    },

    command: async function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
        
        var items = imports.Data.getItems();
        var item;
        if (items[parameters[0]]) { item = items[parameters[0]] }
        else { for (var i in items) { if (items[i].emoji == emoji.unemojify(parameters[0]).split(' ').join('')) { item = items[i] } } }

        if (item) {
            if (item.tags.includes('seed')) {
                if (item.plantType == 'tree') {
                    var date = new Date();
                    var now = date.getTime();
                    var itemName = item.name.split(' seed')[0];
                    if (!imports.local.user.trees[itemName]) { imports.local.user.trees[itemName] = [] }
                    imports.local.user.trees[itemName].push({ planted: now, harvestedLast: -1 });
                    imports.Data.inventory.removeItem(imports.user.id, `${itemName} seed`);
                    embed.setDescription(`you just planted an ${items[itemName].emoji} **${itemName} tree**`);
                }
            }

            else { imports.local.user.cooldowns.plant = -1; embed.setDescription(`that item can't be planted`) }
        }

        else { imports.local.user.cooldowns.plant = -1; embed.setDescription(`that item doesn't exist`) }
        imports.channel.send(embed);
    }
}