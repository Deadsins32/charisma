var Discord = require('discord.js');
var config = require('./../config/config.json');
var masterID = config.master;

var permissions = {
    DISCORD: async function(permission, local, guild, member) {
        var toReturn = { userPerms: true, botPerms: true, master: false }
        if (Discord.Permissions.FLAGS[permission]) {
            if (!member.hasPermission(Discord.Permissions.FLAGS[permission])) { toReturn.userPerms = false }
            if (!guild.me.hasPermission(Discord.Permissions.FLAGS[permission])) { toReturn.botPerms = false }
        }

        return toReturn;
    },

    BOT: {
        MASTER: async function(permission, local, guild, member) {
            var toReturn = { userPerms: true, botPerms: true, master: false }
            if (member.user.id != masterID) { toReturn.userPerms = false; toReturn.master = true; }
            return toReturn;
        }
    },

    GUILD: {
        OWNER: async function(permission, local, guild, member) {
            var toReturn = { userPerms: true, botPerms: true, master: false }
            if (member.user.id != guild.ownerID) { toReturn.userPerms = false }
            return toReturn;
        },

        MANAGE: async function(permission, local, guild, member) {
            var toReturn = { userPerms: true, botPerms: true, master: false }
            if (!member.hasPermission(Discord.Permissions.FLAGS.ADMINISTRATOR)) { toReturn.userPerms = false }
            return toReturn;
        }
    },

    PATREON: async function(permission, local, guild, member) {
        var toReturn = { userPerms: true, botPerms: true, master: false }
        var specialGuild;
        var specialRole;
        
        var looped = config.sharded && !guild.client.guilds.get(config.specialGuild.id);

        if (looped) {
            var results = await guild.client.shard.broadcastEval(`this.guilds.get('${config.specialGuild.id}')`);
            for (var r = 0; r < results.length; r++) { if (results[r]) { specialGuild = results[r] } }
        }

        else { specialGuild = guild.client.guilds.get(config.specialGuild.id) }

        if (specialGuild) {
            if (config.specialGuild.roles[permission]) {
                var specialRole;
                if (looped) {
                    var results = await guild.client.shard.broadcastEval(`var guild = this.guilds.get('${config.specialGuild.id}'); if (guild) { guild.roles.get('${config.specialGuild.roles[permission]}') }`);
                    for (var r = 0; r < results.length; r++) { if (results[r]) { specialRole = results[r] } }
                }

                else { specialRole = specialGuild.roles.get(config.specialGuild.roles[permission]) }
                if (specialRole) {
                    var roleMember;
                    if (looped) {
                        var results = await guild.client.shard.broadcastEval(`var guild = this.guilds.get('${config.specialGuild.id}'); if (guild) { var role = guild.roles.get('${config.specialGuild.roles[permission]}'); if (role) { role.members.get('${member.id}') } }`);
                        for (var r = 0; r < results.length; r++) { if (results[r]) { roleMember = results[r] } }
                    }

                    else { roleMember = specialRole.members.get(member.id) }
                    if (!roleMember) { toReturn.userPerms = false }
                }

                else {
                    toReturn.userPerms = false;
                    console.error(`"${permission}" role (${config.specialGuild.roles[permission]}) was not found`);
                }
            }

            else {
                toReturn.userPerms = false;
                console.error(`"${permission}" role was not defined in config`);
            }
        }

        else {
            toReturn.userPerms = false;
            console.error(`special guild (${config.specialGuild.id}) was not found`);
        }

        return toReturn;
    }
}

