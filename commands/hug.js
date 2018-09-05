var https = require('https');
var Discord = require('discord.js');

module.exports = function(imports, arguments) {
    arguments[0] = imports.Command.methods.mention(arguments[0]).value;
    var username = imports.guild.members.find('id', arguments[0]).displayName;
    var embed = new Discord.RichEmbed();
    embed.setAuthor('Charisma', imports.client.user.avatarURL);
    embed.setDescription(imports.Flavors.variables(imports.Flavors.pick(imports.localsettings.guild.flavor, 'hug', 'standard'), [{ name: 'user', value: imports.user.displayName }, { name: 'target', value: username }]));
    embed.setColor(imports.localsettings.guild.colors.accent);

    if (imports.user.id == arguments[0]) {
        imports.message.channel.send(imports.Flavors.variables(imports.Flavors.pick(imports.localsettings.guild.flavor, 'hug', 'self'), [{ name: 'user', value: imports.user.displayName }]));
    }

    else if (imports.client.user.id == arguments[0]) {
        imports.message.channel.send(imports.Flavors.variables(imports.Flavors.pick(imports.localsettings.guild.flavor, 'hug', 'bot'), [{ name: 'user', value: imports.user.displayName }]));
    }

    else {
        https.get('https://nekos.life/api/v2/img/hug', function(response) {
            var data = '';
            response.on('data', function(chunk) {
                data += chunk;
            });

            response.on('end', function() {
                var json = JSON.parse(data);
                embed.setImage(json.url);
                imports.channel.send(embed);
            });
        });
    }
}