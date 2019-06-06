var Discord = require('discord.js');

module.exports = {
    add: function(imports, member, exp, logExp) {
        if (imports.local.guild.options.leveling) {
            var factor = imports.local.guild.config.expcurve;
            var beforeLevel = this.expToLevel(imports.local.guild.members[member.id].exp, factor);
            var afterLevel = this.expToLevel(imports.local.guild.members[member.id].exp + exp, factor);

            imports.local.guild.members[member.id].exp += exp;

            if (beforeLevel != afterLevel) {
                var embed = new Discord.RichEmbed();
                embed.setColor(imports.local.guild.colors.accent);
                if ((afterLevel - beforeLevel) == 1) { embed.setDescription(`${member.displayName} has advanced to **level ${afterLevel}**`) }
                else { embed.setDescription(`${member.displayName} has skipped **${afterLevel - beforeLevel} levels** and advanced to **level ${afterLevel}**`) }
                imports.channel.send(embed);
            }

            else if (logExp) {
                var embed = new Discord.RichEmbed();
                embed.setColor(imports.local.guild.colors.accent);
                embed.setDescription(`${member.displayName} has received **${exp} EXP**`);
                imports.channel.send(embed);
            }
        }
    },

    expToLevel: function(exp, factor) {
        var level = 0;
        var required = Math.floor(500 * Math.pow(1, factor));
        while (exp > required) {
            exp -= required;
            level += 1;
            required = Math.floor(500 * Math.pow(level + 1, factor));
        }

        return level;
    },

    levelToExp: function(level, factor) {
        var exp = 0;
        for (var l = 0; l < level; l++) {
            exp += Math.floor(500 * Math.pow(l + 1, factor));
        }

        return exp;
    },

    getRelative: function(exp, factor) {
        var level = this.expToLevel(exp, factor);
        var currentExp = this.levelToExp(level, factor);
        var nextExp = this.levelToExp(level + 1, factor);
        var relativeExp = exp - currentExp;
        var relativeMax = nextExp - currentExp;

        return [relativeExp, relativeMax];
    }
}