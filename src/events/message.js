module.exports = function(imports, message) {
    var Discord = require('discord.js');
    var chalk = require('chalk');

    if (message.author.bot) {
        return;
    }
    
    if (imports.client.user.id != message.author.id) {
        if (!imports.data.guilds[message.guild.id]) {
            imports.data.guilds[message.guild.id] = imports.data.defaults.guild;
        }

        else {
            for (g in imports.data.defaults.guilds) {
                if (!imports.data.guilds[message.guild.id][g]) {
                    imports.data.guilds[message.guild.id][g] = imports.data.defaults.guilds[g];
                }
            }
        }

        if (!imports.data.guilds[message.guild.id].members[message.author.id]) {
            imports.data.guilds[message.guild.id].members[message.author.id] = imports.data.defaults.member;
            if (!imports.data.guilds[message.guild.id].blacklist[message.author.id]) {
                imports.data.guilds[message.guild.id].blacklist[message.author.id] = new Array();
            }
        }

        else {
            for (m in imports.data.defaults.member) {
                if (!imports.data.guilds[message.guild.id].members[message.author.id][m]) {
                    imports.data.guilds[message.guild.id].members[message.author.id][m] = imports.data.defaults.member[m];
                }
            }
        }

        if (!imports.data.users[message.author.id]) {
            imports.data.users[message.author.id] = imports.data.defaults.user;
        }

        else {
            for (u in imports.data.defaults.user) {
                if (!imports.data.users[message.author.id][u]) {
                    imports.data.users[message.author.id][u] = imports.data.defaults.user[u];
                }
            }
        }
    }

    var local = {
        guild: imports.data.guilds[message.guild.id],
        member: imports.data.guilds[message.guild.id].members[message.author.id],
        user: imports.data.users[message.author.id]
    }

    if (message.content.startsWith(local.guild.config.prefix)) {
        var exports = {
            Command: imports.Command,
            Flavors: imports.Flavors,
            Seed: imports.Seed,

            client: imports.client,
            guild: message.guild,
            channel: message.channel,
            user: message.author,
            member: message.member,
            message: message,

            data: imports.data,
            blacklist: imports.data.guilds[message.guild.id].blacklist,

            local: local,

            config: imports.config,
            aliases: imports.aliases,
            shorthands: imports.shorthands
        }

        var content;

        if (imports.shorthands[message.content.slice(local.guild.config.prefix.length).split(' ')[0]]) {
            content = message.content.replace(message.content.slice(local.guild.config.prefix.length).split(' ')[0], imports.shorthands[message.content.slice(local.guild.config.prefix.length).split(' ')[0]]);
        }

        else {
            content = message.content;
        }

        var command = {
            object: imports.Command.get.command(content.split(local.guild.config.prefix)[1].split(' ')[0]),
            full: content.slice(local.guild.config.prefix.length),
            name: content.slice(local.guild.config.prefix.length).split(' ')[0],
            arguments: new Array()
        }

        var longArguments1 = command.full.match(/("([^"]|"")*")/g);
        command.full = command.full.replace(/("([^"]|"")*")/g, '[s]');

        if (imports.aliases[command.name] != undefined) {
            var actual = imports.aliases[command.name];

            command.object = imports.Command.get.command(actual);
            command.full = command.full.replace(command.name, actual);
            command.name = actual;
        }

        var embed = new Discord.RichEmbed();
        embed.setColor(exports.local.guild.colors.accent);

        if (command.object != null) {
            if (command.full.split(' ').length - 1 > command.object.params.length) {
                if (command.object.params[command.object.params.length - 1].type == 'string') {
                    var text = command.full.split(' ').splice(command.object.params.length);
                    text = '"' + text.join(' ') + '"';
                    var args = command.full.split(' ').splice(0, command.object.params.length);
                    args[args.length] = text;
                    command.full = args.join(' ');
                }
            }

            var longArguments2 = command.full.match(/("([^"]|"")*")/g);
            command.full = command.full.replace(/("([^"]|"")*")/g, '[ss]');

            command.arguments = command.full.slice(local.guild.config.prefix.length + command.name + 1).split(' ');

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
            
            var status = imports.Command.get.status(exports, command, command.object, local.guild.blacklist[message.author.id], local.guild.whitelist);

            for (p in status.parameters) { command.arguments[p] = status.parameters[p] }

            if (status.whitelistedCommand && !status.isWhitelisted) {
                if (message.author.id != imports.config.master) {
                    embed.setDescription('you need to be whitelisted to use that command');
                    message.channel.send(embed);
                }
            }

            else if (status.blacklisted) {
                if (message.author.id != imports.config.master) {
                    embed.setDescription('you have been blacklisted from using that command');
                    message.channel.send(embed);
                }

                /*else {
                    if (imports.Command.syntax.check(command.object, command.arguments)) {
                        imports.Command.commands[command.name](exports, command.arguments);
                    }

                    else {
                        var embed = new Discord.RichEmbed();
                        embed.setColor(local.guild.colors.accent);
                        embed.setTitle('invalid syntax');
                        embed.addField('usage', '`' + imports.Command.syntax.get(local.guild.config.prefix, command.name) + '`');
                        message.channel.send(embed);
                    }
                }*/
            }

            else {
                if (status.userUsable) {
                    if (status.botUsable) {
                        if (status.nsfw) {
                            if (message.channel.nsfw) {
                                if (imports.Command.syntax.check(command.object, command.arguments)) {
                                    imports.Command.commands[command.name](exports, command.arguments);
                                }

                                else {
                                    embed.setTitle('invalid syntax');
                                    embed.addField('usage', '`' + imports.Command.syntax.get(local.guild.config.prefix, command.name) + '`');
                                    message.channel.send(embed);
                                }
                            }

                            else {
                                if (status.visible) {
                                    embed.setDescription('you need to be in an nsfw channel to use that');
                                    message.channel.send(embed);
                                }

                                else {
                                    embed.setDescription('command not found');
                                    message.channel.send(embed);
                                }
                            }
                        }

                        else {
                            if (imports.Command.syntax.check(command.object, command.arguments)) {
                                try {
                                    imports.Command.commands[command.name](exports, command.arguments);
                                }

                                catch(error) {
                                    var lines = error.stack.split('\n');
                                    for (l in lines) {
                                        if (l == 0) {
                                            imports.console.error(lines[l]);
                                        }

                                        else if (l == lines.length - 1) {
                                            console.log(chalk.redBright(' └─────'), lines[1].slice(4));
                                        }

                                        else {
                                            console.log(chalk.redBright(' ├─────'), lines[l].slice(4));
                                        }
                                    }
                                }
                            }

                            else {
                                if (status.visible) {
                                    embed.setTitle('invalid syntax');
                                    embed.addField('usage:', '`' + imports.Command.syntax.get(local.guild.config.prefix, command.name) + '`');
                                    message.channel.send(embed);
                                }

                                else {
                                    embed.setDescription('command not found');
                                    message.channel.send(embed);
                                }
                            }
                        }
                    }

                    else {
                        embed.setDescription('I don\'t have permission to do that');
                        message.channel.send(embed);
                    }
                }

                else {
                    if (status.visible) {
                        embed.setDescription('`' + JSON.stringify(status.requiredPermissions) + '` is required');
                        message.channel.send(embed);
                    }

                    else {
                        embed.setDescription('command not found');
                        message.channel.send(embed);
                    }
                }
            }
        }

        else {
            embed.setDescription('command not found');
            message.channel.send(embed);
        }
    }

    else {
        /*if (imports.settings.guilds[message.guild.id].features.leveling) {
            var baseExp = 100;
            var recievedExp = 20;

            //imports.settings.guilds[message.guild.id].members[message.member.id].exp += 20;

            console.log(imports.settings.guilds[message.guild.id].members[message.member.id].exp);

            var lvl = imports.settings.guilds[message.guild.id].members[message.member.id].level + 1;
            var crve = imports.settings.guilds[message.guild.id].expcurve;

            function nextLevel(level, curve) {
                return Math.floor(baseExp * (Math.pow(level, curve)));
            }

            if (imports.settings.guilds[message.guild.id].members[message.member.id].exp >= nextLevel(lvl, crve)) {
                imports.settings.guilds[message.guild.id].members[message.member.id].level += 1;
                var embed = new imports.Discord.RichEmbed();
                embed.setFooter('Charisma', imports.client.user.avatarURL);
                embed.setDescription(message.member.displayName + ' has advanced to level ' + (imports.settings.guilds[message.guild.id].members[message.member.id].level) + '!');
                embed.setColor(eval('0x' + imports.settings.guilds[message.guild.id].accentcolor.split('#')[1]));
                message.channel.send(embed);
            }

            imports.settings.guilds[message.guild.id].members[message.member.id].exp += recievedExp;
            //var json = JSON.stringify(imports.settings.guilds, null, 4);
            //imports.fs.writeFileSync('./data/settings/guilds.json', json);
        };*/
    }
}