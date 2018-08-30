module.exports = function(imports, arguments) {
    if (parseInt(arguments[0]) < 2 || parseInt(arguments[0]) > 100) {
        imports.channel.send('`please enter a number between 2 and 100`');
    }

    else {
        console.log(parseInt(arguments[0]));
        imports.channel.fetchMessages({ limit: parseInt(arguments[0]) })
            .then(messages => messages.forEach(function(message) {
                console.log(message.id);
                message.delete();
            }))
            .catch(console.error);

        var embed = new imports.Discord.RichEmbed();
        embed.setAuthor('Charisma', imports.client.user.avatarURL);
        embed.setDescription(imports.user.displayName + ' prune ' + arguments[0] + ' messages');
        embed.setColor(eval('0x' + imports.localsettings.guild.accentcolor.split('#')[1]));
        imports.channel.send({embed});
    }
};