var config = require('./../config/config.json');

module.exports = {
    commands: {},
    configs: {},
    methods: {
        any: function(input) {
            return true;
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
            var output = { pass: true };
            output.value = input;

            return output;
        },

        number: function(input) {
            var output = { pass: true };
            if (isNaN(input)) {
                output = { pass: false };
            }

            return output;
        },

        color: function(input) {
            var output = { pass: true };
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

            if (output.pass) {
                output.value = '0x' + input;
            }

            else {
                output.value = null;
            }

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

        status: function(exports, name, config, blacklist) {
            var requiredPermissions = config.permissions;
            var usable = true;
            var visible = true;
            var nsfw = false;
            var blacklisted = false;
            var master = true;

            var Discord = require('discord.js');

            if (blacklist[exports.guild.id] != undefined) {
                if (blacklist[exports.guild.id][exports.user.id]) {
                    for (i in blacklist[exports.guild.id][exports.user.id]) {
                        if (blacklist[exports.guild.id][exports.user.id][i] == name) {
                            blacklisted = true;
                        }
                    }
                }
            }

            for (p in config.permissions) {
                if (Discord.Permissions.FLAGS[config.permissions[p]] != undefined) {
                    if (!exports.user.hasPermission(Discord.Permissions.FLAGS[config.permissions[p]])) {
                        usable = false;
                    }
                }

                else if (config.permissions[p] == 'admin') {
                    if (!exports.user.hasPermission(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
                        usable = false;
                    }
                }

                else if (config.permissions[p] == 'owner') {
                    if (exports.user.id != exports.guild.ownerID) {
                        usable = false;
                    }
                }

                else if (config.permissions[p] == 'master') {
                    if (exports.user.id != config.master) {
                        usable = false;
                    }

                    else {
                        master = true;
                    }
                }
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
                    usable = false;
                }
            }

            return {
                requiredPermissions: requiredPermissions,
                usable: usable,
                visible: visible,
                nsfw: nsfw,
                blacklisted: blacklisted
            }
        }
    },

    syntax: {
        get: function(prefix, command) {
            var syntax = '';
            if (module.exports.configs[command]) {
                syntax += prefix + command;
                for (p in module.exports.configs[command].params) {
                    if (module.exports.configs[command].params[p].required) {
                        syntax += ' <' + module.exports.configs[command].params[p].type + '>';
                    }

                    else {
                        syntax += ' [' + module.exports.configs[command].params[p].type + ']';
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
                    if (module.exports.methods[config.params[a].type](arguments[a]).pass == false) {
                        error = true;
                    }

                    if (a == arguments.length - 1) {
                        if ((arguments.length >= requirements) == false) {
                            error = true;
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