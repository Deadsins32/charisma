var Discord = require('discord.js');

function play(imports, song) {
    if (song) {
        imports.music[imports.guild.id].playing = true;
        var dispatcher = imports.music[imports.guild.id].connection.playStream(imports.ytdl(imports.music[imports.guild.id].queue[0].url));
        dispatcher.on('end', function(reason) {
            imports.music[imports.guild.id].queue.shift();
            play(imports, imports.music[imports.guild.id].queue[0]);
        });
    }

    else {
        imports.music[imports.guild.id].playing = false;
    }
}

function add(imports, video, embed) {
    imports.music[imports.guild.id].queue.push({
        title: video.title,
        id: video.id,
        duration: video.duration,
        url: video.url
    });

    if (imports.music[imports.guild.id].queue.length == 1) { embed.setDescription(`started playing **"'${video.title}'"**`) }
    else { embed.setDescription(`added **"'${video.title}'"** to the queue`) }

    if (!imports.music[imports.guild.id].playing) {
        if (imports.music[imports.guild.id].queue.length == 1) {
            play(imports, imports.music[imports.guild.id].queue[0]);
        }
    }

    return embed;
}

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
        embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);

        if (imports.member.voiceChannel) {
            if (imports.guild.me.voiceChannel) {
                if (imports.member.voiceChannel.id == imports.guild.me.voiceChannel.id) {
                    imports.music[imports.guild.id].connection.dispatcher.setVolume(parameters[0]/100);
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