var https = require('https');
var Discord = require('discord.js');
var Flavors = require('./Flavors.js');

async function get(url) {
    return new Promise(function(resolve, reject) {
        https.get(url, function(response) {
            var data = '';
            response.on('data', function(chunk) { data += chunk });
            response.on('end', function() {
                try {
                    var json = JSON.parse(data);
                    resolve(json);
                }

                catch(error) { reject(error) }
            });
        });
    });
}

module.exports = async function(imports, name, parameters) {
    var id = parameters[0];
    var displayName = imports.guild.members.get(id).displayName;

    var embed = new Discord.RichEmbed();
    embed.setColor(imports.local.guild.colors.accent);
    
    if (imports.user.id == id) { embed.setDescription(Flavors.variables(Flavors.pick(imports.local.guild.config.flavor, name, 'self'), [{ name: 'user', value: imports.member.displayName }])) }
    else if (imports.client.user.id == id) { embed.setDescription(Flavors.variables(Flavors.pick(imports.local.guild.config.flavor, name, 'bot'), [{ name: 'user', value: imports.member.displayName }])) }
    
    else {
        embed.setDescription(Flavors.variables(Flavors.pick(imports.local.guild.config.flavor, name, 'standard'), [{ name: 'user', value: imports.member.displayName }, { name: 'target', value: displayName }]));
        var json = await get(`https://nekos.life/api/v2/img/${name}`);
        embed.setImage(json.url);
    }

    imports.channel.send(embed);
}