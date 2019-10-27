var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        description: 'make me leave the current channel',
        hidden: false,
        nsfw: false,
        tags: ['fun'],
        params: []
    },

    command: function(imports) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
    
        if (imports.guild.me.voiceChannel) {
            if (imports.member.voiceChannel) {
                if (imports.guild.me.voiceChannel.id == imports.member.voiceChannel.id) {
                    music.instances[imports.guild.id].connection.disconnect();
                    delete music.instances[imports.guild.id];
                    embed.setDescription(`left the channel`);
                }
    
                else { embed.setDescription(`you're not in this voice channel`) }
            }
    
            else { embed.setDescription(`you're not in a voice channel`) }
        }
    
        else { embed.setDescription(`I'm not in a voice channel`) }
    
        imports.channel.send(embed);
    }
}