var Discord = require('discord.js');

module.exports = function(imports, parameters) {
    Math.seedrandom(parameters[0]);
    var embed = new Discord.RichEmbed();
    embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);

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

    embed.setDescription(responses[Math.floor(Math.random() * responses.length)]);
    imports.channel.send(embed);
}