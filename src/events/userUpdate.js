var fs = require('fs');
var Discord = require('discord.js');
module.exports = function(imports, oldUser, newUser) {
    for (g in imports.data.guilds) {
        if (imports.data.guilds[g]) {
            if (imports.data.guilds[g].config.logchannel != '') {
                if (imports.data.guilds[g].options.logs.namechanges) {
                    var id = imports.data.guilds[g].config.logchannel;
                    if (imports.client.guilds.find('id', g)) {
                        var guild = imports.client.guilds.find('id', g);
                        if (guild.members.find('id', newUser.id)) {
                            if (guild.channels.find('id', id)) {
                                var channel = guild.channels.find('id', id);
                                if (channel.permissionsFor(guild.me).serialize(true).SEND_MESSAGES) {
                                    if (oldUser.username != newUser.username) {
                                        var embed = new Discord.RichEmbed();
                                        embed.setColor(imports.data.guilds[g].colors.logs.namechanges);
                                        embed.setFooter('username change', newUser.avatarURL);
                                        embed.setDescription('**' + oldUser.username + '#' + oldUser.discriminator + '\'s** username was changed to **' + newUser.username + '#' + newUser.discriminator + '**');
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