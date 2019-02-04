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

    var factor = imports.data.guilds[imports.guild.id].config.expcurve;
    var experience = imports.data.guilds[imports.guild.id].members[member.id].exp;

    var level = imports.Experience.expToLevel(experience, factor);
    var currentExp = imports.Experience.levelToExp(level, factor);
    var nextExp = imports.Experience.levelToExp(level + 1, factor);

    var relativeExp = experience - currentExp;
    var relativeMax = nextExp - currentExp;

    embed.addField('level', level, true);
    embed.addField('experience', `${relativeExp}/${relativeMax}`, true);

    imports.channel.send(embed);
}