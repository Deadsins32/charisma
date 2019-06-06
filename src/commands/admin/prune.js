var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: ['DISCORD.MANAGE_MESSAGES'],
        description: 'deletes a specified amount of messages',
        hidden: false,
        nsfw: false,
        tags: ['management', 'admin'],
        params: [
            { type: 'number', required: true, name: 'quantity' }
        ]
    },

    command: async function(imports, parameters) {
        var number = parseInt(parameters[0]);
        var whole = Math.floor(number / 100);
        var remainder = number % 100;
    
        for (var w = 0; w < whole; w++) {
            var fetched = await imports.channel.fetchMessages({ limit: 100 });
            for (f in fetched.array()) { await fetched.array()[f].delete() }
        }
    
        var fetched = await imports.channel.fetchMessages({limit: remainder + 1})
        for (f in fetched.array()) { await fetched.array()[f].delete() }
    
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
        embed.setDescription(`${number} messages have been deleted`);
        imports.channel.send(embed);
    }
}