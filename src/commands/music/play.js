var Discord = require('discord.js');

function play(imports, song) {
    if (song) {
        imports.music[imports.guild.id].playing = true;
        var dispatcher = imports.music[imports.guild.id].connection.playStream(imports.ytdl(imports.music[imports.guild.id].queue[0].url));
        dispatcher.on('end', function(reason) {
            if (reason != 'shuffle') {
                imports.music[imports.guild.id].queue.shift();
                play(imports, imports.music[imports.guild.id].queue[0]);
            }
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
        description: 'play a song',
        hidden: false,
        nsfw: false,
        tags: ['fun'],
        params: [
            { type: 'string', required: true, name: 'youtube url / search term' }
        ]
    },

    command: async function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
        if (imports.member.voiceChannel) {
            if (imports.guild.me.voiceChannel) {
                if (imports.member.voiceChannel.id == imports.guild.me.voiceChannel.id) {
                    if (imports.member.voiceChannel.permissionsFor(imports.client.user).has('SPEAK')) {
    
                        try {
                            var video = await imports.youtube.getVideo(parameters[0]);
                            imports.channel.send(add(imports, video, embed));
                        }
    
                        catch(error) {
                            try {
                                var playlist = await imports.youtube.getPlaylist(parameters[0]);
                                var videos = await playlist.getVideos();
                                for (v in videos) { add(imports, videos[v], embed) }
                                embed.setDescription(`${videos.length} tracks have been added to the queue`);
                                imports.channel.send(embed);
                            }
    
                            catch(error) {
                                try {
                                    var videos = await imports.youtube.searchVideos(parameters[0], 10);
                                    var videosArray = new Array();
                                    for (v in videos) {
                                        var title = Discord.Util.escapeMarkdown(videos[v].title);
                                        videosArray.push(`**[${parseInt(v)+1}]** - ${title}`);
                                    }
    
                                    embed.setDescription(videosArray.join('\n'));
                                    embed.setFooter(`enter a number 1-${videos.length}`);
                                    var selection = await imports.channel.send(embed);
    
                                    try {
                                        var response = await imports.channel.awaitMessages(message => message.content > 0 && message.content < videos.length+1 && message.author.id == imports.user.id, {
                                            maxMatches: 1,
                                            time: 10000,
                                            errors: ['time']
                                        });
    
                                        var video1 = videos[parseInt(response.array()[0].content)-1];
                                        var video2 = await imports.youtube.getVideoByID(video1.id);
    
                                        var successEmbed = new Discord.RichEmbed();
                                        successEmbed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
                                        successEmbed = add(imports, video2, successEmbed);
                                        selection.edit(successEmbed);
                                    }
    
                                    catch(error) {
                                        console.error(error);
                                        var errorEmbed = new Discord.RichEmbed();
                                        errorEmbed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
                                        errorEmbed.setDescription(`none or invalid value entered, canceling video selection`);
                                        selection.edit(errorEmbed);
                                    }
    
    
                                    /*
                                    for (q in queue) {
                                        var duration = `${queue[q].duration.minutes}:${queue[q].duration.seconds}`;
                                        if (queue[q].duration.hours != 0) { duration = `${queue[q].duration.hours}:${duration}` }
                                        var title = Discord.Util.escapeMarkdown(queue[q].title);
    
                                        if (q == 0) { queueText.push(`**${q+1}: ${title} - ${duration}**`) }
                                        else { queueText.push(`${q+1}: ${title} - **${duration}**`) }
                                    }*/
                                }
    
                                catch(error) {
                                    embed.setDescription(`no results found`);
                                    imports.channel.send(embed);
                                }
                            }
                        }
                    }
    
                    else {
                        embed.setDescription(`I don't have permission to speak in this voice channel`);
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