var Discord = require('discord.js');

var responses = [
    `yup`,
    `maybe`,
    `obviously`,
    `perhaps`,
    `definitely`,
    `probably`,
    `definitely not`,
    `nope`,
    `nah`,
    `no`,
    `doubt it`,
    `certainly`,
    `yeah`,
    `yes`,
    `*it's a secret*`,
    `I could tell you, but where's the fun in that :wink:`,
    `why would I tell you?`,
    `it's possible`,
    `it's not unlikely`,
    `the odds aren't too bad`,
    `why are you asking me this?`
]

module.exports = {
    config: {
        permissions: [],
        description: 'it\'s a magic ball!',
        hidden: false,
        nsfw: false,
        tags: ['fun'],
        params: [
            { type: 'string', required: true, name: 'true / false question' }
        ]
    },

    command: function(imports, parameters) {
        Math.seedrandom(parameters[0]);
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
        embed.setDescription(responses[Math.floor(Math.random() * responses.length)]);
        imports.channel.send(embed);
    }
}