String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
}

var Discord = require('discord.js');
var messageParser = require('./../../../core/parseMessage.js').toString();

function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

function randBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function percentageOf(num, percentage) {
    return (percentage / 100) * num;
}

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