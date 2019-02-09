var Discord = require('discord.js');

module.exports = function(imports, parameters) {
    var embed = new Discord.RichEmbed();
    embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
    if (parameters[0] && parameters[0] != imports.user.id) { embed.setFooter(`requested by ${imports.user.username}#${imports.user.discriminator}`) }

    var id = imports.user.id;
    if (parameters[0]) { id = parameters[0] }
    var member = imports.guild.members.get(id);
    embed.setAuthor(`${member.user.username}#${member.user.discriminator}`, member.user.avatarURL);

    var factor = imports.data.guilds[imports.guild.id].config.expcurve;
    var experience = imports.data.guilds[imports.guild.id].members[member.id].exp;
    var level = imports.Experience.expToLevel(experience, factor);
    var relative = imports.Experience.getRelative(experience, factor);

    embed.addField('level', level, true);
    embed.addField('experience', `${relative[0]}/${relative[1]}`, true);

    imports.channel.send(embed);
}