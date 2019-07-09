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

function parseDate(milliseconds) {
    var seconds = Math.floor(milliseconds / 1000);
    var minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    var hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    var days = Math.floor(hours / 24);
    hours = hours % 24;
    var weeks = Math.floor(days / 7);
    days = days % 7;
    var months = Math.floor(weeks / 4);
    weeks = weeks % 4;
    var years = Math.floor(months / 12);
    months = months % 12;

    var suffixes = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];
    var values = [years, months, weeks, days, hours, minutes, seconds];
    var suffs = new Array();
    var vals = new Array();

    for (v in values) {
        if (values[v] != 0) {
            suffs.push(suffixes[v]);
            vals.push(values[v]);
        }
    }

    var arr = new Array();
    for (var v = 0; v < values.length; v++) {
        if (values[v] != 0) {
            var suffix = suffixes[v];
            if (values[v] == 1) { suffix = suffix.slice(0, -1) }
            arr.push(`${values[v]} ${suffix}`);
        }
    }

    var toReturn = arr.join(', ');
    return toReturn;
}

module.exports = async function(imports, message) {
    if (message.author.bot) { return }
    var guild = await imports.Data.getGuild(message.guild.id);
    var guildChanged = false;
    if (imports.client.user.id != message.author.id) {
        function iterate(base, obj) {
            for (b in base) {
                if (!obj[b]) {
                    if (Array.isArray(base[b])) {
                        obj[b] = new Array();
                        for (var i = 0; i < base[b].length; i++) {  obj[b].push(base[b][i]) }
                    }

                    else if (typeof base[b] === 'object' && base[b] !== null) {
                        obj[b] = new Object();
                        iterate(base[b], obj[b]);
                    }

                    else { obj[b] = base[b] }
                }
            }
        }

        iterate(imports.defaults.guilds, guild);
        if (!guild.members[message.author.id]) { guild.members[message.author.id] = clone(imports.defaults.member) }
        else { iterate(imports.defaults.member, guild.members[message.author.id]) }

        var user = await imports.Data.getUser(message.author.id);
        iterate(imports.defaults.user, user);
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
            
            var status = await passthrough.Command.status(command, local, passthrough.member, passthrough.channel, passthrough.guild);
            if (status.visible) {
                if (status.userUsable) {
                    if (status.botUsable) {
                        if (passthrough.Command.check(command.name, command.arguments)) {
                            for (var a = 0; a < command.arguments.length; a++) { command.arguments[a] = passthrough.Command.methods[command.object.params[a].type](command.arguments[a]).value }
                            //var now = date.getTime();
                            //else { local.user.cooldowns[command.name] = now }
                            if (local.user.cooldowns[command.name]) {
                                var date = new Date();
                                var now = date.getTime();
                                local.user.cooldowns[command.name] = now;
                            }

                            if (passthrough.Command.commands[command.name].constructor.name === 'AsyncFunction') { await passthrough.Command.commands[command.name](passthrough, command.arguments) }
                            else { passthrough.Command.commands[command.name](passthrough, command.arguments) }
                            //if (passthrough.Command.commands[command.name].constructor.name === 'AsyncFunction') { await passthrough.Command.commands[command.name](passthrough, command.arguments) }
                            //else { passthrough.Command.commands[command.name](passthrough, command.arguments) }
                        }

                        else {
                            embed.setTitle(`invalid syntax`);
                            embed.setDescription(`usage:\n\`${passthrough.Command.syntax(local.guild.config.prefix, command.name)}\``);
                        }
                    }
                }

                else {
                    if (!status.master) {
                        if (status.nsfw && !passthrough.channel.nsfw) { embed.setDescription(`you need to be in an nsfw channel to use that command`) }
                        else if (!status.whitelisted) { embed.setDescription(`you need to be whitelisted to use that command`) }
                        else if (status.blacklisted) { embed.setDescription(`you are blacklisted from using that command`) }
                        else if (status.missingPerm) { embed.setDescription(`you don't have permission to use that command`) }
                        else if (!status.botUsable) { embed.setDescription(`I don't have permission to do that`) }
                        else if (status.cooldown) {
                            var date = new Date();
                            var now = date.getTime();
                            var usedWhen = user.cooldowns[command.name];
                            var difference = command.object.cooldown - (now - usedWhen);
                            //if (difference < config.cooldown) { local.user.cooldowns[command.name] = now; cooldown = true; userUsable = false; }
                            var parsed = parseDate(difference);
                            if (parsed == '') { parsed = '1 second' }
                            embed.setDescription(`you can use that command again in **${parsed}**`);
                        }
                    }

                    else { embed.setDescription(`command not found`) }
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
    }

    await passthrough.Data.replaceGuild(message.guild.id, passthrough.local.guild);
    await passthrough.Data.replaceUser(message.author.id, passthrough.local.user);
}