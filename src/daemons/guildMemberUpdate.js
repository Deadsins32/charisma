var fs = require('fs');
var Discord = require('discord.js');

module.exports = function(imports) {
    imports.client.on('guildMemberUpdate', function(oldMember, newMember) {
        try {
            if (imports.data.guilds[newMember.guild.id]) {
                if (imports.data.guilds[newMember.guild.id].config.logchannel != '') {
                    if (imports.data.guilds[newMember.guild.id].features.logs.nicknamechanges) {
                        var id = imports.data.guilds[newMember.guild.id].config.logchannel;
                        if (newMember.guild.channels.get(id)) {
                            var channel = newMember.guild.channels.get(id);
                            if (channel.permissionsFor(newMember.guild.me).serialize(true).SEND_MESSAGES) {
                                if (newMember.nickname != oldMember.nickname) {
                                    var embed = new Discord.RichEmbed();
                                    embed.setColor(imports.data.guilds[newMember.guild.id].colors.logs.nicknamechanges);
                                    embed.setFooter('nickname change', newMember.user.avatarURL);
                                
                                    if (oldMember.nickname == null && newMember.nickname != null) {
                                        embed.setDescription(`**${newMember.user.username}#${newMember.user.discriminator}'s** nickname has been set to **${newMember.nickname}**`);
                                    }
        
                                    else if (oldMember.nickname != null && newMember.nickname == null) {
                                        embed.setDescription(`**${newMember.user.username}#${newMember.user.discriminator}'s** nickname has been removed`);
                                    }
        
                                    else { embed.setDescription(`**${newMember.user.username}#${newMember.user.discriminator}'s** nickname has been changed to **${newMember.nickname}**`) }
        
                                    channel.send(embed);
                                }
                            }
                        }
        
                        else {
                            imports.data.guilds[newMember.guild.id].config.logchannel = '';
                        }
                    }
                }
            }
        }

        catch(error) { imports.error(error) }
    });
}