module.exports = {
    commands: {},
    configs: {},

    methods: {
        any: function(input, local, member, channel, guild) {
            var output = { pass: true, value: input };
            return output;
        },

        mention: function(input, local, member, channel, guild) {
            var output = { pass: true }
            if (input.startsWith('<@')) {
                var input = input.split('<@')[1].substring(0, input.split('<@')[1].length - 1);
                if (input.startsWith('!')) {
                    input = input.substr(1);
                }
            }

            else {
                var members = guild.members.filter(function(member) { return (member.nickname && member.nickname.toLowerCase().includes(input)) || member.user.username.toLowerCase().includes(input) });
                if (members.array().length > 0) {
                    var startsWith = members.filter(function(member) { return (member.nickname && member.nickname.toLowerCase().startsWith(input)) || member.user.username.toLowerCase().startsWith(input) });
                    if (startsWith.array().length > 0) { input = startsWith.first().id }
                    else if (members.array().length > 0) { input = members.first().id }
                }

                else { output.pass = false }
            }

            if (output.pass) { output.value = input }
            else { output.value = null }

            return output;
        },

        channel: function(input, local, member, channel, guild) {
            var output = { pass: true }
            if (input.startsWith('<#')) {
                var input = input.split('<#')[1].substring(0, input.split('<#')[1].length - 1);
                if (input.startsWith('!')) {
                    input = input.substr(1);
                }
            }

            else {
                var channels = guild.channels.filter(function(channel) { return channel.type == 'text' && channel.name.includes(input) });
                var startsWith = channels.filter(function(channel) { return channel.name.startsWith(input) });
                if (startsWith.array().length > 0) { input = startsWith.first().id }
                else if (channels.array().length > 0) { input = channels.first().id }
                output.pass = false;
            }

            if (output.pass) {
                output.value = input;
            }

            else {
                output.value = null;
            }

            return output;
        },

        string: function(input, local, member, channel, guild) {
            var output = { pass: true, value: input };
            return output;
        },

        number: function(input, local, member, channel, guild) {
            var output = { pass: true, value: null }
            if (isNaN(input) || parseInt(input) <= 0) { output.pass = false }
            else { output.value = parseInt(input) }
            return output;
        },

        color: function(input, local, member, channel, guild) {
            var output = { pass: true, value: null };
            var input = input.toLowerCase();

            if (input.startsWith('#')) {
                var input = input.split('#')[1].substring(0, input.split('#')[1].length).toLowerCase();

                if (input.split('').length == 6) {
                    for (c in input.split('')) {
                        if (
                            input.split('')[c] == '0' ||
                            input.split('')[c] == '1' ||
                            input.split('')[c] == '2' ||
                            input.split('')[c] == '3' ||
                            input.split('')[c] == '4' ||
                            input.split('')[c] == '5' ||
                            input.split('')[c] == '6' ||
                            input.split('')[c] == '7' ||
                            input.split('')[c] == '8' ||
                            input.split('')[c] == '9' ||
                            input.split('')[c] == 'a' ||
                            input.split('')[c] == 'b' ||
                            input.split('')[c] == 'c' ||
                            input.split('')[c] == 'e' ||
                            input.split('')[c] == 'f'
                        ) { output.pass = true }

                        else { output.pass = false }
                    }
                }

                else if (input.split('').length == 3) {
                    for (c in input.split('')) {
                        if (
                            input.split('')[c] == '0' ||
                            input.split('')[c] == '1' ||
                            input.split('')[c] == '2' ||
                            input.split('')[c] == '3' ||
                            input.split('')[c] == '4' ||
                            input.split('')[c] == '5' ||
                            input.split('')[c] == '6' ||
                            input.split('')[c] == '7' ||
                            input.split('')[c] == '8' ||
                            input.split('')[c] == '9' ||
                            input.split('')[c] == 'a' ||
                            input.split('')[c] == 'b' ||
                            input.split('')[c] == 'c' ||
                            input.split('')[c] == 'e' ||
                            input.split('')[c] == 'f'
                        ) { output.pass = true }

                        else { output.pass = false }
                    }
                }

                else { output.pass = false }

                if (output.pass && input.split('').length == 3) {
                    var newInput = '';

                    for (cc in input.split('')) {
                        newInput += input.split('')[cc];
                        newInput += input.split('')[cc];
                    }

                    input = newInput;
                }
            }

            else { output.pass = false }
            
            if (output.pass) { output.value = input }
            else { output.value = null }
            return output;
        }
    },

    get: function(command) { if (module.exports.configs[command]) { return module.exports.configs[command] } },

    hasPermission: async function(permission, local, guild, member) {
        var toReturn;

        async function recur(obj, perm) {
            var path = perm.split('.');
            path = path.filter(Boolean);

            if (obj[path[0]]) {
                if (obj[path[0]] instanceof Function) {
                    if (path[1]) { toReturn = await obj[path[0]](path[1], local, guild, member) }
                    else { toReturn = await obj[path[0]](path[0], local, guild, member) }
                }

                else { var shifted = path.shift(); await recur(obj[shifted], path.join('.')) }
            }
        }

        await recur(permissions, permission);

        return toReturn;
    },

    status: async function(command, local, member, channel, guild) {
        var config = module.exports.get(command.name);
        if (config) {
            var required = config.permissions;
            var missingPerm = false;
            var userUsable = true;
            var botUsable = true;
            var visible = true;
            var nsfw = false;
            var blacklisted = false;
            var whitelisted = true;
            var master = false;
            var cooldown = false;
            var parameters = new Array();

            var blacklist = local.guild.blacklist[member.id];
            var whitelist = [];
            if (local.guild.whitelist[command.name]) { whitelist = local.guild.whitelist[command.name] }

            for (b in blacklist) { if (blacklist[b] == command.name) { blacklisted = true } }
            if (whitelist.length != 0) { if (!whitelist.includes(member.id)) { whitelisted = false } }
            for (r in required) {
                var permission = await this.hasPermission(required[r], local, guild, member);
                if (!permission.userPerms) { missingPerm = true }
                if (!permission.botPerms) { botUsable = false }
                if (permission.master) { master = true }

                if (Discord.Permissions.FLAGS[required[r]]) {
                    if (!member.hasPermission(Discord.Permissions.FLAGS[required[r]])) { missingPerm = true }
                    if (!guild.me.hasPermission(Discord.Permissions.FLAGS[required[r]])) { botUsable = false }
                }
            }

            for (a in command.arguments) { parameters.push(this.methods[config.params[a].type](command.arguments[a], local, member, channel, guild).value) }
            if (blacklisted || !whitelisted || missingPerm ) { userUsable = false }

            if (config.cooldown) {
                if (!local.user.cooldowns[command.name]) { local.user.cooldowns[command.name] = -1 }
                var usedWhen = local.user.cooldowns[command.name];
                var date = new Date();
                var now = date.getTime();
                if (usedWhen != -1) {
                    var difference = now - usedWhen;
                    if (difference < config.cooldown) { cooldown = true; userUsable = false; }
                    
                }

                else { local.user.cooldowns[command.name] = now; }
            }

            if (config.hidden) { visible = false }
            if (config.nsfw) { nsfw = true }

            if (nsfw && !channel.nsfw) { userUsable = false }

            return {
                userUsable: userUsable,
                botUsable: botUsable,

                visible: visible,
                nsfw: nsfw,

                missingPerm: missingPerm,

                blacklisted: blacklisted,
                whitelisted: whitelisted,
                cooldown: cooldown,
                master: master,

                parameters: parameters
            }
        }
    },

    check: function(name, parameters, local, member, channel, guild) {
        var config = module.exports.get(name);
        if (config) {
            var requirements = 0;

            for (p in config.params) { if (config.params[p].required) { requirements++ } }

            var error = false;

            if (config.params.length != 0) {
                if (parameters.length == 0 && config.params[0].required == true) { error = true }
                if (parameters.length > config.params.length) { error = true }
                if (requirements > parameters.length) { error = true }
                if (parameters.length <= config.params.length) { for (p in parameters) { if (p == parameters.length - 1) { if (!(parameters.length >= requirements)) { error = true } } } }
            }
            
            if (parameters.length <= config.params.length) { for (p in parameters) { if (!module.exports.methods[config.params[p].type](parameters[p], local, member, channel, guild).pass) { error = true } } }

            else { error = true }

            return !error;
        }
    },

    syntax: function(prefix, command) {
        var config = module.exports.get(command);
        if (config) {
            var syntax = [prefix + command];
            for (p in config.params) {
                var insert = config.params[p].type;
                if (config.params[p].name) { insert = config.params[p].name }
                if (config.params[p].required) { syntax.push(`<${insert}>`) }
                else { syntax.push(`[${insert}]`) }
            }

            return syntax.join(' ');
        }
    }
}