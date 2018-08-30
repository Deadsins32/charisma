module.exports = function(imports, arguments) {
    var id = imports.Command.methods.mention(arguments[0]).value;
    var reason = 'NO REASON';
    var days = 0;
    if (arguments[1] != undefined) {
        reason = arguments[1];
    }

    if (arguments[2] != undefined) {
        days = parseInt(arguments[2]);
    }

    if (imports.user.id != id) {
        var member = imports.guild.members.find('id', id);
        member.ban({reason: reason, days: days})
            .then(() => imports.channel.send('`user: ' + member.displayName + ' has been banned for reason: "' + reason + '"`\n`' + days + ' day(s) worth of messages deleted`'))
            .catch((function(error) {
                imports.channel.send('`' + error + '`');
            }));
    }

    else {
        imports.channel.send('`you can\'t ban yourself`');
    }
}