var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        description: 'accept something!',
        hidden: false,
        nsfw: false,
        tags: ['management', 'utility'],
        params: [
            { type: "string", required: false, "name": "password" },
        ]
    },

    command: async function(imports, parameters) {
        let embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);

        let guild = imports.guild.id;
        let channel = imports.channel.id;
        let user = imports.user.id;
        if (imports.requests[guild] && imports.requests[guild][channel] && imports.requests[guild][channel][user] != undefined) {
            let isPassword = imports.requests[guild][channel][user] != false;
            let accepted = false;
            if (isPassword) { if (parameters[0] && parameters[0] == imports.requests[guild][channel][user]) { accepted = true } }
            else { accepted = true; }

            if (!accepted) { embed.setDescription(`incorrect password`) }
            else { imports.requests[guild][channel][user] = true }
        }

        else { embed.setDescription(`there's no pending requests`) }

        if (embed.description) { imports.channel.send(embed) }
    }
}