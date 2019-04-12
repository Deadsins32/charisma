var Discord = require('discord.js');
var https = require('https');

module.exports = {
    config: {
        permissions: [],
        description: 'gets some nice boobies~ :ok_hand:',
        hidden: false,
        nsfw: true,
        tags: ['fun', 'nsfw'],
        params: [
            { type: 'string', required: false, name: 'gif | small' }
        ]
    },

    command: function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
    
        if (parameters[0] == 'gif') {
            https.get('https://nekos.life/api/v2/img/boobs', function(response) {
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
    
        else if (parameters[0] == 'small') {
            https.get('https://nekos.life/api/v2/img/smallboobs', function(response) {
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
            https.get('https://nekos.life/api/v2/img/tits', function(response) {
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