var Discord = require('discord.js');
var booru = require('booru');

module.exports = {
    config: {
        permissions: [],
        description: 'gets some nice nsfw pics :smirk:',
        hidden: false,
        nsfw: true,
        tags: ['fun', 'nsfw'],
        params: [
            { type: 'string', required: true, name: 'search' }
        ]
    },

    command: async function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
        
        var tags = parameters[0].split(' ');
    
        try {
            var search = await booru.search('r34', tags, { limit: 1, random: true });
            var common = await booru.commonfy(search);
    
            var imageTags = new Array();
    
            for (t in common[0].common.tags) {
                imageTags.push(`[#${common[0].common.tags[t]}](${common[0].common.file_url})`);
            }
    
            embed.setTitle(`"${parameters[0]}"`);
            embed.setURL(common[0].common.file_url);
            embed.setImage(common[0].common.file_url);
            embed.setDescription(`${imageTags.slice(0, 5).join(' ')} **Score**: ${common[0].common.score}`);
        }
    
        catch(error) { embed.setDescription('no images found ;-;') }
    
        imports.channel.send(embed);
    }
}