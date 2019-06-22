var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: ['GUILD.MANAGE'],
        description: 'used for managing command blacklisting',
        hidden: false,
        nsfw: false,
        tags: ['management', 'admin'],
        params: [
            { type: 'string', required: true, name: 'get | add | remove | clear' },
            { type: 'mention', required: true, name: 'user' },
            { type: 'string', required: false, name: 'command' }
        ]
    },

    command: function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
        if (parameters[0] == 'get') {
            var id = parameters[1];
            var member = imports.guild.members.get(id);
            if (member) {
                if (!imports.local.guild.blacklist[id] || imports.local.guild.blacklist[id].length == 0) { embed.setDescription(member.displayName + ' doesn\'t have any commands blacklisted') }
                else { embed.setDescription(imports.local.guild.blacklist[id].join(',\n')) }
            }
    
            else { embed.setDescription('invalid user') }
        }
    
        else if (parameters[0] == 'add') {
            var id = parameters[1];
            var member = imports.guild.members.get(id);
            if (member) {
                if (parameters[2]) {
                    if (imports.Command.get(parameters[2])) {
                        if (!imports.local.guild.blacklist[id]) { imports.local.guild.blacklist[id] = new Array() }
                        var blacklist = imports.local.guild.blacklist[id];
                        var exists = false;
                        for (b = 0; b < blacklist.length; b++) { if (blacklist[b] == parameters[2]) { exists = true } }
                        if (exists) { embed.setDescription(`${member.displayName} is already blacklisted from using ${parameters[2]}`) }
                        else {
                            imports.local.guild.blacklist[id].push(parameters[2]);
                            embed.setDescription(member.displayName + ' has been blacklisted from using the ' + parameters[2] + ' command');
                        }
                    }
    
                    else { embed.setDescription(`that command doesn't exist`) }
                }
    
                else { embed.setDescription(`please specify the command that you want to add`) }
            }
    
            else { embed.setDescription('invalid user') }
        }
    
        else if (parameters[0] == 'remove') {
            var id = parameters[1];
            var member = imports.guild.members.get(id);
            if (member) {
                if (parameters[2] != undefined) {
                    if (imports.Command.get(parameters[2])) {
                        var blacklist = imports.local.guild.blacklist[id];
                        var exists = false;
                        for (b = 0; b < blacklist.length; b++) { if (blacklist[b] == parameters[2]) { exists = true } }
                        if (exists) {
                            var newBlacklist = new Array();
                            for (b = 0; b < blacklist.length; b++) { if (blacklist[b] != parameters[2]) { newBlacklist.push(blacklist[b]) } }
                            if (newBlacklist.length == 0) { delete imports.local.guild.blacklist[id] }
                            else { imports.local.guild.blacklist[id] = newBlacklist }
                            embed.setDescription(`${member.displayName} has been unblacklisted from using ${parameters[2]}`)
                        }
    
                        else { embed.setDescription(`${member.displayName} is not blacklisted from using ${parameters[2]}`) }
                    }
    
                    else { embed.setDescription(`that command doesn't exist`) }
                }
    
                else { embed.setDescription(`please specify a command that you want to remove`) }
            }
    
            else { embed.setDescription('invalid user') }
        }
    
        else if (parameters[0] == 'clear') {
            var id = parameters[1];
            var member = imports.guild.members.get(id);
            if (member) {
                delete imports.local.guild.blacklist[id];
                embed.setDescription(`${member.displayName}'s blacklist has been cleared`);
            }
    
            else { embed.setDescription('invalid user') }
        }
    
        else {
            embed.setTitle(`invalid option`);
            embed.setDescription(`( get | add | remove | clear )`)
        }

        imports.channel.send(embed);
    }
}