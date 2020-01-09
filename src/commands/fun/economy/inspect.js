var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        description: 'inspect something in your inventory',
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        params: [
            { type: 'string', required: true, name: 'items | keys' },
            { type: 'string', required: true, name: 'item' },
            { type: 'number', required: false, name: 'slot' }
        ]
    },

    command: async function(imports, parameters) {
        let embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
        let items = imports.economy.items;

        if (parameters[0] == 'items' || parameters[0] == 'keys') {
            let inspected;

            if (!items[parameters[1]]) { for (let i in items) { if (items[i].emoji == emoji.unemojify(parameters[1])) { parameters[1] = i } } }

            if (items[parameters[1]]) {
                let inventory = await imports.Data.inventory.get(imports.user.id);
                if (parameters[0] == 'items') {
                    if (inventory.items[parameters[1]]) {
                        let slot = 0;
                        if (parameters[2]) { slot = parseInt(parameters[2]) - 1 }
                        if (slot < 0 || (inventory.items[parameters[1]] && slot > inventory.items[parameters[1]].length - 1)) { slot = 0 }
                        inspected = inventory.items[parameters[1]][slot];
                        embed.setFooter(`${parameters[1]} @ items > slot ${slot+1}`);
                    }

                    else { embed.setDescription(`you don't have that in an item slot!`) }
                }
        
                else if (parameters[0] == 'keys') {
                    if (inventory.key[parameters[1]]) {
                        inspected = inventory.key[parameters[1]];
                    }

                    else { embed.setDescription(`you don't have that item in a key slot!`) }
                }

                if (inspected) {
                    if (inspected.items) {
                        let contains = {};
                        let containsArr = [];
                        for (let i in inspected.items) {
                            if (!contains[i]) { contains[i] = 0 }
                            contains[i] += 1;
                        }

                        for (let c in contains) { containsArr.push(`${items[c].emoji}x${contains[c]}`) }
                        if (containsArr.length == 0) { containsArr.push(`<empty>`) }

                        embed.addField(`contains`, containsArr.join(' '), true);
                    }
                }
            }

            else { embed.setDescription(`that item doesn't exist!`) }
    
        }

        else { embed.setDescription(`please specify a valid type!`) }

        imports.channel.send(embed);
    }
}