var Discord = require('discord.js');

module.exports = function(imports, arguments) {
    if (parseInt(arguments[0]) < 2 || parseInt(arguments[0]) > 100) {
        imports.channel.send('`please enter a number between 2 and 100`');
    }

    else {
        imports.channel.fetchMessages({ limit: parseInt(arguments[0]) })
            .then(messages => messages.forEach(function(message) {
                message.delete();
            })).catch(console.error);

        var embed = new Discord.RichEmbed();
        embed.setAuthor('Charisma', imports.client.user.avatarURL);
        embed.setDescription(imports.user.displayName + ' prune ' + arguments[0] + ' messages');
        embed.setColor(imports.localsettings.guild.accentcolor);
        imports.channel.send(embed);
    }
};