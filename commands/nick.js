module.exports = function(imports, arguments) {
    var id = imports.Command.methods.mention(arguments[0]).value;
    var member = imports.guild.members.find('id', id);
    if (member.nickname != null) {
        var before = member.nickname;
        member.setNickname(arguments[1])
            .then(function() {
                imports.channel.send('`changed ' + member.displayName + '\'s nickname from "' + before + '" to "' + arguments[1] + '"`')
            })
            .catch(function(error) {
                imports.channel.send('`' + error + '`');
            });
    }

    else {
        member.setNickname(arguments[1])
            .then(function() {
                imports.channel.send('`set ' + member.displayName + '\'s nickname to "' + arguments[1] + '"`')
            })
            .catch(function(error) {
                imports.channel.send('`' + error + '`');
            });
    }
}