var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: ['GUILD.MANAGE'],
        description: 'used for managing command whitelisting',
        hidden: false,
        nsfw: false,
        tags: ['management', 'admin'],
        params: [
            { type: 'string', required: true, name: 'get | add | remove | clear' },
            { type: 'string', required: true, name: 'command' },
            { type: 'mention', required: false, name: 'user' }
        ]
    },

    command: function(imports, parameters) {
        var commands = imports.Command.configs;
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
        if (parameters[0] == 'get') {
            var isCommand = false;
            for (c in commands) { if (c == parameters[1]) { isCommand = true } }
            if (isCommand) {
                var whitelist = imports.local.guild.whitelist;
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
    
                    else { embed.setDescription(`that command isn't whitelisted`) }
                }
    
                else { embed.setDescription(`that command isn't whitelisted`) }
            }
    
            else { embed.setDescription(`that command doesn't exist`) }
        }
    
        else if (parameters[0] == 'add') {
            var isCommand = false;
            for (c in commands) { if (c == parameters[1]) { isCommand = true } }
            if (isCommand) {
                if (parameters[2]) {
                    var member = imports.guild.members.get(parameters[2]);
                    if (member) {
                        var whitelist = imports.local.guild.whitelist;
                        var isWhitelisted = false;
                        if (whitelist[parameters[1]]) { if (whitelist[parameters[1]].includes[parameters[2]]) { isWhitelisted = true } }
                        if (!isWhitelisted) {
                            if (whitelist[parameters[1]] == undefined) { whitelist[parameters[1]] = new Array() }
                            whitelist[parameters[1]].push(parameters[2]);
                            imports.local.guild.whitelist = whitelist;
                            embed.setDescription(`**${member.user.username}#${member.user.discriminator}** has been added to the **${parameters[1]}** whitelist`);
                        }
    
                        else { embed.setDescription(`that command is already whitelisted for that user`) }
                    }
    
                    else { embed.setDescription(`invalid user`) }
                }
    
                else { embed.setDescription(`please specify a user`) }
            }
    
            else { embed.setDescription(`that command doesn't exist`) }
        }
    
        else if (parameters[0] == 'remove') {
            var isCommand = false;
            for (c in commands) { if (c == parameters[1]) { isCommand = true } }
            if (isCommand) {
                var whitelist = imports.local.guild.whitelist;
                var isUsers = false;
                if (whitelist[parameters[1]]) { if (whitelist[parameters[1]].length != 0) { isUsers = true } }
                if (isUsers) {
                    if (parameters[2]) {
                        var member = imports.guild.members.get(parameters[2]);
                        if (member) {
                            if (whitelist[parameters[1]].includes(parameters[2])) {
                                var newWhitelist = new Array();
                                for (var m = 0; m < whitelist[parameters[1]].length; m++) { if (whitelist[parameters[1]][m] != parameters[2]) { newWhitelist.push(whitelist[parameters[1]][m]) } }
                                if (newWhitelist.length == 0) { delete whitelist[parameters[1]] }
                                else { whitelist[parameters[1]] = newWhitelist }
                                imports.local.guild.whitelist = whitelist;
                                embed.setDescription(`**${member.user.username}#${member.user.discriminator}** has been removed from the **${parameters[1]}** whitelist`);
                            }
    
                            else { embed.setDescription(`that command isn't whitelisted for that user`) }
                        }
    
                        else { embed.setDescription(`invalid user`) }
                    }
    
                    else { embed.setDescription(`please specify a user`) }
                }
    
                else { embed.setDescription(`that command isn't whitelisted`) }
            }
    
            else { embed.setDescription(`that command doesn't exist`) }
        }
    
        else if (parameters[0] == 'clear') {
            var isCommand = false;
            for (c in commands) { if (c == parameters[1]) { isCommand = true } }
            if (isCommand) {
                var whitelist = imports.local.guild.whitelist;
                var isUsers = false;
                if (whitelist[parameters[1]]) { isUsers = true }
                if (isUsers) {
                    delete whitelist[parameters[1]];
                    imports.local.guild.whitelist = whitelist;
                    embed.setDescription(`the **${parameters[1]}** whitelist has been cleared`);
                }
    
                else { embed.setDescription(`that command isn't whitelisted`) }
            }
    
            else { embed.setDescription(`that command doesn't exist`) }
        }
    
        else {
            embed.setTitle(`invalid option`);
            embed.setDescription(`( get | add | remove | clear )`);
        }
    
        imports.channel.send(embed);
    }
}