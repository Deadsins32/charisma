var fs = require('fs');
var Discord = require('discord.js');

module.exports = function(imports, arguments) {
    var embed = new Discord.RichEmbed();
    embed.setAuthor(imports.client.user.username, imports.client.user.avatarURL);
    embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);

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
                            if (imports.data.guilds[imports.guild.id].colors.accent != arguments[1]) {
                                imports.data.guilds[imports.guild.id].colors.accent = arguments[1];
                            
                                embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
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
                                if (imports.data.guilds[imports.guild.id].colors.logs.joins != arguments[1]) {
                                    imports.data.guilds[imports.guild.id].colors.logs.joins = arguments[1];
                            
                                    embed.setColor(imports.data.guilds[imports.guild.id].colors.logs.joins);
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
                                if (imports.data.guilds[imports.guild.id].colors.logs.leaves != arguments[1]) {
                                    imports.data.guilds[imports.guild.id].colors.logs.leaves = arguments[1];
                            
                                    embed.setColor(imports.data.guilds[imports.guild.id].colors.logs.leaves);
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
                                if (imports.data.guilds[imports.guild.id].colors.logs.nicknamechanges != arguments[1]) {
                                    imports.data.guilds[imports.guild.id].colors.logs.nicknamechanges = arguments[1];
                            
                                    embed.setColor(imports.data.guilds[imports.guild.id].colors.logs.nicknamechanges);
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
                                if (imports.data.guilds[imports.guild.id].colors.logs.usernamechanges != arguments[1]) {
                                    imports.data.guilds[imports.guild.id].colors.logs.usernamechanges = arguments[1];
                            
                                    embed.setColor(imports.data.guilds[imports.guild.id].colors.logs.usernamechanges);
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
                    if (imports.member.permissions.serialize().ADMINISTRATOR) {
                        imports.data.guilds[imports.guild.id].config.description = arguments[1];
                        
                        embed.setDescription('description has been set to "' + arguments[1] + '"');
                        imports.channel.send(embed);
                    }

                    else {
                        embed.setDescription('`["ADMINISTRATOR"]` is required');
                        imports.channel.send(embed);
                    }
                },

                expcurve: function(arguments) {
                    if (imports.member.permissions.serialize().ADMINISTRATOR) {
                        if (imports.Command.methods.number(arguments[1]).pass) {
                            var curve = parseFloat(arguments[1]);
                            imports.data.guilds[imports.guild.id].config.expcurve = curve;
                            
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
                    if (imports.member.permissions.serialize().ADMINISTRATOR) {
                        if (imports.Command.methods.channel(arguments[1]).pass) {
                            var channel = imports.Command.methods.channel(arguments[1]).value;
                            imports.data.guilds[imports.guild.id].config.logchannel = channel;
                            
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
                    if (imports.member.permissions.serialize().ADMINISTRATOR) {
                        if (imports.Command.methods.role(arguments[1]).pass) {
                            var role = imports.Command.methods.role(arguments[1]).value;
                            imports.data.guilds[imports.guild.id].config.autorole = role;
                            
                            embed.setDescription('autorole has been set to `@' + imports.guild.roles.find('id', role).name + '`');
                            imports.channel.send(embed);
                        }

                        else if (imports.guild.roles.find('name', arguments[1])) {
                            var role = imports.guild.roles.find('name', arguments[1]);
                            imports.data.guilds[imports.guild.id].config.autorole = role.id;

                            embed.setDescription('autorole has been set to `@' + role.name + '`');
                            imports.channel.send(embed);
                        }

                        else if (imports.guild.roles.find('id', arguments[1])) {
                            var role = imports.guild.roles.find('id', arguments[1]);
                            imports.data.guilds[imports.guild.id].config.autorole = role.id;

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
                    if (imports.member.permissions.serialize().ADMINISTRATOR) {
                        if (imports.Flavors.get(arguments[1]) != null) {
                            if (imports.data.guilds[imports.guild.id].colors.accent != arguments[1]) {
                                imports.data.guilds[imports.guild.id].config.flavor = arguments[1];

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
                    if (imports.data.users[imports.user.id].color != arguments[1]) {
                        imports.data.users[imports.user.id].color = arguments[1];

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
                imports.data.users[imports.user.id].description = arguments[1];

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