module.exports = function(imports, arguments) {
    arguments[0] = imports.Command.methods.mention(arguments[0]).value;
    var username = imports.guild.members.find('id', arguments[0]).displayName;
    var embed = new imports.Discord.RichEmbed();
    embed.setAuthor('Charisma', imports.client.user.avatarURL);
    embed.setDescription(imports.Flavors.variables(imports.Flavors.pick(imports.localsettings.guild.flavor, 'hug', 'standard'), [{ name: 'user', value: imports.user.displayName }, { name: 'target', value: username }]));
    embed.setColor(eval('0x' + imports.localsettings.guild.accentcolor.split('#')[1]));

    if (imports.user.id == arguments[0]) {
        imports.message.channel.send(imports.Flavors.variables(imports.Flavors.pick(imports.localsettings.guild.flavor, 'hug', 'self'), [{ name: 'user', value: imports.user.displayName }]));
    }

    else if (imports.client.user.id == arguments[0]) {
        imports.message.channel.send(imports.Flavors.variables(imports.Flavors.pick(imports.localsettings.guild.flavor, 'hug', 'bot'), [{ name: 'user', value: imports.user.displayName }]));
    }

    else {
        imports.snekfetch.get('https://nekos.life/api/v2/img/hug')
            .set('Key', 'dnZ4fFJbjtch56pNbfrZeSRfgWqdPDgf')
            .then(response => {
                embed.setImage(response.body.url);
                imports.message.channel.send({embed});
            });
    }
}