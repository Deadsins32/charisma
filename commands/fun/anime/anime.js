var Discord = require('discord.js');
var anime = require('node-kitsu');

module.exports = function(imports, arguments) {
    var embed = new Discord.RichEmbed();
    embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);

    anime.searchAnime(arguments[0], 0).then(results => {
        if (results[0]) {
            embed.setTitle(results[0].attributes.canonicalTitle);
            embed.setImage(results[0].attributes.coverImage.original);
            embed.setFooter(imports.client.user.username, imports.client.user.avatarURL);

            embed.addField('status', results[0].attributes.status, true);
            embed.addField('episodes', results[0].attributes.episodeCount, true);
            embed.addField('episode length', results[0].attributes.episodeLength + 'm', true);
            embed.addField('synopsis', results[0].attributes.synopsis.substring(0, 1021) + '...');
            imports.channel.send(embed);
        }

        else {
            embed.setDescription('"' + arguments[0] + '" was not found');
            imports.channel.send(embed);
        }
    });
}