String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
}

var Discord = require('discord.js');
var messageParser = require('./../../../core/parseMessage.js').toString();

module.exports = function(imports, parameters) {
    var member = imports.guild.members.get(parameters[0]);
    
    var message = {
        author: member.user,
        member: member,
        channel: imports.channel,
        guild: imports.guild,
        content: imports.data.guilds[imports.guild.id].config.prefix + parameters[1]
    }

    var stringFunction = messageParser.replaceAll("'", '@').replaceAll('"', "'").replaceAll('@', '"');
    eval('var messageFunction = ' + stringFunction);

    messageFunction(imports, message);
}