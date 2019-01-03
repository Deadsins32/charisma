var Discord = require('discord.js');

module.exports = async function(imports, arguments) {
    var embed = new Discord.RichEmbed();
    embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
    if (imports.member.voiceChannel) {
        if (imports.member.voiceChannel.joinable) {
            imports.music[imports.guild.id] = {
                connection: await imports.member.voiceChannel.join(),
                queue: new Array(),
                playing: false
            }

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