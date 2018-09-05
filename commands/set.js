var fs = require('fs');
var Discord = require('discord.js');

module.exports = function(imports, arguments) {
    var embed = new Discord.RichEmbed();
    embed.setAuthor(imports.client.user.username, imports.client.user.avatarURL);
    embed.setColor(imports.settings.guilds[imports.guild.id].colors.accent);

    var keys = {
        bot: {
            status: function(arguments) {
                if (imports.user.id == imports.config.master) {
                    imports.client.user.setPresence({game: {name: arguments[1], type: 0}});
                    
                    embed.setDescription('set status to `"playing ' + arguments[1] + '"`');
                    imports.channel.send(embed);
                }

                else {
                    embed.setDescription('"' + arguments[0] + '" does not exist');
                    imports.channel.send(embed);
                }
            }
        },

        guild: {
            settings: {
                colors: {
                    accent: function(arguments) {
                        if (imports.Command.methods.color(arguments[1]).pass) {
                            if (imports.settings.guilds[imports.guild.id].colors.accent != arguments[1]) {
                                imports.settings.guilds[imports.guild.id].colors.accent = arguments[1];
                                var json = JSON.stringify(imports.settings.guilds, null, 4);
                                fs.writeFileSync('./data/settings/guilds.json', json);
                            
                                embed.setColor(imports.settings.guilds[imports.guild.id].colors.accent);
                                embed.setDescription('accent has been set to `' + arguments[1] + '`');
                                imports.channel.send(embed);
                            }

                            else {
                                embed.setDescription('accent is already `' + arguments[1] + '`');
                                imports.channel.send(embed);
                            }
                        }

                        else {
                            embed.setDescription('please enter a valid hexadecimal color');
                            imports.channel.send(embed);
                        }
                    },

                    logs: {
                        joins: function(arguments) {
                            if (imports.Command.methods.color(arguments[1]).pass) {
                                if (imports.settings.guilds[imports.guild.id].colors.logs.joins != arguments[1]) {
                                    imports.settings.guilds[imports.guild.id].colors.logs.joins = arguments[1];
                                    var json = JSON.stringify(imports.settings.guilds, null, 4);
                                    fs.writeFileSync('./data/settings/guilds.json', json);
                            
                                    embed.setColor(imports.settings.guilds[imports.guild.id].colors.logs.joins);
                                    embed.setDescription('joins has been set to `' + arguments[1] + '`');
                                    imports.channel.send(embed);
                                }

                                else {
                                    embed.setDescription('joins is already `' + arguments[1] + '`');
                                    imports.channel.send(embed);
                                }
                            }

                            else {
                                embed.setDescription('please enter a valid hexadecimal color');
                                imports.channel.send(embed);
                            }
                        },

                        leaves: function(arguments) {
                            if (imports.Command.methods.color(arguments[1]).pass) {
                                if (imports.settings.guilds[imports.guild.id].colors.logs.leaves != arguments[1]) {
                                    imports.settings.guilds[imports.guild.id].colors.logs.leaves = arguments[1];
                                    var json = JSON.stringify(imports.settings.guilds, null, 4);
                                    fs.writeFileSync('./data/settings/guilds.json', json);
                            
                                    embed.setColor(imports.settings.guilds[imports.guild.id].colors.logs.leaves);
                                    embed.setDescription('leaves has been set to `' + arguments[1] + '`');
                                    imports.channel.send(embed);
                                }

                                else {
                                    embed.setDescription('leaves is already `' + arguments[1] + '`');
                                    imports.channel.send(embed);
                                }
                            }

                            else {
                                embed.setDescription('please enter a valid hexadecimal color');
                                imports.channel.send(embed);
                            }
                        },

                        nicknamechanges: function(arguments) {
                            if (imports.Command.methods.color(arguments[1]).pass) {
                                if (imports.settings.guilds[imports.guild.id].colors.logs.nicknamechanges != arguments[1]) {
                                    imports.settings.guilds[imports.guild.id].colors.logs.nicknamechanges = arguments[1];
                                    var json = JSON.stringify(imports.settings.guilds, null, 4);
                                    fs.writeFileSync('./data/settings/guilds.json', json);
                            
                                    embed.setColor(imports.settings.guilds[imports.guild.id].colors.logs.nicknamechanges);
                                    embed.setDescription('nicknamechanges has been set to `' + arguments[1] + '`');
                                    imports.channel.send(embed);
                                }

                                else {
                                    embed.setDescription('nicknamechanges is already `' + arguments[1] + '`');
                                    imports.channel.send(embed);
                                }
                            }

                            else {
                                embed.setDescription('please enter a valid hexadecimal color');
                                imports.channel.send(embed);
                            }
                        },

                        usernamechanges: function(arguments) {
                            if (imports.Command.methods.color(arguments[1]).pass) {
                                if (imports.settings.guilds[imports.guild.id].colors.logs.usernamechanges != arguments[1]) {
                                    imports.settings.guilds[imports.guild.id].colors.logs.usernamechanges = arguments[1];
                                    var json = JSON.stringify(imports.settings.guilds, null, 4);
                                    fs.writeFileSync('./data/settings/guilds.json', json);
                            
                                    embed.setColor(imports.settings.guilds[imports.guild.id].colors.logs.usernamechanges);
                                    embed.setDescription('usernamechanges has been set to `' + arguments[1] + '`');
                                    imports.channel.send(embed);
                                }

                                else {
                                    embed.setDescription('usernamechanges is already `' + arguments[1] + '`');
                                    imports.channel.send(embed);
                                }
                            }

                            else {
                                embed.setDescription('please enter a valid hexadecimal color');
                                imports.channel.send(embed);
                            }
                        }
                    }
                },

                description: function(arguments) {
                    if (imports.user.permissions.serialize().ADMINISTRATOR) {
                        imports.settings.guilds[imports.guild.id].description = arguments[1];
                        var json = JSON.stringify(imports.settings.guilds, null, 4);
                        fs.writeFileSync('./data/settings/guilds.json', json);
                        
                        embed.setDescription('description has been set to "' + arguments[1] + '"');
                        imports.channel.send(embed);
                    }

                    else {
                        embed.setDescription('`["ADMINISTRATOR"]` is required');
                        imports.channel.send(embed);
                    }
                },

                expcurve: function(arguments) {
                    if (imports.user.permissions.serialize().ADMINISTRATOR) {
                        if (imports.Command.methods.number(arguments[1]).pass) {
                            var curve = parseFloat(arguments[1]);
                            imports.settings.guilds[imports.guild.id].expcurve = curve;
                            var json = JSON.stringify(imports.settings.guilds, null, 4);
                            fs.writeFileSync('./data/settings/guilds.json', json);
                            
                            embed.setDescription('expcurve has been set to `' + arguments[1] + '`');
                            imports.channel.send(embed);
                        }

                        else {
                            embed.setDescription('please specify a valid number');
                            imports.channel.send(embed);
                        }
                    }

                    else {
                        embed.setDescription('`["ADMINISTRATOR"]` is required');
                        imports.channel.send(embed);
                    }
                },

                logchannel: function(arguments) {
                    if (imports.user.permissions.serialize().ADMINISTRATOR) {
                        if (imports.Command.methods.channel(arguments[1]).pass) {
                            var channel = imports.Command.methods.channel(arguments[1]).value;
                            imports.settings.guilds[imports.guild.id].logchannel = channel;
                            var json = JSON.stringify(imports.settings.guilds, null, 4);
                            fs.writeFileSync('./data/settings/guilds.json', json);
                            
                            embed.setDescription('logchannel has been set to ' + arguments[1]);
                            imports.channel.send(embed);
                        }

                        else {
                            embed.setDescription('please specify a channel');
                            imports.channel.send(embed);
                        }
                    }

                    else {
                        embed.setDescription('`["ADMINISTRATOR"]` is required');
                        imports.channel.send(embed);
                    }
                },

                autorole: function(arguments) {
                    if (imports.user.permissions.serialize().ADMINISTRATOR) {
                        if (imports.Command.methods.role(arguments[1]).pass) {
                            var role = imports.Command.methods.role(arguments[1]).value;
                            imports.settings.guilds[imports.guild.id].autorole = role;
                            var json = JSON.stringify(imports.settings.guilds, null, 4);
                            fs.writeFileSync('./data/settings/guilds.json', json);
                            
                            embed.setDescription('autorole has been set to `@' + imports.guild.roles.find('id', role).name + '`');
                            imports.channel.send(embed);
                        }

                        else if (imports.guild.roles.find('name', arguments[1])) {
                            var role = imports.guild.roles.find('name', arguments[1]);
                            imports.settings.guilds[imports.guild.id].autorole = role.id;
                            var json = JSON.stringify(imports.settings.guilds, null, 4);
                            fs.writeFileSync('./data/settings/guilds.json', json);

                            embed.setDescription('autorole has been set to `@' + role.name + '`');
                            imports.channel.send(embed);
                        }

                        else if (imports.guild.roles.find('id', arguments[1])) {
                            var role = imports.guild.roles.find('id', arguments[1]);
                            imports.settings.guilds[imports.guild.id].autorole = role.id;
                            var json = JSON.stringify(imports.settings.guilds, null, 4);
                            fs.writeFileSync('./data/settings/guilds.json', json);

                            embed.setDescription('autorole has been set to `@' + role.name + '`');
                            imports.channel.send(embed);
                        }

                        else {
                            embed.setDescription('please specify a channel');
                            imports.channel.send(embed);
                        }
                    }

                    else {
                        embed.setDescription('`["ADMINISTRATOR"]` is required');
                        imports.channel.send(embed);
                    }
                },

                flavor: function(arguments) {
                    if (imports.user.permissions.serialize().ADMINISTRATOR) {
                        if (imports.Flavors.get(arguments[1]) != null) {
                            if (imports.settings.guilds[imports.guild.id].colors.accent != arguments[1]) {
                                imports.settings.guilds[imports.guild.id].flavor = arguments[1];
                                var json = JSON.stringify(imports.settings.guilds, null, 4);
                                fs.writeFileSync('./data/settings/guilds.json', json);

                                embed.setDescription('flavor has been set to "' + arguments[1] + '"');
                                imports.channel.send(embed);
                            }

                            else {
                                embed.setDescripton('flavor is already "' + arguments[1] + '"');
                                imports.channel.send(embed);
                            }
                        }
                    
                        else {
                            embed.setDescription('"' + arguments[1] + '" is an invalid flavor');
                            imports.channel.send(embed);
                        }
                    }

                    else {
                        embed.setDescription('`["ADMINISTRATOR"]` is required');
                    }
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

                        embed.setColor(arguments[1]);
                        embed.setDescription('profile color has been set to `' + arguments[1] + '`');
                        imports.channel.send(embed);
                    }

                    else {
                        embed.setColor(arguments[1]);
                        embed.setDescription('profile color is already set to `' + arguments[1] + '`');
                        imports.channel.send(embed);
                    }
                }

                else {
                    embed.setDescription('please enter a valid hexadecimal color');
                    imports.channel.send(embed);
                }
            },

            description: function(arguments) {
                imports.settings.users[imports.user.id].description = arguments[1];
                var json = JSON.stringify(imports.settings.users, null, 4);
                fs.writeFileSync('./data/settings/users.json', json);

                embed.setDescription('profile description has been set to "' + arguments[1] + '"');
                imports.channel.send(embed);
            }
        }
    }

    if (eval('keys.' + arguments[0]) != undefined) {
        eval('keys.' + arguments[0])(arguments);
    }

    else {
        embed.setDescription('`' + arguments[0] + '` does not exist');
        imports.channel.send(embed);
    }
}