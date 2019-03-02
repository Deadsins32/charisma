var Discord = require('discord.js');

module.exports = function(imports, parameters) {
    var member;
    var moderate = 'not a target for enforcement action. The trigger of the Dominator will be locked.';
    var severe = 'classified as a latent criminal and is a target for enforcement action. The Dominator will be set to Non-Lethal Paralyzer mode.';
    var lethal = 'serious threat to the society. Lethal force is authorized. The Dominator is set to Lethal Eliminator.';
    var infinity = 'not a target for enforcement action. The trigger of the Dominator will now be thoroughly melted.';

    var isBot = false;
    var isSelf = false;

    var title;
    var description;

    if (parameters[0]) { member = imports.guild.members.get(parameters[0]) }
    else { member = imports.member }
    
    if (member) {
        if (member.id == imports.client.user.id) { isBot = true }
        else if (member.id == imports.user.id) { isSelf = true }

        if (isSelf) {
            name = 'your '
            moderate = '**you** are ' + moderate;
            severe = '**you** are ' + severe;
            lethal = '**you** pose a ' + lethal;
        }

        else {
            var name = member.displayName;
            if (member.displayName.slice(-1) == 's') { name += '\'' }
            else { name += '\'s' }
            
            moderate = `**${member.displayName}** is ${moderate}`;
            severe = `**${member.displayName}** is ${severe}`;
            lethal = `**${member.displayName}** poses a ${lethal}`;
            infinity = `**${member.displayName}** is ${infinity}`;
        }

        var discriminator = member.user.discriminator;

        Math.seedrandom(discriminator);
        var coefficient = Math.floor(Math.random() * 400);

        if (isBot) { title = `**${name}** crime coefficient is **∞**` }
        else { title = `**${name}** crime coefficient is **${coefficient}**` }

        if (isBot) { description = infinity }
        else if (coefficient < 100) { description = moderate }
        else if (coefficient > 300) { description = lethal }
        else { description = severe }
    }

    else {
        description = 'invalid user';
    }

    var embed = new Discord.RichEmbed();
    embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);

    if (title) { description = `${title}\n${description}` }
    embed.setDescription(description);
    imports.channel.send(embed);
}