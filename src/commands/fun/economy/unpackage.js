var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        description: 'unpackage a container',
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        params: [
            { type: 'string', required: true, name: 'item' },
            { type: 'number', required: false, name: 'slot' }
        ]
    },

    command: async function(imports, parameters) {
        let items = imports.economy.items;
        let embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);

        if (!items[parameters[0]]) { for (let i in items) { if (items[i].emoji == emoji.unemojify(parameters[0])) { parameters[1] = i } } }

        if (items[parameters[0]]) {
            let inventory = await imports.Data.inventory.get(imports.user.id);
            if (inventory.items[parameters[0]]) {
                let slot = 0;
                if (parameters[1]) { slot = parameters[1] - 1 }
                if (slot < 0 || slot > inventory.items[parameters[0]].length) { slot = 0 }
                let item = inventory.items[parameters[0]][slot];
                if (item.items) {
                    let count = 0;
                    for (let p in item.items) { if (item.items.hasOwnProperty(p)) { count++ } }
                    if (count != 0) {
                        let boxedItems = [];
                        for (let i in item.items) { boxedItems.push(`${items[i].emoji}x${item.items[i].length}`) }
                        let requestEmbed = new Discord.RichEmbed();
                        embed.setColor(imports.local.guild.colors.accent);
                        requestEmbed.setDescription(`are you sure you want to unpackage ${items[parameters[0]].emoji} (${boxedItems.join(' ')})?\ndo \`${imports.local.guild.config.prefix}accept\` to accept`);
                        imports.channel.send(requestEmbed);

                        let requestResponse = await imports.awaitRequest(imports.guild.id, imports.channel.id, imports.user.id);
                        let responseEmbed = new Discord.RichEmbed();
                        responseEmbed.setColor(imports.local.guild.colors.accent);

                        if (requestResponse == -1) { responseEmbed.setDescription(`you already have a pending request!`) }
                        else if (requestResponse == 0) { responseEmbed.setDescription(`the request has timed out!`) }
                        else if (requestResponse == 1) {
                            inventory.items[parameters[0]][slot].items = {};
                            await imports.Data.inventory.item.addMany(imports.user.id, item.items);
                            await imports.Data.inventory.item.setMeta(imports.user.id, parameters[0], slot, inventory.items[parameters[0]][slot]);
                            responseEmbed.setDescription(`the following has been added to your inventory: ${boxedItems.join(' ')}`);
                        }

                        imports.channel.send(responseEmbed);
                    }

                    else { embed.setDescription(`there's nothing currently stored in that item!`) }
                }

                else { embed.setDescription(`that item can't store anything!`) }
            }

            else { embed.setDescription(`you don't have that item in your inventory!`) }
        }

        else { embed.setDescription(`that item doesn't exist!`) }

        if (embed.description) { imports.channel.send(embed) }
    }
}