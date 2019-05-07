var Discord = require('discord.js');

function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

function randBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function percentageOf(num, percentage) {
    return (percentage / 100) * num;
}

module.exports = async function(imports, message) {
    if (message.author.bot) { return }
    if (imports.client.user.id != message.author.id) {
        if (!imports.data.guilds[message.guild.id]) { imports.data.guilds[message.guild.id] = clone(imports.data.defaults.guild) }
        else {
            for (g in imports.data.defaults.guilds) {
                if (!imports.data.guilds[message.guild.id][g]) { imports.data.guilds[message.guild.id][g] = clone(imports.data.defaults.guilds[g]) }
            }
        }

        if (!imports.data.guilds[message.guild.id].members[message.author.id]) {
            imports.data.guilds[message.guild.id].members[message.author.id] = clone(imports.data.defaults.member);
        }

        else {
            for (m in imports.data.defaults.member) {
                if (!imports.data.guilds[message.guild.id].members[message.author.id][m]) {
                    imports.data.guilds[message.guild.id].members[message.author.id][m] = clone(imports.data.defaults.member[m]);
                }
            }
        }

        if (!imports.data.users[message.author.id]) { imports.data.users[message.author.id] = clone(imports.data.defaults.user) }

        else {
            for (u in imports.data.defaults.user) {
                if (!imports.data.users[message.author.id][u]) { imports.data.users[message.author.id][u] = clone(imports.data.defaults.user[u]) }
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

    imports.guild = message.guild;
    imports.channel = message.channel;
    imports.user = message.author;
    imports.member = message.member;
    imports.message = message;
    imports.blacklist = imports.data.guilds[message.guild.id].blacklist;
    imports.local = local;

    if (message.content.startsWith(local.guild.data.config.prefix)) {
        var content;

        if (imports.shorthands[message.content.slice(local.guild.data.config.prefix.length).split(' ')[0]]) {
            content = message.content.replace(message.content.slice(local.guild.data.config.prefix.length).split(' ')[0], imports.shorthands[message.content.slice(local.guild.data.config.prefix.length).split(' ')[0]]);
        }

        else {
            content = message.content;
        }

        var name = content.slice(local.guild.data.config.prefix.length).split(' ')[0].toLowerCase();
        var full = name + content.slice(local.guild.data.config.prefix.length + name.length)
        if (imports.aliases[name]) { name = imports.aliases[name] }

        var command = {
            object: imports.Command.get(name),
            full: full,
            name: name,
            arguments: new Array()
        }

        var longArguments1 = command.full.match(/("([^"]|"")*")/g);
        command.full = command.full.replace(/("([^"]|"")*")/g, '[s]');

        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.data.colors.accent);

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
                        if ((status.nsfw && message.channel.nsfw) || !status.nsfw) {
                            if (imports.Command.commands[command.name].constructor.name === 'AsyncFunction') { await imports.Command.commands[command.name](imports, command.arguments) }
                            else { imports.Command.commands[command.name](imports, command.arguments) }
                        }
                        else { embed.setDescription(`you need to be in an nsfw channel to use that command`) }
                    }

                    else {
                        if (status.userUsable && status.botUsable) { imports.Command.commands[command.name](imports, command.arguments) }

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
        var experience = randBetween(90, 120);
        var length = message.content.length;
        var letterExp = Math.floor(percentageOf(length, 50));
        experience += letterExp;

        imports.Experience.add(imports, message.member, experience);
    }
}