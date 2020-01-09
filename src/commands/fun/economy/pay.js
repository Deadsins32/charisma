var Discord = require('discord.js');
var emoji = require('node-emoji');

module.exports = {
    config: {
        permissions: [],
        description: 'pay someone some money!',
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        params: [
            { type: "mention", required: true, "name": "user" },
            { type: "number", required: true, "name": "money" }
        ]
    },

    command: async function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
        
        let user = imports.guild.members.get(parameters[0]);
        if (user) {
            var money = await imports.Data.inventory.money.get(imports.user.id);
            if (parameters[1] <= money) {
                if (parameters[1] > 5000) {
                    var code = [];
                    for (let i = 0; i < 4; i++) { code.push(Math.floor(Math.random() * 9)) }
                    embed.setDescription(`you're attempting to pay someone more than **$5000**\nplease verify by typing \`${imports.local.guild.config.prefix}accept ${code.join('')}\``);
                    let embedMessage = await imports.channel.send(embed);

                    let requestResponse = await imports.awaitRequest(imports.guild.id, imports.channel.id, imports.user.id, code.join(''));
                    if (requestResponse == -1) {
                        let newEmbed = new Discord.RichEmbed();
                        newEmbed.setColor(imports.local.guild.colors.accent);
                        newEmbed.setDescription(`you already have a pending request!`);
                        embedMessage.edit(newEmbed);    
                    }

                    else if (requestResponse == 0) {
                        let newEmbed = new Discord.RichEmbed();
                        newEmbed.setColor(imports.local.guild.colors.accent);
                        newEmbed.setDescription(`the request had timed out!`);
                    }

                    else if (requestResponse == 1) {
                        let successEmbed = new Discord.RichEmbed();
                        successEmbed.setColor(imports.local.guild.colors.accent);
                        successEmbed.setDescription(`you payed ${user.displayName} **$${parameters[1]}**`);
                        await imports.Data.inventory.money.remove(imports.user.id, parameters[1]);
                        await imports.Data.inventory.money.add(user.id, parameters[1]);
                        embedMessage.edit(successEmbed);
                    }
                }

                else {
                    await imports.Data.inventory.money.remove(imports.user.id, parameters[1]);
                    await imports.Data.inventory.money.add(parameters[0], parameters[1]);
                    embed.setDescription(`you payed ${user.displayName} **$${parameters[1]}**`);
                    imports.channel.send(embed);
                }
            }

            else { embed.setDescription(`you don't have **$${parameters[1]}**`); imports.channel.send(embed); }
        }

        else { embed.setDescription(`that user doesn't exist`); imports.channel.send(embed); }
    }
}