var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        description: 'inventory',
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        params: [
            { type: 'string', required: false, name: 'expanded?' }
        ]
    },

    command: async function(imports, parameters) {
        let expanded = false;
        if (parameters[0] && parameters[0] == 'expanded') { expanded = true }
        let items = imports.economy.items;

        let embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);

        if (expanded) { /* ... */ }

        else {
            let inventory = await imports.Data.inventory.get(imports.user.id);

            let keysArr = [];
            for (let k in inventory.key) { keysArr.push(items[k].emoji) }
            
            let itemsArr = [];
            for (let i in inventory.items) { itemsArr.push(`${items[i].emoji}x${inventory.items[i].length}`) }

            let keysText;
            if (keysArr.length == 0) { keysText = `you don't have anything equipped` }
            else { keysText = keysArr.join(' ') }
            embed.addField(`equipped`, keysText);

            let itemsText;
            if (itemsArr.length == 0) { itemsText = `nothing ;-;` }
            else { itemsText = itemsArr.join(' ') }
            embed.addField(`items`, itemsText);
        }

        imports.channel.send(embed);
    }
}