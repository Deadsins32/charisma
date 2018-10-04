var fs = require('fs');
var Discord = require('discord.js');
module.exports = function(imports, oldUser, newUser) {
    for (g in imports.settings.guilds) {
        if (imports.settings.guilds[g]) {
            if (imports.settings.guilds[g].logchannel != '') {
                if (imports.settings.guilds[g].features.logs.namechanges) {
                    var id = imports.settings.guilds[g].logchannel;
                    if (imports.client.guilds.find('id', g)) {
                        var guild = imports.client.guilds.find('id', g);
                        if (guild.members.find('id', newUser.id)) {
                            if (guild.channels.find('id', id)) {
                                var channel = guild.channels.find('id', id);
                                if (channel.permissionsFor(guild.me).serialize(true).SEND_MESSAGES) {
                                    if (oldUser.username != newUser.username) {
                                        var embed = new Discord.RichEmbed();
                                        embed.setColor(imports.settings.guilds[g].colors.logs.namechanges);
                                        embed.setFooter('username change', newUser.avatarURL);
                                        embed.setDescription('**' + oldUser.username + '#' + oldUser.discriminator + '\'s** username was changed to **' + newUser.username + '#' + newUser.discriminator + '**');
                                        channel.send(embed);
                                    }
                                }
                            }

                            else {
                                imports.settings.guilds[g].logchannel = '';
                                var json = JSON.stringify(imports.settings.guilds, null, 4);
                                fs.writeFileSync('./settings/guilds.json', json);
                            }
                        }
                    }
                }
            }
        }
    }
}