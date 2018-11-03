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

    get: {
        command: function(command) {
            if (module.exports.configs[command]) {
                return module.exports.configs[command];
            }

            else {
                return null;
            }
        },

        status: function(exports, command, config, blacklist, whitelist) {
            var requiredPermissions = config.permissions;
            var parameters = new Array();
            var userUsable = true;
            var botUsable = true;
            var visible = true;
            var nsfw = false;
            var blacklisted = false;
            var whitelistedCommand = false;
            var isWhitelisted = false;
            var master = true;

            var Discord = require('discord.js');

            for (b in blacklist) { if (blacklisted[b] == command.name) { blacklisted = true } }
            for (w in whitelist) {
                if (w == command.name) {
                    if (whitelist[w].length != 0) { whitelistedCommand = true }
                    for (var m = 0; m < whitelist[w].length; m++) {
                        if (whitelist[w][m] == exports.user.id) {
                            isWhitelisted = true;
                        }
                    }
                }
            }

            for (p in config.permissions) {
                if (Discord.Permissions.FLAGS[config.permissions[p]] != undefined) {
                    if (!exports.member.hasPermission(Discord.Permissions.FLAGS[config.permissions[p]])) {
                        userUsable = false;
                    }

                    if (!exports.guild.me.hasPermission(Discord.Permissions.FLAGS[config.permissions[p]])) {
                        botUsable = false;
                    }
                }

                else if (config.permissions[p] == 'admin') {
                    if (!exports.member.hasPermission(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
                        userUsable = false;
                    }
                }

                else if (config.permissions[p] == 'owner') {
                    if (exports.user.id != exports.guild.ownerID) {
                        userUsable = false;
                    }
                }

                else if (config.permissions[p] == 'master') {
                    if (exports.user.id != masterID) {
                        userUsable = false;
                    }

                    else {
                        master = true;
                    }
                }
            }

            for (a in command.arguments) {
                parameters.push(module.exports.methods[config.params[a].type](command.arguments[a]).value);
            }

            if (config.hidden) {
                if (!master) {
                    visible = false;
                }
            }

            if (config.nsfw) {
                nsfw = true;
            }

            if (blacklisted) {
                if (!master) {
                    userUsable = false;
                }
            }

            if (whitelistedCommand) {
                if (!master) {
                    if (!whitelisted) {
                        userUsable = false;
                    }
                }
            }

            return {
                requiredPermissions: requiredPermissions,
                parameters: parameters,
                userUsable: userUsable,
                botUsable: botUsable,
                visible: visible,
                nsfw: nsfw,
                blacklisted: blacklisted,
                whitelistedCommand: whitelistedCommand,
                isWhitelisted: isWhitelisted
            }
        }
    },

    syntax: {
        get: function(prefix, command) {
            var syntax = '';
            if (module.exports.configs[command]) {
                syntax += prefix + command;
                for (p in module.exports.configs[command].params) {
                    var insert = module.exports.configs[command].params[p].type;
                    if (module.exports.configs[command].params[p].name) { insert = module.exports.configs[command].params[p].name }

                    if (module.exports.configs[command].params[p].required) {
                        syntax += ' <' + insert + '>';
                    }

                    else {
                        syntax += ' [' + insert + ']';
                    }
                }
            }

            if (syntax != '') {
                return syntax;
            }

            else {
                return null;
            }
        },

        check: function(config, arguments) {
            var output = true;
            var requirements = 0;

            for (p in config.params) {
                if (config.params[p].required) {
                    requirements++;
                }
            }

            var error = false;

            if (config.params.length != 0) {
                if (arguments.length == 0 && config.params[0].required == true) {
                    error = true;
                }

                if (arguments.length > config.params.length) {
                    error = true;
                }

                if (requirements > arguments.length) {
                    error = true;
                }

                if (arguments.length <= config.params.length) {
                    for (a in arguments) {
                        if (a == arguments.length - 1) {
                            if ((arguments.length >= requirements) == false) {
                                error = true;
                            }
                        }
                    }
                }
            }

            if (error) {
                output = false;
            }

            return output;
        }
    }
}