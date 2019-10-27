var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        description: 'get the queue of selected songs',
        hidden: false,
        nsfw: false,
        tags: ['fun'],
        params: [
            { type: 'number', required: false, name: 'page' }
        ]
    },

    command: function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
        if (imports.member.voiceChannel) {
            if (imports.guild.me.voiceChannel) {
                if (imports.member.voiceChannel.id == imports.guild.me.voiceChannel.id) {
                    var queue = music.instances[imports.guild.id].queue;
                    
                    if (queue.length == 0) { embed.setDescription(`there's no music in the queue`) }
                    else if (queue.length > 10) {
                        var maxPage = Math.ceil(queue.length / 10) - 1;
                        var page = 0;
                        if (parameters[0]) { page = parameters[0] - 1 }
                        if (page <= 0) { page = 0 }

                        var queueText = new Array();

                        if (page > maxPage) { embed.setDescription('please specify a smaller page number') }
                        else {
                            for (var i = 0; i < 10; i++) {
                                if (queue[(page * 10) + i]) {
                                    var title = Discord.escapeMarkdown(queue[(page * 10) + i].title);
                                    if (page == 0 && i == 0) { queueText.push(`**${(page * 10) + i + 1}: ${title}**`) }
                                    else { queueText.push(`${(page * 10) + i + 1}: ${title}`) }
                                }
                            }

                            embed.setDescription(queueText.join(`\n`));
                            embed.setFooter(`page ${page + 1}/${maxPage + 1}`);
                        }
                    }

                    else {
                        var queueText = new Array();
                        for (q in queue) {
                            var title = Discord.Util.escapeMarkdown(queue[q].title);
                            if (q == 0) { queueText.push(`**${parseInt(q) + 1}: ${title}**`) }
                            else { queueText.push(`${parseInt(q) + 1}: ${title}`) }
                        }
                        
                        embed.setDescription(queueText.join('\n'));
                    }
                }
    
                else {
                    embed.setDescription(`I'm not in that voice channel`);
                }
            }
    
            else {
                embed.setDescription(`I'm not in a voice channel`);
            }
        }
    
        else {
            embed.setDescription(`you're not in a voice channel`);
        }
    
        imports.channel.send(embed);
    }
}