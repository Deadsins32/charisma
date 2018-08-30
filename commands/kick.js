module.exports = function(imports, arguments) {
    var id = imports.Command.methods.mention(arguments[0]).value;
    var reason = 'NO REASON';
    if (arguments[1] != undefined) {
        reason = arguments[1];
    }

    if (imports.user.id != id) {
        var member = imports.guild.members.find('id', id);
        member.kick(reason)
            .then(() => imports.channel.send('`user: ' + member.displayName + ' has been kicked for reason: "' + reason + '"`'))
            .catch((function(error) {
                imports.channel.send('`' + error + '`');
            }));
    }

    else {
        imports.channel.send('`you can\'t kick yourself`');
    }
}