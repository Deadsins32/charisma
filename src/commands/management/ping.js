var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        description: 'gets the ping of the bot in milliseconds',
        hidden: false,
        nsfw: false,
        tags: ['management', 'utility'],
        params: []
    },

    command: async function(imports) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
        embed.setDescription('pinging...');
    
        var timestamp1 = Date.now();
        var message = await imports.channel.send(embed);
        var timestamp2 = Date.now();
    
        var newEmbed = new Discord.RichEmbed();
        newEmbed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
        newEmbed.setDescription(`${timestamp2 - timestamp1}ms`);
        message.edit(newEmbed);
    }
}