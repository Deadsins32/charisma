var Discord = require('discord.js');

module.exports = function(imports, arguments) {
    var embed = new Discord.RichEmbed();
    embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);

    var id = arguments[0];
    var reason = 'NO REASON';
    if (arguments[1] != undefined) {
        reason = arguments[1];
    }

    if (imports.user.id != id) {
        var member = imports.guild.members.find('id', id);

        member.kick(reason)
            .then((function() {
                embed.setDescription('user: ' + member.displayName + ' has been kicked for reason: "' + reason + '"');
                imports.channel.send(embed);
            }).catch((function(error) { console.log(error) })));
    }

    else {
        embed.setDescription('you can\'t kick yourself');
        imports.channel.send(embed);
    }
}