var Discord = require('discord.js');

module.exports = function(imports, parameters) {
    var embed = new Discord.RichEmbed();
    embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
    if (parameters[0] && parameters[0] != imports.user.id) { embed.setFooter(`requested by ${imports.user.username}#${imports.user.discriminator}`) }

    var id = imports.user.id;
    if (parameters[0]) { id = parameters[0] }
    var member = imports.guild.members.get(id);
    embed.setAuthor(`${member.user.username}#${member.user.discriminator}`);
    embed.setThumbnail(member.user.avatarURL);

    var level = imports.data.guilds[imports.guild.id].members[member.id].level;
    var factor = imports.data.guilds[imports.guild.id].config.expcurve;
    embed.addField('level', level, true);
    embed.addField('experience', `${imports.data.guilds[imports.guild.id].members[member.id].exp}/${imports.Experience.toNext(level + 1, factor)}`, true);

    imports.channel.send(embed);
}