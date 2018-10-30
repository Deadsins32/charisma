String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
}

var messageParser = require('../../../events/message.js').toString();

module.exports = function(imports, arguments) {
    var member = imports.guild.members.get(arguments[0]);
    
    var message = {
        author: member.user,
        member: member,
        channel: imports.channel,
        guild: imports.guild,
        content: imports.data.guilds[imports.guild.id].config.prefix + arguments[1]
    }

    var stringFunction = messageParser.replaceAll("'", '@').replaceAll('"', "'").replaceAll('@', '"');
    eval('var messageFunction = ' + stringFunction);

    messageFunction(imports, message);
}