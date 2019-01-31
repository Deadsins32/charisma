var Discord = require('discord.js');

module.exports = function(imports, parameters) {
    var embed = new Discord.RichEmbed();
    embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
    var member = imports.member;
    if (parameters[2]) { member = imports.guild.members.get(parameters[2]) }

    if (parameters[0] == 'add') {
        if (parameters[1]) {
            embed.setDescription(`gave ${member.displayName} **${parameters[1]} EXP**`);
            imports.channel.send(embed);
            imports.Experience.add(imports, member, parameters[1]);
        }

        else {
            embed.setDescription('please specify an exp value');
            imports.channel.send(embed);
        }
    }

    else {
        embed.setDescription('unknown operation');
        imports.channel.send(embed);
    }
}