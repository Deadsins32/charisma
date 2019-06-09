var Discord = require('discord.js');

function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

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
    var guild = await imports.Data.getGuild(message.guild.id);
    var guildChanged = false;
    if (imports.client.user.id != message.author.id) {
        for (g in imports.defaults.guilds) { if (!guild[g]) { guild[g] = clone(imports.defaults.guilds[g]); guildChanged = true; } }
        if (!guild.members[message.author.id]) { guild.members[message.author.id] = clone(imports.defaults.member); guildChanged = true; }
        else { for (m in imports.defaults.member) { if (!guild.members[message.author.id][m]) { guild.members[message.author.id][m] = clone(imports.defaults.member[m]); guildChanged = true; } } }
        
        var user = await imports.Data.getUser(message.author.id);
        var userChanged = false;
        for (u in imports.defaults.user) { if (!user[u]) { user[u] = clone(imports.defaults.user[u]); userChanged = true; } }
    }

    var local = {
        guild: guild,
        user: user,
        member: guild.members[message.author.id]
    }

    var passthrough = new Object();
    for (var i in imports) { passthrough[i] = imports[i] }

    passthrough.guild = message.guild;
    passthrough.channel = message.channel;
    passthrough.user = message.author;
    passthrough.member = message.member;
    passthrough.message = message;
    passthrough.blacklist = guild.blacklist;
    passthrough.local = local;

    if (message.content.startsWith(local.guild.config.prefix)) {
        var content;

        if (passthrough.shorthands[message.content.slice(local.guild.config.prefix.length).split(' ')[0]]) {
            content = message.content.replace(message.content.slice(local.guild.config.prefix.length).split(' ')[0], passthrough.shorthands[message.content.slice(local.guild.config.prefix.length).split(' ')[0]]);
        }

        else {
            content = message.content;
        }

        var name = content.slice(local.guild.config.prefix.length).split(' ')[0].toLowerCase();
        var full = name + content.slice(local.guild.config.prefix.length + name.length)
        if (passthrough.aliases[name]) { name = passthrough.aliases[name] }

        var command = {
            object: passthrough.Command.get(name),
            full: full,
            name: name,
            arguments: new Array()
        }

        var longArguments1 = command.full.match(/("([^"]|"")*")/g);
        command.full = command.full.replace(/("([^"]|"")*")/g, '[s]');

        var embed = new Discord.RichEmbed();
        embed.setColor(passthrough.local.guild.colors.accent);

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
            
            var status = passthrough.Command.status(command, local, passthrough.member, passthrough.channel, passthrough.guild);
            if (status.visible) {
                if (status.userUsable) {
                    if (status.botUsable) {
                        if (passthrough.Command.check(command.name, command.arguments)) {
                            for (var a = 0; a < command.arguments.length; a++) { command.arguments[a] = passthrough.Command.methods[command.object.params[a].type](command.arguments[a]).value }
                            if (passthrough.Command.commands[command.name].constructor.name === 'AsyncFunction') { await passthrough.Command.commands[command.name](passthrough, command.arguments) }
                            else { passthrough.Command.commands[command.name](passthrough, command.arguments) }
                        }

                        else {
                            embed.setTitle(`invalid syntax`);
                            embed.setDescription(`usage:\n\`${passthrough.Command.syntax(local.guild.config.prefix, command.name)}\``);
                        }
                    }
                }

                else {
                    if (status.nsfw && !passthrough.channel.nsfw) { embed.setDescription(`you need to be in an nsfw channel to use that command`) }
                    else if (!status.whitelisted) { embed.setDescription(`you need to be whitelisted to use that command`) }
                    else if (status.blacklisted) { embed.setDescription(`you are blacklisted from using that command`) }
                    else if (status.missingPerm) { embed.setDescription(`you don't have permission to use that command`) }
                    else if (!status.botUsable) { embed.setDescription(`I don't have permission to do that`) }
                }
            }

            else {
                if (status.userUsable && status.botUsable) {
                    if (passthrough.Command.check(command.name, command.arguments)) {
                        for (var a = 0; a < command.arguments.length; a++) { command.arguments[a] = passthrough.Command.methods[command.object.params[a].type](command.arguments[a]).value }
                        if (passthrough.Command.commands[command.name].constructor.name === 'AsyncFunction') { await passthrough.Command.commands[command.name](passthrough, command.arguments) }
                        else { passthrough.Command.commands[command.name](passthrough, command.arguments) }
                    }

                    else {
                        embed.setTitle(`invalid syntax`);
                        embed.setDescription(`usage:\n\`${passthrough.Command.syntax(local.guild.config.prefix, command.name)}\``);
                    }
                }

                else { embed.setDescription(`command not found`) }
            }
        }

        else { embed.setDescription(`command not found`) }

        if (embed.description) { message.channel.send(embed) }
    }

    else {
        var experience = randBetween(90, 120);
        var length = message.content.length;
        var letterExp = Math.floor(percentageOf(length, 50));
        experience += letterExp;

        passthrough.Experience.add(passthrough, message.member, experience);
        guildChanged = true;
    }

    passthrough.Data.replaceGuild(message.guild.id, local.guild);
    passthrough.Data.replaceUser(message.author.id, local.user);
}