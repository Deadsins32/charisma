var fs = require('fs');

module.exports = function(imports, arguments) {
    arguments[0] = imports.Command.methods.mention(arguments[0]).value;
    var member = imports.guild.members.find('id', arguments[0]);
    
    var message = {
        content: arguments[1],
        guild: imports.guild,
        channel: imports.channel,
        member: member,
        author: member
    }

    if (message.author.bot) {
        return;
    }

    if (imports.settings.guilds[message.guild.id] == undefined) {
        imports.settings.guilds[message.guild.id] = imports.settings.defaults.guild;
        var json = JSON.stringify(imports.settings.guilds, null, 4);
        fs.writeFileSync('./data/settings/guilds.json', json);
    }

    if (imports.settings.guilds[message.guild.id].members[message.author.id] == undefined && imports.client.user.id != message.author.id) {
        imports.settings.guilds[message.guild.id].members[message.author.id] = imports.settings.defaults.member;
        var json = JSON.stringify(imports.settings.guilds, null, 4);
        fs.writeFileSync('./data/settings/guilds.json', json);
    }

    if (imports.settings.users[message.author.id] == undefined && imports.client.user.id != message.author.id) {
        imports.settings.users[message.author.id] = imports.settings.defaults.user;
        var json = JSON.stringify(imports.settings.users, null, 4);
        fs.writeFileSync('./data/settings/users.json', json);
    }

    var localsettings = {
        guild: imports.settings.guilds[message.guild.id],
        member: imports.settings.guilds[message.guild.id].members[message.author.id],
        user: imports.settings.users[message.author.id]
    }

    if (message.content.startsWith(localsettings.guild.prefix)) {
        var exports = {
            Command: imports.Command,
            Flavors: imports.Flavors,
            Seed: imports.Seed,

            client: imports.client,
            guild: message.guild,
            channel: message.channel,
            user: message.member,
            message: message,

            settings: imports.settings,
            localsettings: localsettings,
            config: imports.config,
            aliases: imports.aliases,
        }

        var command = {
            object: imports.Command.get.command(message.content.split(localsettings.guild.prefix)[1].split(' ')[0]),
            full: message.content.slice(localsettings.guild.prefix.length),
            name: message.content.slice(localsettings.guild.prefix.length).split(' ')[0],
            arguments: new Array()
        }

        var longArguments1 = command.full.match(/('([^']|'')*')/g);
        command.full = command.full.replace(/('([^']|'')*')/g, '[s]');

        if (command.full.split(' ').length - 1 > command.object.params.length) {
            if (command.object.params[command.object.params.length - 1].type == 'string') {
                var text = command.full.split(' ').splice(command.object.params.length);
                text = "'" + text.join(' ') + "'";
                var args = command.full.split(' ').splice(0, command.object.params.length);
                args[args.length] = text;
                command.full = args.join(' ');
            }
        }

        var longArguments2 = command.full.match(/('([^']|'')*')/g);
        command.full = command.full.replace(/('([^']|'')*')/g, '[ss]');

        command.arguments = command.full.slice(localsettings.guild.prefix.length + command.name + 1).split(' ');

        var s = 0;
        var ss = 0;
        for (a in command.arguments) {
            if (command.arguments[a] == '[s]') {
                command.arguments[a] = longArguments1[s].slice(1, -1);
                s++;
            }

            else if (command.arguments[a] == '[ss]') {
                command.arguments[a] = longArguments2[ss].slice(1, -1);
                ss++;
            }
        }

        command.arguments.splice(0, 1);

        if (imports.aliases[command.name] != undefined) {
            command.name = imports.aliases[command.name];
        }

        if (command.object != null) {
            var status = imports.Command.get.status(exports, command.object, imports.settings.blacklist);

            if (status.blacklisted) {
                if (message.author.id != imports.config.master) {
                    message.channel.send('`you have been blacklisted from using that command`');
                }

                else {
                    if (imports.Command.syntax.check(command.object, command.arguments)) {
                        imports.Command.commands[command.name](exports, command.arguments);
                    }

                    else {
                        message.channel.send('```invalid syntax\nusage: ' + imports.Command.syntax.get(localsettings.guild.prefix, command.name) + '```');
                    }
                }
            }

            else {
                if (status.usable) {
                    if (status.nsfw) {
                        if (message.channel.nsfw) {
                            if (imports.Command.syntax.check(command.object, command.arguments)) {
                                imports.Command.commands[command.name](exports, command.arguments);
                            }

                            else {
                                message.channel.send('```invalid syntax\nusage: ' + imports.Command.syntax.get(localsettings.guild.prefix, command.name) + '```');
                            }
                        }

                        else {
                            if (status.visible) {
                                message.channel.send('`you need to be in an nsfw channel to use that`');
                            }

                            else {
                                message.channel.send('`command not found`');
                            }
                        }
                    }

                    else {
                        if (imports.Command.syntax.check(command.object, command.arguments)) {
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
                }

                else {
                    if (status.visible) {
                        message.channel.send('`' + JSON.stringify(status.requiredPermissions) + ' is required' + '`');
                    }

                    else {
                        message.channel.send('`command not found`');
                    }
                }
            }
        }

        else {
            message.channel.send('`command not found`');
        }
    }
}