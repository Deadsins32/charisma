var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: ['BOT.MASTER'],
        description: 'spawn things with magic or something',
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
                await imports.Data.inventory.money.add(member.id, parameters[2]);
                embed.setDescription(`added **$${parameters[2]}** to **${member.displayName}'s** balance`);
            }

            else if (parameters[1] == 'remove') {
                await imports.Data.inventory.money.remove(member.id, parameters[2]);
                embed.setDescription(`removed **${parameters[2]}** from **${member.displayName}'s** balance`);
            }

            else { embed.setDescription(`unknown option`) }
        }

        else if (parameters[0] == 'item') {
            let item = parameters[1];
            if (imports.itemFromEmoji(item)) { item = imports.itemFromEmoji(item) }

            let count = 1;
            if (parameters[2]) { count = parameters[2] }
            if (count < 1) { count = 1 }

            if (imports.economy.items[item]) {
                await imports.Data.inventory.item.add(imports.user.id, item, count);
                embed.setDescription(`you gave yourself ${imports.economy.items[item].emoji}x${count}!`);
            }

            else { embed.setDescription(`that item doesn't exist!`) }
        }

        else if (parameters[0] == 'help') {
            let helpText = `entities:
                                \`${imports.local.guild.prefix}spawn money <option>\`
                                \`${imports.local.guild.prefix}spawn experience <option>\`
                            `;
            embed.setDescription(helpText);
        }

        else { embed.setDescription(`unknown entity`) }

        imports.channel.send(embed);
    }
}