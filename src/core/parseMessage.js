var Discord = require('discord.js');

module.exports = function(imports, message) {
    if (message.author.bot) { return }
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
        guild: {
            id: message.guild.id,
            data: imports.data.guilds[message.guild.id]
        },

        member: {
            id: message.author.id,
            data: imports.data.guilds[message.guild.id].members[message.author.id]
        },

        user: {
            id: message.author.id,
            data: imports.data.users[message.author.id]
        },

        blacklist: imports.data.guilds[message.guild.id].blacklist,
        whitelist: imports.data.guilds[message.guild.id].whitelist
    }

    if (message.content.startsWith(local.guild.data.config.prefix)) {
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
            music: imports.music,

            youtube: imports.youtube,
            ytdl: imports.ytdl,

            config: imports.config,
            aliases: imports.aliases,
            shorthands: imports.shorthands
        }

        var content;

        if (imports.shorthands[message.content.slice(local.guild.data.config.prefix.length).split(' ')[0]]) {
            content = message.content.replace(message.content.slice(local.guild.data.config.prefix.length).split(' ')[0], imports.shorthands[message.content.slice(local.guild.data.config.prefix.length).split(' ')[0]]);
        }

        else {
            content = message.content;
        }

        var name = content.slice(local.guild.data.config.prefix.length).split(' ')[0];
        if (imports.aliases[name]) { name = imports.aliases[name] }

        var command = {
            object: imports.Command.get(name),
            full: content.slice(local.guild.data.config.prefix.length),
            name: name,
            arguments: new Array()
        }

        var longArguments1 = command.full.match(/("([^"]|"")*")/g);
        command.full = command.full.replace(/("([^"]|"")*")/g, '[s]');

        var embed = new Discord.RichEmbed();
        embed.setColor(exports.local.guild.data.colors.accent);

        if (command.object) {
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

            command.arguments = command.full.slice(local.guild.data.config.prefix.length + command.name + 1).split(' ');

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
            
            if (imports.Command.check(command.name, command.arguments)) {
                var status = imports.Command.status(command, local, message.member, message.channel, message.guild);
                if (status) {
                    for (p in status.parameters) { command.arguments[p] = status.parameters[p] }
                    if (status.master) {
                        if ((status.nsfw && message.channel.nsfw) || !status.nsfw) { imports.Command.commands[command.name](exports, command.arguments) }
                        else { embed.setDescription(`you need to be in an nsfw channel to use that command`) }
                    }

                    else {
                        if (status.userUsable && status.botUsable) { imports.Command.commands[command.name](exports, command.arguments) }

                        else {
                            if (status.visible) {
                                if (!status.userUsable) {
                                    if (status.blacklisted) { embed.setDescription(`you are blacklisted from using that command`) }
                                    else if (!status.whitelisted) { embed.setDescription(`you need to be whitelisted to use that command`) }
                                    else if (status.missingPerm) { embed.setDescription(`you don't have permission to use that command`) }
                                    else if (status.nsfw) { embed.setDescription(`you need to be in an nsfw channel to use that command`) }
                                }

                                else { if (!status.botUsable) { embed.setDescription(`I don't have permission to do that`) } }
                            }

                            else { embed.setDescription(`command not found`) }
                        }
                    }

                    if (embed.description) { message.channel.send(embed) }
                }
            }

            else {
                embed.setTitle(`invalid syntax`);
                embed.setDescription(`usage:\n\`${imports.Command.syntax(local.guild.data.config.prefix, command.name)}\``);
                message.channel.send(embed);
            }
        }

        else {
            embed.setDescription(`command not found`);
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