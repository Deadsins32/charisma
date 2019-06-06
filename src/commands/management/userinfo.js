var Discord = require('discord.js');

function parseDate(milliseconds) {
    var seconds = Math.floor(milliseconds / 1000);
    
    var minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    var hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    var days = Math.floor(hours / 24);
    hours = hours % 24;
    var weeks = Math.floor(days / 7);
    days = days % 7;
    var months = Math.floor(weeks / 4);
    weeks = weeks % 4;
    var years = Math.floor(months / 12);
    months = months % 12;

    var suffixes = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];
    var values = [years, months, weeks, days, hours, minutes, seconds];
    var suffs = new Array();
    var vals = new Array();

    for (v in values) {
        if (values[v] != 0) {
            suffs.push(suffixes[v]);
            vals.push(values[v]);
        }
    }

    var output = '';

    for (var v = 0; v < vals.length; v++) {
        if (v != vals.length-1) {
            if (vals[v] > 1) {
                output += vals[v] + ' ' + suffs[v] + ', ';
            }
            
            else {
                output += vals[v] + ' ' + suffs[v].substring(0, suffs[v].length - 1) + ', ';
            }
        }
        else {
            if (vals[v] > 1) {
                output += 'and ' + vals[v] + ' ' + suffs[v];
            }

            else {
                output += 'and ' + vals[v] + ' ' + suffs[v].substring(0, suffs[v].length - 1);
            }
        }
    }
    return output;
}

module.exports = {
    config: {
        permissions: [],
        description: 'Gets some nice user info',
        hidden: false,
        nsfw: false,
        tags: ['utility', 'fun'],
        params: [
            { type: 'mention', required: false, name: 'user' }
        ]
    },

    command: function(imports, arguments) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
    
        var id = imports.user.id;
        if (arguments[0]) { id = arguments[0] }
    
        var member = imports.guild.members.get(id);
        embed.setAuthor(member.user.username + '#' + member.user.discriminator, member.user.avatarURL);
    
        embed.addField('ID', member.user.id, true);
        embed.addField('status', member.user.presence.status, true);
        embed.setThumbnail(member.user.avatarURL);
        if (member.nickname != null) { embed.addField('nickname', member.nickname, true) }
    
        var created = member.user.createdAt;
        var joined = member.joinedAt;
    
        embed.addField('account created', parseDate(Date.now() - created) + ' ago');
        embed.addField('user joined', parseDate(Date.now() - joined) + ' ago');
    
        var roles = member.roles.array();
    
        var roleStr;
        if (roles.length == 1) { roleStr = '' }
        else { roleStr = roles[1].name }
        var overflow = false;
        for (var r = 0; r < roles.length; r++) {
            if (!overflow) {
                if (r > 1) {
                    var newStr = roleStr + ', ' + roles[r].name;
                    if (newStr.length > 2000) {
                        roleStr += ', ' + roles.length - (r+1) + ' more';
                        overflow = true;
                    }
    
                    else { roleStr = newStr }
                }
            }
        }
    
        embed.addField('roles[' + (roles.length-1) + ']', roleStr);
    
        imports.channel.send(embed);
    }
}