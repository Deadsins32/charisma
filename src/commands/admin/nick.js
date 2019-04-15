var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: ['DISCORD.MANAGE_NICKNAMES'],
        description: 'changes the nickname of whoever you specify to whatever you specify',
        tags: ['management', 'admin'],
        hidden: false,
        nsfw: false,
        params: [
            { type: 'string', required: true, name: 'set | remove' },
            { type: 'mention', required: true, name: 'user' },
            { type: 'string', required: false, name: 'nickname' }
        ]
    },

    command: function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
    
        if (parameters[0] == 'remove') {
            var id = parameters[1];
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
                embed.setDescription(`**${member.user.username}#${member.user.discriminator}** doesn't have a nickname`);
                imports.channel.send(embed);
            }
        }
    
        else if (parameters[0] == 'set') {
            var id = parameters[1];
            var member = imports.guild.members.get(id);
            if (member) {
                if (parameters[2]) {
                    if (member.nickname != null) {
                        var before = member.nickname;
                        console.log(before);
                        member.setNickname(parameters[2]).then(function() {
                            embed.setDescription('**' + member.user.username + '#' + member.user.discriminator + '**\'s nickname has been changed from '**' + before + '**' to '**' + member.nickname + '**'');
                            imports.channel.send(embed);
                        }).catch(function() {
                            embed.setDescription('I don\'t have permission to nick that user');
                            imports.channel.send(embed);
                        });
                    }
    
                    else {
                        var after = parameters[2];
                        member.setNickname(parameters[2]).then(function() {
                            embed.setDescription(`**${member.user.username}#${member.user.discriminator}**'s nickname has been set to **${after}**`);
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
}