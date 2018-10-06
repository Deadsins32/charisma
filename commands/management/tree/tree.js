var treeify = require('treeify');
var Discord = require('discord.js');

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

module.exports = function(imports, arguments) {

    var tree = {
        features: imports.settings.guilds[imports.guild.id].features
    }

    if (Object.byString(tree, arguments[0])) {
        imports.channel.send('```' + treeify.asTree(Object.byString(tree, arguments[0]), true) + '```');
    }

    else {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.settings.guilds[imports.guild.id].colors.accent);
        embed.setDescription('`' + arguments[0] + '` does not exist');
    }
}