var fs = require('fs');
var Discord = require('discord.js');
module.exports = function(imports, member) {
    if (imports.data.guilds[member.guild.id]) {
        if (imports.data.guilds[member.guild.id].config.logchannel != '') {
            if (imports.data.guilds[member.guild.id].options.logs.joins) {
                var id = imports.data.guilds[member.guild.id].config.logchannel;
                if (member.guild.channels.find('id', id)) {
                    var channel = member.guild.channels.find('id', id);
                    if (channel.permissionsFor(member.guild.me).serialize(true).SEND_MESSAGES) {
                        var embed = new Discord.RichEmbed();
                        embed.setColor(imports.data.guilds[member.guild.id].colors.logs.joins);
                        embed.setFooter('user join', member.user.avatarURL);
                        embed.setDescription('**' + member.user.username + '#' + member.user.discriminator + '** has joined the server');
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