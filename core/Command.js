var fs = require('fs');

var colors = require('./../data/colors.json');
var config = require('./../config.json');

module.exports = {
    objects: require('./../data/commands.json'),
    commands: require('./../commands.js'),
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

            for (clr in colors) {
                if (colors[clr].name == input) {
                    input = colors[clr].value.toLowerCase();
                }
            }

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
            var output = null;
            for (o in module.exports.objects) {
                if (module.exports.objects[o].name == command) {
                    output = module.exports.objects[o];
                }
            }

            return output;
        },

        status: function(exports, object, blacklist) {
            var requiredPermissions = object.permissions;
            var usable = true;
            var visible = true;
            var nsfw = false;
            var blacklisted = false;
            var master = true;

            var Discord = require('discord.js');

            if (blacklist[exports.guild.id] != undefined) {
                if (blacklist[exports.guild.id][exports.user.id]) {
                    for (i in blacklist[exports.guild.id][exports.user.id]) {
                        if (blacklist[exports.guild.id][exports.user.id][i] == object.name) {
                            blacklisted = true;
                        }
                    }
                }
            }

            for (p in object.permissions) {
                if (Discord.Permissions.FLAGS[object.permissions[p]] != undefined) {
                    if (!exports.user.hasPermission(Discord.Permissions.FLAGS[object.permissions[p]])) {
                        usable = false;
                    }
                }

                else if (object.permissions[p] == 'admin') {
                    if (!exports.user.hasPermission(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
                        usable = false;
                    }
                }

                else if (object.permissions[p] == 'owner') {
                    if (exports.user.id != exports.guild.ownerID) {
                        usable = false;
                    }
                }

                else if (object.permissions[p] == 'master') {
                    if (exports.user.id != config.master) {
                        usable = false;
                    }

                    else {
                        master = true;
                    }
                }
            }

            if (object.hidden) {
                if (!master) {
                    visible = false;
                }
            }

            if (object.nsfw) {
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
            var retrieved = false;
            var output = true;
            for (o in module.exports.objects) {
                if (module.exports.objects[o].name == command) {
                    retrieved = true;
                    syntax += prefix + command;
                    for (p in module.exports.objects[o].params) {
                        if (module.exports.objects[o].params[p].required) {
                            syntax += ' <' + module.exports.objects[o].params[p].type + '>';
                        }

                        else {
                            syntax += ' [' + module.exports.objects[o].params[p].type + ']';
                        }
                    }
                }
            }

            if (retrieved) {
                output = syntax;
            }

            return output;
        },

        check: function(object, arguments) {
            var output = true;
            var requirements = 0;

            for (p in object.params) {
                if (object.params[p].required) {
                    requirements++;
                }
            }

            var error = false;

            if (arguments.length == 0 && object.params[0].required == true) {
                error = true;
            }

            if (arguments.length > object.params.length) {
                error = true;
            }

            if (requirements > arguments.length) {
                error = true;
            }

            if (arguments.length <= object.params.length) {
                for (a in arguments) {
                    if (module.exports.methods[object.params[a].type](arguments[a]).pass == false) {
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