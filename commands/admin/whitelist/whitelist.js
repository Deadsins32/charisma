var Discord = require('discord.js');

module.exports = function(imports, parameters) {
    var commands = imports.Command.configs;
    var embed = new Discord.RichEmbed();
    embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
    if (parameters[0] == 'get') {
        var isCommand = false;
        for (c in commands) { if (c == parameters[1]) { isCommand = true } }
        if (isCommand) {
            var whitelist = imports.data.guilds[imports.guild.id].whitelist;
            if (whitelist[parameters[1]]) {
                if (whitelist[parameters[1]].length != 0) {
                    var members = new Array();
                    for (var m = 0; m < whitelist[parameters[1]].length; m++) {
                        var member = imports.guild.members.get(whitelist[parameters[1]][m]);
                        members.push(member.user.username + '#' + member.user.discriminator);
                    }

                    embed.setTitle(parameters[1] + ' whitelist');
                    embed.setDescription(members.join(', '));
                }

                else {
                    embed.setDescription('that command isn\'t whitelisted');
                }
            }

            else {
                embed.setDescription('that command isn\'t whitelisted');
            }
        }

        else {
            embed.setDescription('that command doesn\'t exist');
        }
    }

    else if (parameters[0] == 'add') {
        var isCommand = false;
        for (c in commands) { if (c == parameters[1]) { isCommand = true } }
        if (isCommand) {
            if (parameters[2]) {
                var member = imports.guild.members.get(parameters[2]);
                if (member) {
                    var whitelist = imports.data.guilds[imports.guild.id].whitelist;
                    var isWhitelisted = false;
                    if (whitelist[parameters[1]]) { if (whitelist[parameters[1]].includes[parameters[2]]) { isWhitelisted = true } }
                    if (!isWhitelisted) {
                        if (whitelist[parameters[1]] == undefined) { whitelist[parameters[1]] = new Array() }
                        whitelist[parameters[1]].push(parameters[2]);
                        imports.data.guilds[imports.guild.id].whitelist = whitelist;
                        embed.setDescription(`**${member.user.username}#${member.user.discriminator}** has been added to the **${parameters[1]}** whitelist`);
                    }

                    else {
                        embed.setDescription('that command is already whitelisted for that user');
                    }
                }

                else {
                    embed.setDescription('invalid user');
                }
            }

            else {
                embed.setDescription('please specify a user');
            }
        }

        else {
            embed.setDescription('that command doesn\'t exist');
        }
    }

    else if (parameters[0] == 'remove') {
        var isCommand = false;
        for (c in commands) { if (c == parameters[1]) { isCommand = true } }
        if (isCommand) {
            var whitelist = imports.data.guilds[imports.guild.id].whitelist;
            var isUsers = false;
            if (whitelist[parameters[1]]) { if (whitelist[parameters[1]].length != 0) { isUsers = true } }
            if (isUsers) {
                if (parameters[2]) {
                    var member = imports.guild.members.get(parameters[2]);
                    if (member) {
                        if (whitelist[parameters[1]].includes(parameters[2])) {
                            var newWhitelist = new Array();
                            for (var m = 0; m < whitelist[parameters[1]].length; m++) { if (whitelist[parameters[1]][m] != parameters[2]) { newWhitelist.push(whitelist[parameters[1]][m]) } }
                            whitelist[parameters[1]] = newWhitelist;
                            imports.data.guilds[imports.guild.id].whitelist = whitelist;
                            embed.setDescription(`**${member.user.username}#${member.user.discriminator}** has been removed from the **${parameters[1]}** whitelist`);
                        }

                        else {
                            embed.setDescription('that command isn\'t whitelisted for that user');
                        }
                    }

                    else {
                        embed.setDescription('invalid user');
                    }
                }

                else {
                    embed.setDescription('please specify a user');
                }
            }

            else {
                embed.setDescription('that command isn\'t whitelisted');
            }
        }

        else {
            embed.setDescription('that command doesn\'t exist');
        }
    }

    else if (parameters[0] == 'clear') {
        var isCommand = false;
        for (c in commands) { if (c == parameters[1]) { isCommand = true } }
        if (isCommand) {
            var whitelist = imports.data.guilds[imports.guild.id].whitelist;
            var isUsers = false;
            if (whitelist[parameters[1]]) { if(whitelist[parameters[1]].length != 0) { isUsers = true } }
            if (isUsers) {
                whitelist[parameters[1]] = new Array();
                imports.data.guilds[imports.guild.id].whitelist = whitelist;
                embed.setDescription(`the **${parameters[1]}** whitelist has been cleared`);
            }

            else {
                embed.setDescription('that command isn\'t whitelisted');
            }
        }

        else {
            embed.setDescription('that command doesn\'t exist');
        }
    }

    else {
        embed.setDescription('invalid option\n( get | add | remove | clear )');
    }

    imports.channel.send(embed);
}