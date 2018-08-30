module.exports = function(imports, arguments) {
    arguments[0] = imports.Command.methods.mention(arguments[0]).value;
    var member = imports.guild.members.find('id', arguments[0]);
    
    var message = {
        content: arguments[1],
        guild: imports.guild,
        channel: imports.channel,
        author: member
    }

    if (imports.settings.guilds[message.guild.id] == undefined) {
        imports.settings.guilds[message.guild.id] = imports.settings.defaults.guild;
        var json = JSON.stringify(imports.settings.guilds, null, 4);
        imports.fs.writeFileSync('./data/settings/guilds.json', json);
    }

    if (imports.settings.guilds[message.guild.id].members[member.id] == undefined) {
        imports.settings.guilds[message.guild.id].members[member.id] = imports.settings.defaults.member;
        var json = JSON.stringify(imports.settings.guilds, null, 4);
        imports.fs.writeFileSync('./data/settings/guilds.json', json);
    }

    if (imports.settings.users[member.id] == undefined) {
        imports.settings.users[member.id] = imports.settings.defaults.user;
        var json = JSON.stringify(imports.settings.users, null, 4);
        imports.fs.writeFileSync('./data/settings/users.json', json);
    }

    var localsettings = {
        guild: imports.settings.guilds[message.guild.id],
        member: imports.settings.guilds[message.guild.id].members[member.id],
        user: imports.settings.users[member.id]
    }

    var exports = {
        client: imports.client,
        guild: imports.guild,
        channel: imports.channel,
        user: member,
        message: imports.message,
        settings: imports.settings,
        localsettings: imports.localsettings,
        snekfetch: imports.snekfetch,
        fs: imports.fs,
        Discord: imports.Discord,
        Command: imports.Command,
        Flavors: imports.Flavors,
        Seed: imports.Seed,
        config: imports.config,
        aliases: imports.aliases,
        treeify: imports.treeify,
        anime: imports.anime
    }

    var command = {
        name: message.content.split(localsettings.guild.prefix)[1].split(' ')[0],
        arguments: new Array()
    }

    var longArguments = (message.content.match(/('([^']|'')*')/g));

    if (message.content != (localsettings.guild.prefix + command.name)) {
        var content = message.content.replace(/('([^"]|'')*')/g, '[s]');
        command.arguments = content.split(localsettings.guild.prefix + command.name)[1].split(' ').slice(1);
    }

    var s = 0;
    for (a in command.arguments) {
        if (command.arguments[a] == '[s]') {
            command.arguments[a] = longArguments[s].slice(1, -1);
            s++;
        }
    }

    // determines if the command is using an alias

    if (imports.aliases[command.name] != undefined) {
        command.name = imports.aliases[command.name];
    }

    var object = imports.Command.get.command(command.name);

    if (object != null) {
        var status = imports.Command.get.status(exports, object, imports.settings.blacklist);

        if (status.blacklisted) {
            if (message.author.id != imports.config.master) {
                message.channel.send('`you have been blacklisted from using that command`');
            }

            else {
                if (imports.Command.syntax.check(object, command)) {
                    imports.Command.commands[command.name](exports, command.arguments);
                }
            }
        }

        else {
            if (status.usable) {
                if (imports.Command.syntax.check(object, command)) {
                    imports.Command.commands[command.name](exports, command.arguments);
                }

                else {
                    if (status.visible) {
                        message.channel.send('```invalid syntax\nusage: ' + imports.Command.syntax.get(localsettings.guild.prefix, command.name) + '```');
                    }

                    else {
                        message.channel.send('`command not found`');
                    }
                }
            }

            else {
                message.channel.send('`' + JSON.stringify(status.requiredPermissions) + ' is required`');
            }
        }
    }

    else {
        message.channel.send('`command not found`');
    }
}