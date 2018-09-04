var Discord = require('discord.js');

module.exports = function(imports, arguments) {
    var embed = new Discord.RichEmbed();
    embed.setColor(imports.settings.guilds[imports.guild.id].accentcolor);

    var id = imports.Command.methods.mention(arguments[0]).value;
    var reason = 'NO REASON';
    if (arguments[1] != undefined) {
        reason = arguments[1];
    }

    if (imports.user.id != id) {
        var member = imports.guild.members.find('id', id);

        member.kick(reason)
            .then((function() { embed.setDescription('user: ' + member.displayName + ' has been kicked for reason: "' + reason + '"') })
            .catch((function(error) { embed.setDescription(error) })));
    }

    else {
        embed.setDescription('you can\'t kick yourself');
    }

    imports.channel.send(embed);
}