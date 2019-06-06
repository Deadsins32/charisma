var Discord = require('discord.js');

module.exports = async function(imports) {
    imports.client.on('guildMemberUpdate', async function(oldMember, newMember) {
        try {
            var guild = await imports.Data.getGuild(newMember.guild.id);
            if (guild.options.nicknamechanges) {
                if (guild.config.logchannel != '') {
                    var id = guild.config.logchannel;
                    if (newMember.guild.channels.get(id)) {
                        var channel = newMember.guild.channels.get(id);
                        if (channel.permissionsFor(newMember.guild.me).serialize(true).SEND_MESSAGES) {
                            if (newMember.nickname != oldMember.nickname) {
                                var embed = new Discord.RichEmbed();
                                embed.setColor(guild.colors.logs.nicknamechanges);
                                embed.setFooter('nickname change', newMember.user.avatarURL);
                                if (oldMember.nickname == null && newMember.nickname != null) { embed.setDescription(`**${newMember.user.username}#${newMember.user.discriminator}'s** nickname has been set to **${newMember.nickname}**`) }
                                else if (oldMember.nickname != null && newMember.nickname != null) { embed.setDescription(`**${newMember.user.username}#${newMember.user.discriminator}**'s nickname has been removed`) }
                                else { embed.setDescription(`**${newMember.user.username}#${newMember.user.discriminator}'s** nickname has been changed to **${newMember.nickname}**`) }
                                channel.send(embed);
                            }
                        }
                    }

                    else { imports.Data.setGuild(newMember.guild.id, 'config.logchannel', '') }
                }
            }
        }

        catch(error) { console.error(error) }
    });
}