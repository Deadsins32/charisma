var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        description: 'skips the song that\'s currently playing',
        hidden: false,
        nsfw: false,
        tags: ['fun'],
        params: []
    },

    command: async function(imports) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
        if (imports.member.voiceChannel) {
            if (imports.guild.me.voiceChannel) {
                if (imports.member.voiceChannel.id == imports.guild.me.voiceChannel.id) {
                    if (music.instances[imports.guild.id].playing) {
                        var title = music.instances[imports.guild.id].queue[0].title;
                        music.instances[imports.guild.id].connection.dispatcher.end();
                        embed.setDescription(`skipped **'${title}'**`);
                        imports.channel.send(embed);
                    }
    
                    else {
                        embed.setDescription(`nothing is playing right now`);
                        imports.channel.send(embed);
                    }
                }
    
                else {
                    embed.setDescription(`I'm not in that voice channel`);
                    imports.channel.send(embed);
                }
            }
    
            else {
                embed.setDescription(`I'm not in a voice channel`);
                imports.channel.send(embed);
            }
        }
    
        else {
            embed.setDescription(`you're not in a voice channel`);
            imports.channel.send(embed);
        }
    }
}