var fs = require('fs');
var Discord = require('discord.js');

module.exports = async function(imports) {
    imports.client.on('userUpdate', async function(oldUser, newUser) {
        try {
            var guilds = imports.client.guilds.array();
            for (var g = 0; g < guilds.length; g++) {
                if (guilds[g].members.get(newUser.id)) {
                    var guild = await imports.Data.getGuild(guilds[g].id);
                    if (guild.options.logs.namechanges) {
                        if (guild.config.logchannel != '') {
                            var id = guild.config.logchannel;
                            if (guilds[g].channels.get(id)) {
                                var channel = guilds[g].channels.get(id);  
                                if (channel.permissionsFor(guild.me).serialize(true).SEND_MESSAGES) {
                                    if (oldUser.username != newUser.username) {
                                        var embed = new Discord.RichEmbed();
                                        embed.setColor(guild.colors.logs.namechanges);
                                        embed.setFooter('username change', newUser.avatarURL);
                                        embed.setDescription(`**${oldUser.username}#${oldUser.discriminator}'s** username was changed to **${newUser.username}#${newUser.discriminator}**`);
                                        channel.send(embed);
                                    }
                                }  
                            }
                        }

                        else { imports.Data.setGuild(guilds[g].id, 'config.logchannel', '') }
                    }
                }
            }
        }

        catch(error) { console.error(error) }
    });
}