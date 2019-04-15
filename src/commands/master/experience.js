var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: ['BOT.MASTER'],
        description: 'makes the bot say whatever you specify',
        hidden: false,
        nsfw: false,
        params: [
            { type: 'string', required: true },
            { type: 'number', required: false },
            { type: 'mention', required: false }
        ]
    },

    command: function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
        var member = imports.member;
        if (parameters[2]) { member = imports.guild.members.get(parameters[2]) }
    
        if (parameters[0] == 'add') {
            if (parameters[1]) {
                imports.Experience.add(imports, member, parameters[1], true);
            }
    
            else {
                embed.setDescription('please specify an exp value');
                imports.channel.send(embed);
            }
        }
    
        else {
            embed.setDescription('unknown operation');
            imports.channel.send(embed);
        }
    }
}