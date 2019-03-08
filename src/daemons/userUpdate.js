var fs = require('fs');
var Discord = require('discord.js');

module.exports = function(imports) {
    imports.client.on('userUpdate', function(oldUser, newUser) {
        try {
            for (g in imports.data.guilds) {
                if (imports.data.guilds[g]) {
                    if (imports.data.guilds[g].config.logchannel != '') {
                        if (imports.data.guilds[g].options.logs.namechanges) {
                            var id = imports.data.guilds[g].config.logchannel;
                            if (imports.client.guilds.get(g)) {
                                var guild = imports.client.guilds.get(g);
                                if (guild.members.get(newUser.id)) {
                                    if (guild.channels.get(id)) {
                                        var channel = guild.channels.get(id);
                                        if (channel.permissionsFor(guild.me).serialize(true).SEND_MESSAGES) {
                                            if (oldUser.username != newUser.username) {
                                                var embed = new Discord.RichEmbed();
                                                embed.setColor(imports.data.guilds[g].colors.logs.namechanges);
                                                embed.setFooter('username change', newUser.avatarURL);
                                                embed.setDescription(`**${oldUser.username}#${oldUser.discriminator}'s** username was changed to **${newUser.username}#${newUser.discriminator}**`);
                                                channel.send(embed);
                                            }
                                        }
                                    }
        
                                    else {
                                        imports.data.guilds[g].config.logchannel = '';
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        catch(error) { imports.error(error) }
    });
}