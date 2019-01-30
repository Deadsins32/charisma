var Discord = require('discord.js');

module.exports = function(imports, arguments) {
    var embed = new Discord.RichEmbed();
    embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);

    if (imports.guild.me.voiceChannel) {
        if (imports.member.voiceChannel) {
            if (imports.guild.me.voiceChannel.id == imports.member.voiceChannel.id) {
                imports.music[imports.guild.id].connection.disconnect();
                delete imports.music[imports.guild.id];
                embed.setDescription(`left the channel`);
            }

            else { embed.setDescription(`you're not in this voice channel`) }
        }

        else { embed.setDescription(`you're not in a voice channel`) }
    }

    else { embed.setDescription(`I'm not in a voice channel`) }

    imports.channel.send(embed);
}