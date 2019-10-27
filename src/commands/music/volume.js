var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        description: 'sets the volume of the music stream',
        hidden: false,
        nsfw: false,
        tags: ['fun'],
        params: [
            { type: 'number', required: true, name: '0-100' }
        ]
    },

    command: async function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);

        if (imports.member.voiceChannel) {
            if (imports.guild.me.voiceChannel) {
                if (imports.member.voiceChannel.id == imports.guild.me.voiceChannel.id) {
                    music.instances[imports.guild.id].volume = parameters[0];
                    music.instances[imports.guild.id].connection.dispatcher.setVolume(parameters[0]/100);
                    embed.setDescription(`the volume has been set to ${parameters[0]}`);
                }

                else { embed.setDescription(`I'm not in that voice channel`) }
            }

            else { embed.setDescription(`I'm not in a voice channel`) }
        }

        else { embed.setDescription(`you're not in a voice channel`) }
        
        imports.channel.send(embed);
    }
}