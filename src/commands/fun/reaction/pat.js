var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        description: 'pat someone!',
        hidden: false,
        nsfw: false,
        tags: ['fun'],
        params: [
            { type: 'mention', required: true, name: 'user' }
        ]
    },

    command: async function(imports, parameters) {
        let embed = await imports.reactions.getEmbed('pat', imports.member, imports.guild.members.get(parameters[0]), imports);
        imports.channel.send(embed);
    }
}