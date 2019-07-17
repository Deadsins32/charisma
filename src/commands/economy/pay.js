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
        
        var user = imports.guild.members.get(parameters[0]);
        if (user) {
            var money = await imports.Data.inventory.getMoney(imports.user.id);
            if (parameters[1] <= money) {
                if (parameters[1] > 5000) {
                    var code = [];
                    for (var i = 0; i < 4; i++) { code.push(Math.floor(Math.random() * 9)) }
                    embed.setDescription(`you're attempting to pay someone more than **$5000**\nplease verify by typing \`${code.join('')}\``);
                    var embedMessage = await imports.channel.send(embed);
                    try {
                        var response = await imports.channel.awaitMessages(message => message.author.id == imports.user.id && message.content == code.join(''), {
                            maxMatches: 1,
                            time: 20000,
                            errors: ['time']
                        });

                        if (response.array()[0]) {
                            var successEmbed = new Discord.RichEmbed();
                            successEmbed.setColor(imports.local.guild.colors.accent);
                            successEmbed.setDescription(`you payed ${user.displayName} **$${parameters[1]}**`);
                            await imports.Data.inventory.removeMoney(imports.user.id, parameters[1]);
                            await imports.Data.inventory.addMoney(user.id, parameters[1]);
                            embedMessage.edit(successEmbed);
                        }
                    }

                    catch(error) {
                        var errorEmbed = new Discord.RichEmbed();
                        errorEmbed.setColor(imports.local.guild.colors.accent);
                        errorEmbed.setDescription(`an error occured while trying to verify your transaction`);
                        embedMessage.edit(errorEmbed);
                    }


                }

                else {
                    await imports.Data.inventory.removeMoney(imports.user.id, parameters[1]);
                    await imports.Data.inventory.addMoney(parameters[0], parameters[1]);
                    embed.setDescription(`you payed ${user.displayName} **$${parameters[1]}**`);
                    imports.channel.send(embed);
                }
            }

            else { embed.setDescription(`you don't have **$${parameters[1]}**`); imports.channel.send(embed); }
        }

        else { embed.setDescription(`that user doesn't exist`); imports.channel.send(embed); }
    }
}