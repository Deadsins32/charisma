var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: ['BOT.MASTER'],
        description: 'spawn things using magic',
        hidden: false,
        nsfw: false,
        params: [
            { type: 'string', required: true, name: "entity" },
            { type: 'string', required: true, name: "option" },
            { type: 'number', required: false },
            { type: 'mention', required: false }
        ]
    },

    command: async function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
        var member = imports.member;
        if (parameters[3]) { member = imports.guild.members.get(parameters[3]) }

        if (parameters[0] == 'experience') {
            if (parameters[1] == 'add') {
                if (parameters[2]) { imports.Experience.add(imports, member, parameters[2], true) }
                else { embed.setDescription(`please specify a quantity`) }
            }

            else { embed.setDescription(`unknown option`) }
        }

        else if (parameters[0] == 'money') {
            if (parameters[1] == 'add') {
                await imports.Data.inventory.addMoney(member.id, parameters[2]);
                embed.setDescription(`added **$${parameters[2]}** to **${member.displayName}'s** balance`);
            }

            else if (parameters[1] == 'remove') {
                await imports.Data.inventory.removeMoney(member.id, parameters[2]);
                embed.setDescription(`removed **${parameters[2]}** from **${member.displayName}'s** balance`);
            }

            else { embed.setDescription(`unknown option`) }
        }

        else { embed.setDescription(`unknown entity`) }

        imports.channel.send(embed);
    }
}