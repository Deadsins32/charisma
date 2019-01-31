var Discord = require('discord.js');

module.exports = {
    add: function(imports, member, exp) {
        if (imports.data.guilds[imports.guild.id].features.leveling) {
            var level = imports.data.guilds[imports.guild.id].members[member.id].level;
            var factor = imports.data.guilds[imports.guild.id].config.expcurve;
            var nextLevel = this.toNext(level + 1, factor);
            imports.data.guilds[imports.guild.id].members[member.id].exp += exp;
            var currentExp = imports.data.guilds[imports.guild.id].members[member.id].exp;
            var passed = 0;

            while (currentExp >= nextLevel) {
                passed += 1;
                level += 1;
                currentExp -= nextLevel;
                nextLevel = this.toNext(level, factor);
            }

            if (passed >= 1) {
                imports.data.guilds[imports.guild.id].members[member.id].level = level;
                imports.data.guilds[imports.guild.id].members[member.id].exp = currentExp;
                var embed = new Discord.RichEmbed();
                embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
                if (passed == 1) { embed.setDescription(`${member.displayName} has advanced to **level ${level}**`) }
                else { embed.setDescription(`${member.displayName} has skipped **${passed} levels** and advanced to **level ${level}**`) }
                imports.channel.send(embed);
            }
        }
    },

    toNext: function(level, factor) {
        return Math.floor(200 * Math.pow(level, factor));
    }
}