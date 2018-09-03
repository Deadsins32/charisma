var fs = require('fs');

module.exports = function(imports, arguments) {
    var keys = {
        bot: {
            status: function(arguments) {
                if (imports.user.id == imports.config.master) {
                    imports.client.user.setPresence({game: {name: arguments[1], type: 0}});
                    imports.channel.send('`set status to "playing ' + arguments[1] + '"`');
                }

                else {
                    imports.channel.send('`"' + arguments[0] + '" does not exist`');
                }
            }
        },

        guild: {
            accentcolor: function(arguments) {
                if (imports.Command.methods.color(arguments[1]).pass) {
                    if (imports.settings.guilds[imports.guild.id].accentcolor != arguments[1]) {
                        imports.settings.guilds[imports.guild.id].accentcolor = arguments[1];
                        var json = JSON.stringify(imports.settings.guilds, null, 4);
                        fs.writeFileSync('./data/settings/guilds.json', json);
                        imports.channel.send('`accentcolor has been set to "' + arguments[1] + '"`');
                    }

                    else {
                        imports.channel.send('`accentcolor is already "' + arguments[1] + '"`');
                    }
                }

                else {
                    imports.channel.send('`please enter a valid hexadecimal color`');
                }
            },

            description: function(arguments) {
                if (imports.user.id == imports.guild.ownerID) {
                    imports.settings.guilds[imports.guild.id].description = arguments[1];
                    varjson = JSON.stringify(imports.settings.guilds, null, 4);
                    fs.writeFileSync('./data/settings/guilds.json', json);
                    imports.channel.send('`description has been set to "' + arguments[1] + '"`');
                }

                else {
                    imports.channel.send('`"owner" is required`');
                }
            },

            expcurve: function(arguments) {
                if (imports.user.id == imports.guild.ownerID) {
                    if (imports.Command.methods.number(arguments[1]).pass) {
                        var curve = parseFloat(arguments[1]);
                        imports.settings.guilds[imports.guild.id].expcurve = curve;
                        var json = JSON.stringify(imports.settings.guilds, null, 4);
                        fs.writeFileSync('./data/settings/guilds.json', json);
                        imports.channel.send('`expcurve has been set to ' + arguments[1] + '`');
                    }

                    else {
                        imports.channel.send('`invalid number`');
                    }
                }

                else {
                    imports.channel.send('`"owner" is required`');
                }
            },

            logchannel: function(arguments) {
                if (imports.user.id == imports.guild.ownerID) {
                    if (imports.Command.methods.channel(arguments[1]).pass) {
                        var channel = imports.Command.methods.channel(arguments[1]).value;
                        imports.settings.guilds[imports.guild.id].logchannel = channel;
                        var json = JSON.stringify(imports.settings.guilds, null, 4);
                        fs.writeFileSync('./data/settings/guilds.json', json);
                        imports.channel.send('`logchannel has been set to "' + channel + '"`');
                    }

                    else {
                        imports.channel.send('`invalid channel`');
                    }
                }

                else {
                    imports.channel.send('`"owner" is required`');
                }
            },

            autorole: function(arguments) {
                if (imports.user.id == imports.guild.ownerID) {
                    if (imports.guild.roles[arguments[1]] != undefined) {
                        imports.settings.guilds[imports.guild.id].autorole = arguments[1];
                        var json = JSON.stringify(imports.settings.guilds, null, 4);
                        fs.writeFileSync('./data/settings/guilds.json', json);
                        imports.channel.send('`autorole has been set to "' + arguments[1] + '"`');
                    }

                    else {
                        imports.channel.send('`invalid role`');
                    }
                }

                else {
                    imports.channel.send('`"owner" is required`');
                }
            },

            flavor: function(arguments) {
                if (imports.Flavors.get(arguments[1]) != null) {
                    if (imports.settings.guilds[imports.guild.id].accentcolor != arguments[1]) {
                        imports.settings.guilds[imports.guild.id].flavor = arguments[1];
                        var json = JSON.stringify(imports.settings.guilds, null, 4);
                        fs.writeFileSync('./data/settings/guilds.json', json);
                        imports.channel.send('`flavor has been set to "' + arguments[1] + '"`');
                    }

                    else {
                        imports.channel.send('`flavor is already "' + arguments[1] + '"`');
                    }
                }
                
                else {
                    imports.channel.send('`please enter a valid flavor`');
                }
            }
        },

        profile: {
            color: function(arguments) {
                if (imports.Command.methods.color(arguments[1]).pass) {
                    if (imports.settings.users[imports.user.id].color != arguments[1]) {
                        imports.settings.users[imports.user.id].color = arguments[1];
                        var json = JSON.stringify(imports.settings.users, null, 4);
                        fs.writeFileSync('./data/settings/users.json', json);
                        imports.channel.send('`profile color has been set to "' + arguments[1] + '"`');
                    }

                    else {
                        imports.channel.send('`color is already "' + arguments[1] + '"`');
                    }
                }

                else {
                    imports.channel.send('`please enter a valid hexadecimal color`');
                }
            },

            description: function(arguments) {
                imports.settings.users[imports.user.id].description = arguments[1];
                var json = JSON.stringify(imports.settings.users, null, 4);
                fs.writeFileSync('./data/settings/users.json', json);
                imports.channel.send('`profile description has been set to "' + arguments[1] + '"`');
            }
        }
    }

    if (eval('keys.' + arguments[0]) != undefined) {
        eval('keys.' + arguments[0])(arguments);
    }

    else {
        imports.channel.send('`"' + arguments[0] + '" does not exist`');
    }
}