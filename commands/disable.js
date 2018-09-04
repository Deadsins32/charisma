Object.byString = function(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}

function set(obj, path, value) {
    obj = typeof obj === 'object' ? obj : {};
    var keys = Array.isArray(path) ? path : path.split('.');
    var curStep = obj;
    for (var i = 0; i < keys.length - 1; i++) {
        var key = keys[i];

        if (!curStep[key] && !Object.prototype.hasOwnProperty.call(curStep, key)){
            var nextKey = keys[i+1];
            var useArray = /^\+?(0|[1-9]\d*)$/.test(nextKey);
            curStep[key] = useArray ? [] : {};
        }
        curStep = curStep[key];
    }
    var finalStep = keys[keys.length - 1];
    curStep[finalStep] = value;
};

var Discord = require('discord.js');
var fs = require('fs');

module.exports = function(imports, arguments) {
    var embed = new Discord.RichEmbed();

    embed.setColor(imports.settings.guilds[imports.guild.id].accentcolor);

    if (Object.byString(imports.settings.guilds[imports.guild.id].features, arguments[0]) != undefined) {
        if (Object.byString(imports.settings.guilds[imports.guild.id].features, arguments[0]) == true) {
            set(imports.settings.guilds[imports.guild.id].features, arguments[0], false);
            var json = JSON.stringify(imports.settings.guilds[imports.guild.id], null, 4);
            fs.writeFileSync('./data/settings/guilds.json', json);
            embed.setDescription('`' + arguments[0] + '` has been disabled');
        }

        else {
            embed.setDescription('`' + arguments[0] + '` is already been disabled');
        }
    }

    else {
        embed.setDescription('`' + arguments[0] + '` does not exist');
    }

    imports.channel.send(embed);
}