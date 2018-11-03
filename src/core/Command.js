var Discord = require('discord.js');
var masterID = require('./../config/config.json').master;

module.exports = {
    commands: {},
    configs: {},
    methods: {
        any: function(input) {
            var output = { pass: true, value: input }
        },

        mention: function(input) {
            var output = { pass: true };
            if (input.startsWith('<@')) {
                var input = input.split('<@')[1].substring(0, input.split('<@')[1].length - 1);
                if (input.startsWith('!')) {
                    input = input.substr(1);
                }
            }

            else {
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

        channel: function(input) {
            var output = { pass: true };
            if (input.startsWith('<#')) {
                var input = input.split('<#')[1].substring(0, input.split('<#')[1].length - 1);
                if (input.startsWith('!')) {
                    input = input.substr(1);
                }
            }

            else {
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

        string: function(input) {
            var output = { pass: true, value: input };
            return output;
        },

        number: function(input) {
            var output = { pass: true, value: null }
            if (isNaN(input)) { output.pass = false }
            else { output.value = parseInt(input) }
            return output;
        },

        color: function(input) {
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

    status: function(command, local, member, channel, guild) {
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
            var parameters = new Array();

            var master = false;

            var blacklist = local.blacklist[local.member.id];
            var whitelist = [];
            if (local.whitelist[command.name]) { whitelist = local.whitelist[command.name] }

            for (b in blacklist) { if (blacklist[b] == command.name) { blacklisted = true } }
            if (whitelist.length != 0) { if (!whitelist.includes(local.member.id)) { whitelisted = false } }

            for (r in required) {
                if (Discord.Permissions.FLAGS[required[r]]) {
                    if (!member.hasPermission(Discord.Permissions.FLAGS[required[r]])) { missingPerm = true }
                    if (!guild.me.hasPermission(Discord.Permissions.FLAGS[required[r]])) { botUsable = false }
                }

                else if (required[r] == 'admin') { if (!member.hasPermission(Discord.Permissions.FLAGS.ADMINISTRATOR)) { missingPerm = true } }
                else if (required[r] == 'owner') { if (member.user.id != guild.ownerID) { missingPerm = true } }
                else if (required[r] == 'master') { if (member.user.id != masterID) { missingPerm = true } else { master = true } }
            }

            for (a in command.arguments) { parameters.push(module.exports.methods[config.params[a].type](command.arguments[a]).value) }

            if (blacklisted || !whitelisted || missingPerm ) { userUsable = false }

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

                parameters: parameters,
                master: master
            }
        }
    },

    check: function(name, parameters) {
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

            for (p in parameters) { if (!module.exports.methods[config.params[p].type](parameters[p]).pass) { error = true } }

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