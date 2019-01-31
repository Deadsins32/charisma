var Discord = require('discord.js');

module.exports = {
    add: function(imports, exp) {
        if (imports.data.guilds[imports.guild.id].features.leveling) {
            var level = imports.data.guilds[imports.guild.id].members[imports.member.id].level + 1;
            var factor = imports.data.guilds[imports.guild.id].config.expcurve;
            var nextLevel = Math.floor(200 * Math.pow(level, factor));
            imports.data.guilds[imports.guild.id].members[imports.member.id].exp += exp;

            console.log(imports.data.guilds[imports.guild.id].members);
            var currentExp = imports.data.guilds[imports.guild.id].members[imports.member.id].exp;

            if (currentExp >= nextLevel) {
                var embed = new Discord.RichEmbed();
                embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
                embed.setTitle('level up!');
                embed.setDescription(`${imports.member.displayName} advanced to **level ${level}**`);
                imports.channel.send(embed);
                imports.data.guilds[imports.guild.id].members[imports.member.id].level = level;
                imports.data.guilds[imports.guild.id].members[imports.member.id].exp = currentExp - nextLevel;
            }
        }
    },

    toNext: function(imports) {
        var level = imports.data.guilds[imports.guild.id].members[imports.member.id].level + 1;
        var factor = imports.data.guilds[imports.guild.id].config.expcurve;
        var nextLevel = Math.floor(200 * Math.pow(level, factor));
        return nextLevel;
    }
}