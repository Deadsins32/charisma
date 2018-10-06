var Discord = require('discord.js');

module.exports = function(imports, arguments) {
    var discriminator;
    var identifier;
    var identifier2;
    var identifier3;
    var isSelf = false;
    var message;

    var embed = new Discord.RichEmbed();
    embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);

    if (arguments[0] == undefined) {
        discriminator = imports.user.user.discriminator;
        identifier = 'Your';
        identifier2 = 'You are';
        identifier3 = 'You pose';
    }

    else {
        arguments[0] = imports.Command.methods.mention(arguments[0]).value;
        if (arguments[0] == imports.client.user.id) {
            isSelf = true;
            identifier = imports.client.user.username;
        }

        else {
            discriminator = imports.guild.members.get(arguments[0]).user.discriminator;
            identifier = imports.guild.members.get(arguments[0]).displayName;
            identifier2 = identifier + ' is';
            identifier3 = identifier + ' poses';
            if (identifier.slice(-1) == 's') {
                identifier += "'";
            }

            else {
                identifier += "'s";
            }
        }
    }

    Math.seedrandom(discriminator);

    var coefficient = Math.floor(Math.random() * 400);

    message = identifier + ' Crime Coefficient is `' + coefficient + '`\n';

    if (isSelf) {
        message = identifier + "'s Crime Coefficient is `∞`\n" + identifier + ' is not a target for enforcement action. The trigger of the Dominator will now be thoroughly melted.';
    }

    else {
        if (coefficient < 100) {
            message += identifier2 + ' not a target for enforcement action. The trigger of the Dominator will be locked.';
        }

        else if (coefficient > 300) {
            message += identifier3 + ' a serious threat to the society. Lethal force is authorized. The Dominator is set to Lethal Eliminator.';
        }

        else {
            message += identifier2 + ' classified as a latent criminal and is a target for enforcement action. The Dominator will be set to Non-Lethal Paralyzer mode.';
        }
    }

    embed.setDescription(message);
    imports.channel.send(embed);
}