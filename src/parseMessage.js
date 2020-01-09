var Discord = require('discord.js');
var moment = require('moment');
var momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);

var command = require('./core/command.js');

function clone(obj) {
    var copy;
    if (null == obj || "object" != typeof obj) return obj;
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) { copy[i] = clone(obj[i]) }
        return copy;
    }

    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) { if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]) }
        return copy;
    }

    throw new Error(`unable to copy obj! it's type isn't supported`);
}

module.exports = async function(imports, message) {
    if (message.author.bot) { return }
    var guild;
    var user;
    if (!imports.Data) {
        guild = imports.config.defaults.guild;
        user = imports.config.defaults.user;
    }

    else {
        guild = await imports.Data.guild.get(message.guild.id);
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

        iterate(imports.config.defaults.guild, guild);
        if (!guild.members[message.author.id]) { guild.members[message.author.id] = clone(imports.config.defaults.member) }
        else { iterate(imports.config.defaults.member, guild.members[message.author.id]) }
        user = await imports.Data.user.get(message.author.id);
        iterate(imports.config.defaults.user, user);
    }

    var local = {
        guild: guild,
        user: user
    }

    if (imports.Data) { local.member = guild.members[message.author.id] }
    var passthrough = new Object();
    for (var i in imports) { passthrough[i] = imports[i] }


    // appending more information to the "passthrough" object (see shard.js for initial object contruction)
    passthrough.guild = message.guild;
    passthrough.channel = message.channel;
    passthrough.user = message.author;
    passthrough.member = message.member;
    passthrough.message = message;
    passthrough.blacklist = guild.blacklist;
    passthrough.whitelist = guild.whitelist;
    passthrough.local = local;

    if (message.content.startsWith(local.guild.config.prefix.toLowerCase())) {
        var content = message.content;

        var name = content.slice(local.guild.config.prefix.length).split(' ')[0].toLowerCase();
        var full = name + content.slice(local.guild.config.prefix.length + name.length)

        var cmd = {
            object: passthrough.commands.configs[name] ? passthrough.commands.configs[name] : null,
            full: full,
            name: name,
            arguments: []
        }

        var embed = new Discord.RichEmbed();
        embed.setColor(passthrough.local.guild.colors.accent);


        // if command even exists (object is null otherwise)
        if (cmd.object) {

            if (!cmd.object.params) { cmd.object.params = [] }

            // not sure if this is the proper way to handle quote wrapping
            let longArgs = cmd.full.match(/("([^"]|"")*")/g); // stores the long strings for later use

            cmd.full = cmd.full.replace(/("([^"]|"")*")/g, '[s]'); // replaces all the matches with an arbitrary placeholder
            //console.log(`"${cmd.full}"`);

            // stores the current argument data (to be altered later)
            cmd.arguments = cmd.full.slice(local.guild.config.prefix.length + cmd.name + 1).split(' ');
            cmd.arguments.shift();

            // removes any "falsy" items from the array (mainly empty strings)
            cmd.arguments = cmd.arguments.filter(Boolean);

            // replaces all the arbirary placeholders with their respective strings directly within the arguments array
            for (let a = 0; a < cmd.arguments.length; a++) {
                if (cmd.arguments[a] == '[s]') {
                    if (longArgs[0]) {
                        cmd.arguments[a] = longArgs[0].slice(1, -1);
                        longArgs.shift();
                    }
                }
            }

            let status = await command.status(cmd, passthrough);
            if (status.userUsable) {
                if (status.botUsable) {
                    let check = command.check(cmd.name, cmd.arguments, passthrough);
                    if (check != -1) {
                        cmd.arguments = command.evalulateParams(cmd.arguments, passthrough.commands.configs[cmd.name].params[check], passthrough);
                        if (passthrough.commands.functions[cmd.name][check].constructor.name === 'AsyncFunction') { await passthrough.commands.functions[cmd.name][check](passthrough, cmd.arguments) }
                        else { passthrough.commands.functions[cmd.name][check](passthrough, cmd.arguments) }

                        if (cmd.object.cooldown) {

                            if (!passthrough.local.user.cooldowns[cmd.name]) { passthrough.local.user.cooldowns[cmd.name] = -1 }
                            var date = new Date();
                            var now = date.getTime();
                            passthrough.local.user.cooldowns[cmd.name] = now;
                        }
                    }

                    else {
                        if (status.visible) {
                            embed.setTitle(`invalid syntax`);
                            embed.setDescription(`usage:\n\`${command.syntax(local.guild.config.prefix, cmd.name, passthrough).trim()}\``);
                        }

                        else { embed.setDescription(`command not found`) }
                    }
                }
            }

            else {
                // command usage checks
                if (!status.master && status.visible) {
                    if (status.nsfw && !passthrough.channel.nsfw) { embed.setDescription(`you need to be in an nsfw channel to use that command`) }
                    else if (!status.whitelisted) { embed.setDescription(`you need to be whitelisted to use that command`) }
                    else if (status.blacklisted) { embed.setDescription(`you are blacklisted from using that command`) }
                    else if (status.missingPerm) { embed.setDescription(`you don't have permission to use that command`) }
                    else if (!status.botUsable) { embed.setDescription(`I don't have permission to do that`) }
                    else if (status.cooldown) {
                        var date = new Date();
                        var now = date.getTime();
                        var usedWhen = user.cooldowns[cmd.name];
                        var difference = cmd.object.cooldown - (now - usedWhen);
                        var duration = moment.duration(difference);
                        var parsed;
                        if (duration.get('minutes') == 0) { parsed = duration.format('00:ss') }
                        else { parsed = duration.format('mm:ss') }
                        embed.setDescription(`you can use that command again in **${parsed}**`);
                    }
                }

                else { embed.setDescription(`command not found`) }
            }
        }

        else { embed.setDescription(`command not found`) }


        if (embed.description) {
            if (embed.description == 'command not found') { if (local.guild.options.errors.unknownCommands) { message.channel.send(embed) } }
            else { message.channel.send(embed) }
        }
    }

    // database management if a Data module exists
    if (passthrough.Data) {
        await passthrough.Data.guild.replace(message.guild.id, passthrough.local.guild);
        await passthrough.Data.user.replace(message.author.id, passthrough.local.user);
    }
}