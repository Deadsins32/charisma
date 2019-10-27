var Discord = require('discord.js');
var https = require('https');

module.exports = {
    config: {
        permissions: [],
        description: 'gets some of the sweet pussy~ :smirk:',
        hidden: false,
        nsfw: true,
        tags: ['fun', 'nsfw'],
        params: [
            { type: 'string', required: false, name: 'gif?' }
        ]
    },

    command: function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
    
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
}