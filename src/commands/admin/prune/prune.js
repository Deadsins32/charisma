var Discord = require('discord.js');

module.exports = async function(imports, parameters) {
    var number = parseInt(parameters[0]);
    var whole = Math.floor(number / 100);
    var remainder = number % 100;

    for (var w = 0; w < whole; w++) {
        var fetched = await imports.channel.fetchMessages({ limit: 100 });
        for (f in fetched.array()) { await fetched.array()[f].delete() }
    }

    var fetched = await imports.channel.fetchMessages({limit: remainder + 1})
    for (f in fetched.array()) { await fetched.array()[f].delete() }

    var embed = new Discord.RichEmbed();
    embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
    embed.setDescription(`${number} messages have been deleted`);
    imports.channel.send(embed);
}