module.exports = function(imports, arguments) {
    var array = arguments[0].split('.');
    var levels = [];

    for (a in array) {
        if (array[a] != '') {
            levels.push(array[a]);
        }
    }

    var current = imports.settings.guilds[imports.guild.id].features;
    var currentString = 'features';
    var passed = true;

    for (l in levels) {
        if (current[levels[l]] != undefined) {
            console.log(typeof current[levels[l]]);
            current = current[levels[l]];
            currentString += '.' + levels[l];
        }

        else {
            passed = false;
        }
    }

    if (passed && typeof current === 'boolean') {
        if (current == false) {
            eval('imports.settings.guilds["' + imports.guild.id + '"].' + currentString + ' = true');
            var json = JSON.stringify(imports.settings.guilds, null, 4);
            imports.fs.writeFileSync('./data/settings/guilds.json', json);
            imports.channel.send('`"' + arguments[0] + '" has been enabled`');
        }

        else {
            imports.channel.send('`"' + arguments[0] + '" is already enabled`');
        }
    }

    else {
        imports.channel.send('`"' + arguments[0] + '" does not exist`');
    }
}