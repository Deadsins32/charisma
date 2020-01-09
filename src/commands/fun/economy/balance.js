var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        description: 'gets your balance',
        hidden: false,
        nsfw: false,
        aliases: ['bal'],
        tags: ['economy'],
        params: []
    },

    command: async function(imports) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
        embed.setDescription(`$${await imports.Data.inventory.money.get(imports.user.id)}`);
        imports.channel.send(embed);
    }
}