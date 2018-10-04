var fs = require('fs');
var Discord = require('discord.js');
module.exports = function(imports, member) {
    if (imports.settings.guilds[member.guild.id]) {
        if (imports.settings.guilds[member.guild.id].logchannel != '') {
            if (imports.settings.guilds[member.guild.id].features.logs.joins) {
                var id = imports.settings.guilds[member.guild.id].logchannel;
                if (member.guild.channels.find('id', id)) {
                    var channel = member.guild.channels.find('id', id);
                    if (channel.permissionsFor(member.guild.me).serialize(true).SEND_MESSAGES) {
                        var embed = new Discord.RichEmbed();
                        embed.setColor(imports.settings.guilds[member.guild.id].colors.logs.joins);
                        embed.setFooter('user join', member.user.avatarURL);
                        embed.setDescription('**' + member.user.username + '#' + member.user.discriminator + '** has joined the server');
                        channel.send(embed);
                    }
                }

                else {
                    imports.settings.guilds[member.guild.id].logchannel = '';
                    var json = JSON.stringify(imports.settings.guilds, null, 4);
                    fs.writeFileSync('./settings/guilds.json', json);
                }
            }
        }
    }
}