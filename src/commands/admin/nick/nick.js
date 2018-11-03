var Discord = require('discord.js');

module.exports = function(imports, arguments) {
    var embed = new Discord.RichEmbed();
    embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);

    if (arguments[0] == 'remove') {
        var id = arguments[1];
        var member = imports.guild.members.get(id);
        if (member.nickname != null) {
            member.setNickname('').then(function() {
                embed.setDescription('**' + member.user.username + '#' + member.user.discriminator + '**\'s nickname has been removed');
                imports.channel.send(embed);
            }).catch(function() {
                embed.setDescription('I don\'t have permission to nick that user');
                imports.channel.send(embed);
            });
        }

        else {
            embed.setDescription('**' + member.user.username + '#' + member.user.discriminator + '** doesn\'t have a nickname');
            imports.channel.send(embed);
        }
    }

    else if (arguments[0] == 'set') {
        var id = arguments[1];
        var member = imports.guild.members.get(id);
        if (member) {
            if (arguments[2]) {
                if (member.nickname != null) {
                    var before = member.nickname;
                    console.log(before);
                    member.setNickname(arguments[2]).then(function() {
                        embed.setDescription('**' + member.user.username + '#' + member.user.discriminator + '**\'s nickname has been changed from "**' + before + '**" to "**' + member.nickname + '**"');
                        imports.channel.send(embed);
                    }).catch(function() {
                        embed.setDescription('I don\'t have permission to nick that user');
                        imports.channel.send(embed);
                    });
                }

                else {
                    var after = arguments[2];
                    member.setNickname(arguments[2]).then(function() {
                        embed.setDescription('**' + member.user.username + '#' + member.user.discriminator + '**\'s nickname has been set to "**' + after + '**"');
                        imports.channel.send(embed);
                    }).catch(function() {
                        embed.setDescription('I don\'t have permission to nick that user');
                        imports.channel.send(embed);
                    });
                }
            }

            else {
                embed.setDescription('please specify a nickname');
                imports.channel.send(embed);
            }
        }

        else {
            embed.setDescription('invalid user');
            imports.channel.send(embed);
        }
    }

    else {
        embed.setDescription('invalid option\n( remove | set )');
        imports.channel.send(embed);
    }
}