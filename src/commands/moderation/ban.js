var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: ['DISCORD.BAN_MEMBERS'],
        description: 'bans whoever you specify',
        tags: ['management', 'admin'],
        hidden: false,
        nsfw: false,
        params: [
            { type: 'mention', required: true, name: 'member' },
            { type: 'string', required: false, name: 'reason' },
            { type: 'number', required: false, name: 'days of messages to delete' }
        ],
    
        usage: [ "[userfull]" ]
    },

    command: function(imports, parameters) {
        var id = arguments[0];
        var reason = 'NO REASON';
        var days = 0;
    
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
    
        if (parameters[1] != undefined) {
            reason = parameters[1];
        }
    
        if (parameters[2] != undefined) {
            days = parseInt(parameters[2]);
        }
    
        if (imports.user.id != id) {
            var member = imports.guild.members.find('id', id);
            var name = member.user.username + '#' + member.user.descriminator;
            member.ban({reason: reason, days: days}).then(function() {
                embed.setDescription('user: ' + name + ' has been banned for reason: "' + reason + '"; ' + days + ' day(s) worth of messages have been deleted');
                imports.channel.send(embed);
            }).catch((function(error) { console.log(error) }));
        }
    
        else {
            embed.setDescription(`you can't ban yourself`);
            imports.channel.send(embed);
        }
    }
}