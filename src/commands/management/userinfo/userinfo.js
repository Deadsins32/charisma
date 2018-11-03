var Discord = require('discord.js');

module.exports = function(imports, arguments) {
    var embed = new Discord.RichEmbed();
    embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);

    var id = imports.user.id;
    if (arguments[0]) { id = arguments[0] }

    var member = imports.guild.members.get(id);
    embed.setAuthor(member.user.username + '#' + member.user.discriminator, member.user.avatarURL);

    embed.addField('ID', member.user.id, true);
    embed.addField('status', member.user.presence.status, true);
    embed.setThumbnail(member.user.avatarURL);
    if (member.nickname != null) { embed.addField('nickname', member.nickname, true) }

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

    /*var embed = new Discord.RichEmbed();
    embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
    var id;

    if (arguments[0] != undefined) {
        id = imports.Command.methods.mention(arguments[0]).value;
    }

    else {
        id = imports.user.id;
    }

    var member = imports.guild.members.find('id', id);
    embed.setAuthor(member.user.username + '#' + member.user.discriminator, member.user.avatarURL);

    embed.addField('ID', member.user.id, true);
    embed.addField('status', member.user.presence.status, true);

    if (member.nickname != null) {
        embed.addField('nickname', member.nickname, true);
    }

    function parseDate(date) {
           var days = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ]

        var months = [
            'January',
            'Febuary',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ]

        var day = days[date.getDay()];
        var month = months[date.getMonth()];
        var exact = createdDate.getDate();

        var exactSuffix;

        if (exact.toString().split('')[exact.toString().split('').length - 1] == '1') {
            exactSuffix = 'st';
        }

        else if (exact.toString().split('')[exact.toString().split('').length - 1] == '2') {
            exactSuffix = 'nd';
        }

        else if (exact.toString().split('')[exact.toString().split('').length - 1] == '3') {
            exactSuffix = 'rd';
        }

        else {
            exactSuffix = 'th';
        }

        var year = date.getFullYear();
        var hour = date.getHours() + 1;
        var minute = date.getMinutes();

        var timeSuffix;

        switch(hour) {
            case 1:
                timeSuffix = 'AM';
                break;
            case 2:
                timeSuffix = 'AM';
                break;
            case 3:
                timeSuffix = 'AM';
                break;
            case 4:
                timeSuffix = 'AM';
                break;
            case 5:
                timeSuffix = 'AM';
                break;
            case 6:
                timeSuffix = 'AM';
                break;
            case 7:
                timeSuffix = 'AM';
                break;
            case 8:
                timeSuffix = 'AM';
                break;
            case 9:
                timeSuffix = 'AM';
                break;
            case 10:
                timeSuffix = 'AM';
                break;
            case 11:
                timeSuffix = 'AM';
                break;
            case 12:
                timeSuffix = 'PM';
                break;
            case 13:
                timeSuffix = 'PM';
                hour = 1;
            case 14:
                timeSuffix = 'PM';
                hour = 2;
            case 15:
                timeSuffix = 'PM';
                hour = 3;
            case 16:
                timeSuffix = 'PM';
                hour = 4;
            case 17:
                timeSuffix = 'PM';
                hour = 5;
            case 18:
                timeSuffix = 'PM';
                hour = 6;
            case 19:
                timeSuffix = 'PM';
                hour = 7;
            case 20:
                timeSuffix = 'PM';
                hour = 8;
            case 21:
                timeSuffix = 'PM';
                hour = 9;
            case 22:
                timeSuffix = 'PM';
                hour = 10;
            case 23:
                timeSuffix = 'PM';
                hour = 11;
            case 24:
                timeSuffix = 'AM';
                hour = 12;
        }
    
        return day + ', ' + month + ' ' + exact + exactSuffix + ' ' + year + ' @ ' + hour + ':' + minute + timeSuffix;
    }

    var createdDate = member.user.createdAt;
    var joinedDate = member.joinedAt;

    embed.addField('account created', parseDate(createdDate));
    embed.addField('user joined', parseDate(joinedDate));

    var roles = member.roles.array();

    var rolesString;
    if (roles.length == 1) {
        rolesString = '';
    }

    else {
        rolesString = roles[1].name;
    }
    
    for (r in roles) {
        if (r > 1) {
            rolesString += ', ' + roles[r].name;
        }
    }

    if (rolesString != '') {
        embed.addField('roles[' + (roles.length - 1) + ']', rolesString);
    }

    imports.channel.send(embed);*/
}