var Discord = require('discord.js');

module.exports = function(imports, arguments) {
    var embed = new Discord.RichEmbed();
    embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
    if (imports.member.voiceChannel) {
        if (imports.guild.me.voiceChannel) {
            if (imports.member.voiceChannel.id == imports.guild.me.voiceChannel.id) {
                var queue = imports.music[imports.guild.id].queue;
                if (queue.length == 0) {
                    embed.setDescription(`there's no music in the queue`);
                }

                else {
                    var queueText = new Array();
                    for (q in queue) {
                        var duration = `${queue[q].duration.minutes}:${queue[q].duration.seconds}`;
                        if (queue[q].duration.hours != 0) { duration = `${queue[q].duration.hours}:${duration}` }
                        var title = Discord.Util.escapeMarkdown(queue[q].title);

                        if (q == 0) { queueText.push(`**${parseInt(q) + 1}: ${title} - ${duration}**`) }
                        else { queueText.push(`${parseInt(q) + 1}: ${title} - **${duration}**`) }
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