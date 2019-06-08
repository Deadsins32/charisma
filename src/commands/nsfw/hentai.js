var Discord = require('discord.js');
var https = require('https');

async function get(url) {
    return new Promise(function(resolve, reject) {
        https.get(url, function(response) {
            var data = '';
            response.on('data', function(chunk) { data += chunk });
            response.on('end', function() {
                var json = JSON.parse(data);
                resolve(json);
            });

            response.on('error', function(error) { reject(error) });
        });
    });
}

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

    command: async function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
        var json;
    
        if (parameters[0] == 'gif') { json = await get('https://nekos.life/api/v2/img/Random_hentai_gif') }
        else { json = await get('https://nekos.life/api/v2/img/hentai') }
        embed.setImage(json.url);
        imports.channel.send(embed);
    }
}