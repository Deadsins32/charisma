var Discord = require('discord.js');
var https = require('https');

module.exports = function(imports, parameters) {
    var embed = new Discord.RichEmbed();
    embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);

    if (parameters[0] == 'gif') {
        https.get('https://nekos.life/api/v2/img/pussy', function(response) {
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

    else {
        https.get('https://nekos.life/api/v2/img/pussy_jpg', function(response) {
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