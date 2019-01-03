var Discord = require('discord.js');

module.exports = async function(imports, parameters) {
    var embed = new Discord.RichEmbed();
    embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
    if (imports.member.voiceChannel) {
        if (imports.guild.me.voiceChannel) {
            if (imports.member.voiceChannel.id == imports.guild.me.voiceChannel.id) {
                if (imports.music[imports.guild.id].playing) {
                    var title = imports.music[imports.guild.id].queue[0].title;
                    imports.music[imports.guild.id].connection.dispatcher.end();
                    embed.setDescription(`skipped **"${title}"**`);
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