var Discord = require('discord.js');

module.exports = async function(imports) {
    imports.client.on('guildMemberAdd', async function(member) {
        try {
            var guild = await imports.Data.getGuild(member.guild.id);
            if (guild.options.logs.joins) {
                if (guild.config.logchannel != '') {
                    var id = guild.config.logchannel;
                    if (member.guild.channels.get(id)) {
                        var channel = member.guild.channels.get(id);
                        if (channel.permissionsFor(member.guild.me).serialize(true).SEND_MESSAGES) {
                            var embed = new Discord.RichEmbed();
                            embed.setColor(guild.colors.logs.joins);
                            embed.setFooter('user join', member.user.avatarURL);
                            embed.setDescription(`**${member.user.username}#${member.user.discriminator}** has joined the server`);
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