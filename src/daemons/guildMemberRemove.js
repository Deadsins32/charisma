var fs = require('fs');
var Discord = require('discord.js');

module.exports = function(imports) {
    imports.client.on('guildMemberRemove', function(member) {
        try {
            if (imports.data.guilds[member.guild.id]) {
                if (imports.data.guilds[member.guild.id].config.logchannel != '') {
                    if (imports.data.guilds[member.guild.id].features.logs.leaves) {
                        var id = imports.data.guilds[member.guild.id].config.logchannel;
                        if (member.guild.channels.get(id)) {
                            var channel = member.guild.channels.get(id);
                            if (channel.permissionsFor(member.guild.me).serialize(true).SEND_MESSAGES) {
                                var embed = new Discord.RichEmbed();
                                embed.setColor(imports.data.guilds[member.guild.id].colors.logs.leaves);
                                embed.setFooter('user leave', member.user.avatarURL);
                                embed.setDescription(`**${member.user.username}#${member.user.discriminator}** has left the server`);
                                channel.send(embed);
                            }
                        }
        
                        else {
                            imports.data.guilds[member.guild.id].config.logchannel = '';
                        }
                    }
                }
            }
        }

        catch(error) { imports.error(error) }
    });
}