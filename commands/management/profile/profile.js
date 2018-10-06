var Discord = require('discord.js');

module.exports = function(imports, arguments) {
    var embed = new Discord.RichEmbed();
    embed.setColor(imports.settings.guilds[imports.guild.id].colors.accent);
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

    imports.channel.send(embed);
}