var Discord = require('discord.js');

module.exports = {
    add: function(imports, member, exp, logExp) {
        if (imports.data.guilds[imports.guild.id].features.leveling) {
            var factor = imports.data.guilds[imports.guild.id].config.expcurve;
            var beforeLevel = this.expToLevel(imports.data.guilds[imports.guild.id].members[member.id].exp, factor);
            var afterLevel = this.expToLevel(imports.data.guilds[imports.guild.id].members[member.id].exp + exp, factor);

            imports.data.guilds[imports.guild.id].members[member.id].exp += exp;

            if (beforeLevel != afterLevel) {
                var embed = new Discord.RichEmbed();
                embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
                if ((afterLevel - beforeLevel) == 1) { embed.setDescription(`${member.displayName} has advanced to **level ${afterLevel}**`) }
                else { embed.setDescription(`${member.displayName} has skipped **${afterLevel - beforeLevel} levels** and advanced to **level ${afterLevel}**`) }
                imports.channel.send(embed);
            }

            else if (logExp) {
                var embed = new Discord.RichEmbed();
                embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
                embed.setDescription(`${member.displayName} has received **${exp} EXP**`);
                imports.channel.send(embed);
            }
        }
    },

    expToLevel: function(exp, factor) {
        var level = 0;
        var required = Math.floor(200 * Math.pow(1, factor));
        while (exp > required) {
            exp -= required;
            level += 1;
            required = Math.floor(200 * Math.pow(level + 1, factor));
        }

        return level;
    },

    levelToExp: function(level, factor) {
        var exp = 0;
        for (var l = 0; l < level; l++) {
            exp += Math.floor(200 * Math.pow(l + 1, factor));
        }

        return exp;
    }
}