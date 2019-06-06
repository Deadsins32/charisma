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

module.exports = {
    config: {
        permissions: ['GUILD.MANAGE'],
        description: 'enables a specific feature on the server',
        hidden: false,
        nsfw: false,
        tags: ['management', 'admin'],
        params: [
            { type: 'string', required: true, name: 'feature' }
        ]
    },

    command: function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);

        if (Object.byString(imports.local.guild.options, parameters[0]) != undefined) {
            if (Object.byString(imports.local.guild.options, parameters[0]) == false) {
                set(imports.local.guild.options, parameters[0], true);
                embed.setDescription(`\`${parameters[0]}\` has been enabled`);
            }

            else { embed.setDescription(`\`${parameters[0]}\` has already been enabled`) }
        }

        else { embed.setDescription(`\`${parameters[0]}\` does not exist`) }

        imports.channel.send(embed);
    }
}