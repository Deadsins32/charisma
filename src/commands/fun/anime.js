var Discord = require('discord.js');
var kitsu = require('node-kitsu');

module.exports = {
    config: {
        permissions: [],
        description: 'easily search for anime!',
        hidden: false,
        nsfw: false,
        tags: ['fun'],
        params: [
            { type: 'string', required: true, name: 'search terms' }
        ]
    },

    command: async function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
        var anime = await kitsu.searchAnime(parameters[0], 0);
        if (anime && anime[0]) {
            embed.setTitle(anime[0].attributes.canonicalTitle);
            embed.setImage(anime[0].attributes.coverImage.original);
            embed.addField('status', anime[0].attributes.status, true);
            embed.addField('episodes', anime[0].attributes.episodeCount, true);
            embed.addField('episode length', anime[0].attributes.episodeLength + 'm', true);
            embed.addField('synopsis', anime[0].attributes.synopsis.substring(0, 1021) + '...');
        }

        else { embed.setDescription(`"${parameters[0]}" was not found`) }
        imports.channel.send(embed);
    }
}