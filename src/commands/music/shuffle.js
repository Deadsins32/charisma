var Discord = require('discord.js');

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

module.exports = {
    config: {
        permissions: [],
        description: 'shuffles the music queue',
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
                    music.instances[imports.guild.id].connection.dispatcher.end('shuffle');
                    shuffle(music.instances[imports.guild.id].queue);
                    music.play(imports.guild.id, music.instances[imports.guild.id].queue[0]);
                    embed.setDescription(`shuffled the queue`);
                }
    
                else { embed.setDescription(`I'm not in that voice channel`) }
            }
    
            else { embed.setDescription(`I'm not in a voice channel`) }
        }
    
        else { embed.setDescription(`you're not in a voice channel`) }

        imports.channel.send(embed);
    }
}