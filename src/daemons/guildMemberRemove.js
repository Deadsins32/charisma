var Discord = require('discord.js');

module.exports = async function(imports) {
    imports.client.on('guildMemberRemove', async function(member) {
        try {
            var guild = await imports.Data.getGuild(member.guild.id);
            if (guild.options.logs.leaves) {
                if (guild.config.logchannel != '') {
                    var id = guild.config.logchannel;
                    if (member.guild.channels.get(id)) {
                        var channel = member.guild.channels.get(id);
                        if (channel.permissionsFor(member.guild.me).serialize(true).SEND_MESSAGES) {
                            var embed = new Discord.RichEmbed();
                            embed.setColor(guild.colors.logs.leaves);
                            embed.setFooter('user leave', member.user.avatarURL);
                            embed.setDescription(`**${member.user.username}#${member.user.discriminator}** has left the server`);
                            channel.send(embed);
                        }

                        else { await imports.Data.setGuild(member.guild.id, 'config.logchannel', '') }
                    }
                }
            }
        }

        catch(error) { console.error(error) }
    });
}