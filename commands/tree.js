var treeify = require('treeify');

module.exports = function(imports, arguments) {
    if (arguments[0] == 'features') {
        imports.channel.send('```' + treeify.asTree(imports.settings.guilds[imports.guild.id].features, true) + '```');
    }

    else {
        imports.channel.send('`"' + arguments[0] + '" does not exist`');
    }
}