var Discord = require('discord.js');

module.exports = function(imports, arguments) {
    var embed = new Discord.RichEmbed();
    embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);

    if (imports.guild.me.permissions.serialize().MANAGE_NICKNAMES) {
        if (arguments[0] == 'remove') {
            if (imports.Command.methods.mention(arguments[1]).pass) {
                var id = imports.Command.methods.mention(arguments[1]).value;
                var member = imports.guild.members.get(id);
                if (member.nickname != null) {
                    member.setNickname('');
                    embed.setDescription('**' + member.user.username + '#' + member.user.discriminator + '**\'s nickname has been removed');
                    imports.channel.send(embed);
                }

                else {
                    embed.setDescription('**' + member.user.username + '#' + member.user.discriminator + '** doesn\'t have a nickname');
                    imports.channel.send(embed);
                }
            }

            else {
                embed.setDescription('please mention the user that you want to remove the nickname from');
                imports.channel.send(embed);
            }
        }

        else {
            if (imports.Command.methods.mention(arguments[0]).pass) {
                var id = imports.Command.methods.mention(arguments[0]).value;
                var member = imports.guild.members.get(id);
                if (member.nickname != null) {
                    var before = member.nickname;
                    member.setNickname(arguments[1]);
                    embed.setDescription('**' + member.user.username + '#' + member.user.discriminator + '**\'s nickname has been changed from "**' + before + '**" to "**' + arguments[1] + '**"');
                    imports.channel.send(embed);
                }

                else {
                    member.setNickname(arguments[1]);
                    embed.setDescription('**' + member.user.username + '#' + member.user.discriminator + '**\'s nickname has been set to "**' + arguments[1] + '**"');
                    imports.channel.send(embed);
                }
            }

            else {
                embed.setDescription('please mention the user that you want to change the nickname of');
                imports.channel.send(embed);
            }
        }
    }

    else {
        embed.setDescription('I don\'t have permission to do that');
        imports.channel.send(embed);
    }
}