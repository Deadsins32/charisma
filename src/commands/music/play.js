var Discord = require('discord.js');

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
        embed.setColor(imports.local.guild.colors.accent);
        if (imports.member.voiceChannel) {
            if (imports.guild.me.voiceChannel) {
                if (imports.member.voiceChannel.id == imports.guild.me.voiceChannel.id) {
                    if (imports.member.voiceChannel.permissionsFor(imports.client.user).has('SPEAK')) {
                        try {
                            var video = await imports.youtube.getVideo(parameters[0]);
                            music.add(imports.guild.id, video);
                            if (music.instances.queue.length > 1) { embed.setDescription(`added **"${video.title}"** to the queue`) }
                            else { embed.setDescription(`started playing **"${video.title}"**`) }
                        }

                        catch(error) {
                            try {
                                var playlist = await imports.youtube.getPlaylist(parameters[0]);
                                var videos = await playlist.getVideos();
                                for (v in videos) { music.add(imports.guild.id, videos[v]) }
                                embed.setDescription(`${videos.length} tracks have been added to the queue`);
                                imports.channel.send(embed);
                            }

                            catch(error) {
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
                                        time: 20000,
                                        errors: ['time']
                                    });

                                    var video1 = videos[parseInt(response.array()[0].content)-1];
                                    var video2 = await imports.youtube.getVideoByID(video1.id);

                                    var successEmbed = new Discord.RichEmbed();
                                    successEmbed.setColor(imports.local.guild.colors.accent);
                                    music.add(imports.guild.id, video2);
                                    if (music.instances[imports.guild.id].queue > 1) { successEmbed.setDescription(`added **"${video2.title}"** to the queue`) }
                                    else { successEmbed.setDescription(`started playing **"${video2.title}"**`) }  
                                    successEmbed = music.add(imports.guild.id, video2);
                                    selection.edit(successEmbed);
                                }

                                catch(error) {
                                    console.error(error);
                                    var errorEmbed = new Discord.RichEmbed();
                                    errorEmbed.setColor(imports.local.guild.colors.accent);
                                    errorEmbed.setDescription(`none or invalid value entered, canceling video selection`);
                                    selection.edit(errorEmbed);
                                }
                            }
                        }
                        /*
                        if (parameters[0].startsWith('playlist ')) {
                            parameters[0] = parameters[0].split('playlist ')[1];
                            var playlists = await imports.youtube.searchPlaylists(parameters[0], 10);
                            var playlistsArray = new Array();
                            for (p in playlists) {
                                var title = Discord.Util.escapeMarkdown(playlists[p].title);
                                playlistsArray.push(`**[${parseInt(p)+1}]** - ${title}`);
                            }

                            embed.setDescription(playlistsArray.join('\n'));
                            embed.setFooter(`enter a number 1-${playlists.length}`);
                            var selection = await imports.channel.send(embed);

                            try {
                                var response = await imports.channel.awaitMessages(message => message.content > 0 && message.content < playlists.length+1 && message.author.id == imports.user.id, {
                                    maxMatches: 1,
                                    time: 20000,
                                    errors: ['time']
                                });


                                var playlist = playlists[parseInt(response.array()[0].content)-1];
                                var videos = await playlist.getVideos();
                                for (v in videos) { music.add(imports.guild.id, videos[v], embed) }
                                var successEmbed = new Discord.RichEmbed();
                                successEmbed.setColor(imports.local.guild.colors.accent);
                                successEmbed.setDescription(`${videos.length} tracks have been added to the queue`);
                                selection.edit(successEmbed);
                            }

                            catch(error) {
                                console.error(error);
                                var errorEmbed = new Discord.RichEmbed();
                                errorEmbed.setColor(imports.local.guild.colors.accent);
                                errorEmbed.setDescription(`none or invalid value entered, canceling video selection`);
                                selection.edit(errorEmbed);
                            }
                        }

                        else {
        
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
                                                time: 20000,
                                                errors: ['time']
                                            });
        
                                            var video1 = videos[parseInt(response.array()[0].content)-1];
                                            var video2 = await imports.youtube.getVideoByID(video1.id);
        
                                            var successEmbed = new Discord.RichEmbed();
                                            successEmbed.setColor(imports.local.guild.colors.accent);
                                            successEmbed = music.add(imports.guild.id, video2, successEmbed);
                                            selection.edit(successEmbed);
                                        }
        
                                        catch(error) {
                                            console.error(error);
                                            var errorEmbed = new Discord.RichEmbed();
                                            errorEmbed.setColor(imports.local.guild.colors.accent);
                                            errorEmbed.setDescription(`none or invalid value entered, canceling video selection`);
                                            selection.edit(errorEmbed);
                                        }
                                    }
        
                                    catch(error) {
                                        embed.setDescription(`no results found`);
                                        imports.channel.send(embed);
                                    }
                                }
                            }
                        }*/
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