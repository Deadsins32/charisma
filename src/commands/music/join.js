var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        description: 'make me join the voice channel you\'re in',
        hidden: false,
        nsfw: false,
        tags: ['fun', 'music'],
        params: []
    },

    command: async function(imports) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
        if (imports.member.voiceChannel) {
            if (imports.member.voiceChannel.joinable) {
                imports.music[imports.guild.id] = {
                    connection: await imports.member.voiceChannel.join(),
                    queue: new Array(),
                    playing: false
                }
    
                imports.music[imports.guild.id].connection.on('error', function(error) {
                    console.error(error);
                    imports.music[imports.guild.id].connection.disconnect();
                    delete imports.music[imports.guild.id];
                });
    
                embed.setDescription(`connected to \`${imports.member.voiceChannel.name}\``);
            }
    
            else {
                embed.setDescription(`I don't have permission to join that voice channel`);
            }
        }
    
        else {
            embed.setDescription(`you're not in a voice channel`);
        }
    
        imports.channel.send(embed);
    }
}