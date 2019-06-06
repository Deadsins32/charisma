var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: ['BOT.MASTER'],
        description: 'give yourself or anyone you specify money',
        hidden: false,
        nsfw: false,
        params: [
            { type: 'string', required: true, name: 'add | remove' },
            { type: 'number', required: true, name: 'money' },
            { type: 'mention', required: false, name: 'mention' }
        ]
    },

    command: async function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
        var member = imports.member;
        if (parameters[2]) { member = imports.guild.members.get(parameters[2]) }
    
        if (parameters[0] == 'add') {
            await imports.Data.inventory.addMoney(member.id, parameters[1]);
            embed.setDescription(`added **$${parameters[1]}** to **${member.displayName}'s** balance`);
        }

        else if (parameters[0] == 'remove') {
            await imports.Data.inventory.removeMoney(member.id, parameters[1]);
            embed.setDescription(`removed **$${parameters[1]}** from **${member.displayName}'s** balance`);
        }
    
        else { embed.setDescription('unknown operation') }

        imports.channel.send(embed);
    }
}