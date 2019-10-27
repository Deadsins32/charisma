var Discord = require('discord.js');
var emoji = require('node-emoji');

function isEmpty(obj) {
    for (var key in obj) { if (obj.hasOwnProperty(key)) { return false } }
    return true;
}

module.exports = {
    config: {
        permissions: [],
        description: 'empty a container into your inventory',
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        params: [ { type: "string", required: true, "name": "item/emoji" } ]
    },

    command: async function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
        
        var items = imports.Data.getItems();
        var item;
        if (items[parameters[0]]) { item = items[parameters[0]] }
        else { for (var i in items) { if(items[i].emoji == emoji.unemojify(parameters[0])) { item = items[i] } } }

        /*setItemMeta: async function(id, item, slot, meta) {
            var inventory = await this.get(id);
            if (inventory.items[item]) { if (inventory.items[item].meta[slot]) { inventory.items[item].meta[slot] = meta } }
            await rethink.db('charisma').table('inventories').get(id).replace(inventory).run(connection);
        }, */

        if (item) {
            var obj = await imports.Data.inventory.getContainer(imports.user.id, item.name, 0);
            if (obj) {
                var contents = obj.contents;
                var itemsArr = new Array();
                for (var c in contents) {
                    await imports.Data.inventory.addItem(imports.user.id, c, contents[c]);
                    itemsArr.push(`${items[c].emoji}x${contents[c]}`);
                }

                await imports.Data.inventory.removeContainer(imports.user.id, item.name, 0);
                embed.setDescription(`you opened a ${item.emoji} and got:\n ${itemsArr.join(' ')}`);
            }

            else { embed.setDescription(`you don't have any unopened ${item.emoji}'s`) }
        }

        else { embed.setDescription(`that item doesn't exist`) }

        var newDescription = embed.description;
        var items = imports.Data.getItems();
        var split = newDescription.split(' ');
        for (var s = 0; s < split.length; s++) {
            for (var i in items) {
                if (split[s].split('x')[0] == items[i].emoji) {
                    var obtained = await imports.Data.inventory.getObtained(imports.user.id, items[i].name);
                    if (obtained == 1) { newDescription = newDescription.replace(split[s], `${split[s]} (${items[i].name})`) }
                }
            }
        }
        
        embed.setDescription(newDescription);

        imports.channel.send(embed);
    }
}