var https = require('https');
var Discord = require('discord.js');
var Flavors = require('./Flavors.js');

module.exports = function(imports, name, parameters) {
    var id = parameters[0];
    var displayName = imports.guild.members.get(id).displayName;

    var embed = new Discord.RichEmbed();
    embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
    
    if (imports.user.id == id) {
        embed.setDescription(Flavors.variables(Flavors.pick(imports.data.guilds[imports.guild.id].config.flavor, name, 'self'), [{ name: 'user', value: imports.member.displayName }]));
        imports.channel.send(embed);
    }

    else if (imports.client.user.id == id) {
        embed.setDescription(Flavors.variables(Flavors.pick(imports.data.guilds[imports.guild.id].config.flavor, name, 'bot'), [{ name: 'user', value: imports.member.displayName }]));
        imports.channel.send(embed);
    }

    else {
        embed.setAuthor('Charisma', imports.client.user.avatarURL);
        embed.setDescription(Flavors.variables(Flavors.pick(imports.data.guilds[imports.guild.id].config.flavor, name, 'standard'), [{ name: 'user', value: imports.member.displayName }, { name: 'target', value: displayName }]));
        https.get('https://nekos.life/api/v2/img/' + name, function(response) {
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