module.exports = function(imports, arguments) {
    if (arguments[0] == 'features') {
        imports.channel.send('```' + imports.treeify.asTree(imports.settings.guilds[imports.guild.id].features, true) + '```');
    }

    else {
        imports.channel.send('`"' + arguments[0] + '" does not exist`');
    }
}