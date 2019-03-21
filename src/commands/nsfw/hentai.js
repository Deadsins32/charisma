var Discord = require('discord.js');
var https = require('https');

module.exports = {
    config: {
        permissions: [],
        description: 'mmmmm... hentai~',
        hidden: false,
        nsfw: true,
        tags: ['fun', 'nsfw'],
        params: [
            { type: 'string', required: false, name: 'gif?' }
        ]
    },

    command: function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
    
        if (parameters[0] == 'gif') {
            https.get('https://nekos.life/api/v2/img/Random_hentai_gif', function(response) {
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
            https.get('https://nekos.life/api/v2/img/hentai', function(response) {
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