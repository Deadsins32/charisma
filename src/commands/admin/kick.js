var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: ['DISCORD.KICK_MEMBERS'],
        description: 'kicks whoever you specify',
        hidden: false,
        nsfw: false,
        tags: ['management', 'admin'],
        params: [
            { type: 'mention', required: true, name: 'member' },
            { type: 'string', required: false, name: 'reason' }
        ]
    },

    command: function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
    
        var id = parameters[0];
        var reason = 'NO REASON';
        if (parameters[1] != undefined) {
            reason = parameters[1];
        }
    
        if (imports.user.id != id) {
            var member = imports.guild.members.find('id', id);
    
            member.kick(reason)
                .then((function() {
                    embed.setDescription(`**${member.displayName}** has been kicked for **"${reason}"**`)
                    imports.channel.send(embed);
                }).catch((function(error) { console.log(error) })));
        }
    
        else {
            embed.setDescription(`you can't kick yourself`);
            imports.channel.send(embed);
        }
    }
}