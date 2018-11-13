var fs = require('fs');
var Discord = require('discord.js');

module.exports = function(imports, parameters) {
    var embed = new Discord.RichEmbed();
    embed.setAuthor(imports.client.user.username, imports.client.user.avatarURL);
    embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);

    var keys = {
        bot: {
            activity: function(parameters) {
                if (imports.user.id == imports.config.master) {
                    imports.client.user.setPresence({game: {name: parameters[1], type: 0}});
                    
                    embed.setDescription('set activity to `"playing ' + parameters[1] + '"`');
                    imports.channel.send(embed);
                }

                else {
                    embed.setDescription('"' + parameters[0] + '" does not exist');
                    imports.channel.send(embed);
                }
            }
        },

        guild: {
            colors: {
                accent: function(parameters) {
                    if (imports.Command.methods.color(parameters[1]).pass) {
                        if (imports.data.guilds[imports.guild.id].colors.accent != parameters[1]) {
                            imports.data.guilds[imports.guild.id].colors.accent = parameters[1];
                        
                            embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
                            embed.setDescription('accent has been set to `' + parameters[1] + '`');
                            imports.channel.send(embed);
                        }

                        else {
                            embed.setDescription('accent is already `' + parameters[1] + '`');
                            imports.channel.send(embed);
                        }
                    }

                    else {
                        embed.setDescription('please enter a valid hexadecimal color');
                        imports.channel.send(embed);
                    }
                },

                logs: {
                    joins: function(parameters) {
                        if (imports.Command.methods.color(parameters[1]).pass) {
                            if (imports.data.guilds[imports.guild.id].colors.logs.joins != parameters[1]) {
                                imports.data.guilds[imports.guild.id].colors.logs.joins = parameters[1];
                            
                                embed.setColor(imports.data.guilds[imports.guild.id].colors.logs.joins);
                                embed.setDescription('joins has been set to `' + parameters[1] + '`');
                                imports.channel.send(embed);
                            }

                            else {
                                embed.setDescription('joins is already `' + parameters[1] + '`');
                                imports.channel.send(embed);
                            }
                        }

                        else {
                            embed.setDescription('please enter a valid hexadecimal color');
                            imports.channel.send(embed);
                        }
                    },

                    leaves: function(parameters) {
                        if (imports.Command.methods.color(parameters[1]).pass) {
                            if (imports.data.guilds[imports.guild.id].colors.logs.leaves != parameters[1]) {
                                imports.data.guilds[imports.guild.id].colors.logs.leaves = parameters[1];
                        
                                embed.setColor(imports.data.guilds[imports.guild.id].colors.logs.leaves);
                                embed.setDescription('leaves has been set to `' + parameters[1] + '`');
                                imports.channel.send(embed);
                            }

                            else {
                                embed.setDescription('leaves is already `' + parameters[1] + '`');
                                imports.channel.send(embed);
                            }
                        }

                        else {
                            embed.setDescription('please enter a valid hexadecimal color');
                            imports.channel.send(embed);
                        }
                    },

                    nicknamechanges: function(parameters) {
                        if (imports.Command.methods.color(parameters[1]).pass) {
                            if (imports.data.guilds[imports.guild.id].colors.logs.nicknamechanges != parameters[1]) {
                                imports.data.guilds[imports.guild.id].colors.logs.nicknamechanges = parameters[1];
                        
                                embed.setColor(imports.data.guilds[imports.guild.id].colors.logs.nicknamechanges);
                                embed.setDescription('nicknamechanges has been set to `' + parameters[1] + '`');
                                imports.channel.send(embed);
                            }

                            else {
                                embed.setDescription('nicknamechanges is already `' + parameters[1] + '`');
                                imports.channel.send(embed);
                            }
                        }

                        else {
                            embed.setDescription('please enter a valid hexadecimal color');
                            imports.channel.send(embed);
                        }
                    },

                    usernamechanges: function(parameters) {
                        if (imports.Command.methods.color(parameters[1]).pass) {
                            if (imports.data.guilds[imports.guild.id].colors.logs.usernamechanges != parameters[1]) {
                                imports.data.guilds[imports.guild.id].colors.logs.usernamechanges = parameters[1];
                        
                                embed.setColor(imports.data.guilds[imports.guild.id].colors.logs.usernamechanges);
                                embed.setDescription('usernamechanges has been set to `' + parameters[1] + '`');
                                imports.channel.send(embed);
                            }

                            else {
                                embed.setDescription('usernamechanges is already `' + parameters[1] + '`');
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

            config: {
                description: function(parameters) {
                    if (imports.member.permissions.serialize().ADMINISTRATOR) {
                        imports.data.guilds[imports.guild.id].config.description = parameters[1];
                        
                        embed.setDescription('description has been set to "' + parameters[1] + '"');
                        imports.channel.send(embed);
                    }

                    else {
                        embed.setDescription('`["ADMINISTRATOR"]` is required');
                        imports.channel.send(embed);
                    }
                },

                expcurve: function(parameters) {
                    if (imports.member.permissions.serialize().ADMINISTRATOR) {
                        if (imports.Command.methods.number(parameters[1]).pass) {
                            var curve = parseFloat(parameters[1]);
                            imports.data.guilds[imports.guild.id].config.expcurve = curve;
                            
                            embed.setDescription('expcurve has been set to `' + parameters[1] + '`');
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

                logchannel: function(parameters) {
                    if (imports.member.permissions.serialize().ADMINISTRATOR) {
                        if (imports.Command.methods.channel(parameters[1]).pass) {
                            var channel = imports.Command.methods.channel(parameters[1]).value;
                            imports.data.guilds[imports.guild.id].config.logchannel = channel;
                            
                            embed.setDescription('logchannel has been set to ' + parameters[1]);
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

                autorole: function(parameters) {
                    if (imports.member.permissions.serialize().ADMINISTRATOR) {
                        if (imports.Command.methods.role(parameters[1]).pass) {
                            var role = imports.Command.methods.role(parameters[1]).value;
                            imports.data.guilds[imports.guild.id].config.autorole = role;
                            
                            embed.setDescription('autorole has been set to `@' + imports.guild.roles.find('id', role).name + '`');
                            imports.channel.send(embed);
                        }

                        else if (imports.guild.roles.find('name', parameters[1])) {
                            var role = imports.guild.roles.find('name', parameters[1]);
                            imports.data.guilds[imports.guild.id].config.autorole = role.id;

                            embed.setDescription('autorole has been set to `@' + role.name + '`');
                            imports.channel.send(embed);
                        }

                        else if (imports.guild.roles.get(parameters[1])) {
                            var role = imports.guild.roles.get(parameters[1]);
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
                }
            },

            flavor: function(parameters) {
                if (imports.member.permissions.serialize().ADMINISTRATOR) {
                    if (imports.Flavors.get(parameters[1]) != null) {
                        if (imports.data.guilds[imports.guild.id].colors.accent != parameters[1]) {
                            imports.data.guilds[imports.guild.id].config.flavor = parameters[1];

                            embed.setDescription('flavor has been set to "' + parameters[1] + '"');
                            imports.channel.send(embed);
                        }

                        else {
                            embed.setDescripton('flavor is already "' + parameters[1] + '"');
                            imports.channel.send(embed);
                        }
                    }
                
                    else {
                        embed.setDescription('"' + parameters[1] + '" is an invalid flavor');
                        imports.channel.send(embed);
                    }
                }

                else {
                    embed.setDescription('`["ADMINISTRATOR"]` is required');
                }
            }
        },

        profile: {
            color: function(parameters) {
                if (imports.Command.methods.color(parameters[1]).pass) {
                    if (imports.data.users[imports.user.id].color != parameters[1]) {
                        imports.data.users[imports.user.id].color = parameters[1];

                        embed.setColor(parameters[1]);
                        embed.setDescription('profile color has been set to `' + parameters[1] + '`');
                        imports.channel.send(embed);
                    }

                    else {
                        embed.setColor(parameters[1]);
                        embed.setDescription('profile color is already set to `' + parameters[1] + '`');
                        imports.channel.send(embed);
                    }
                }

                else {
                    embed.setDescription('please enter a valid hexadecimal color');
                    imports.channel.send(embed);
                }
            },

            description: function(parameters) {
                imports.data.users[imports.user.id].description = parameters[1];

                embed.setDescription('profile description has been set to "' + parameters[1] + '"');
                imports.channel.send(embed);
            }
        }
    }

    if (eval('keys.' + parameters[0]) != undefined) { eval('keys.' + parameters[0])(parameters) }

    else {
        embed.setDescription('`' + parameters[0] + '` does not exist');
        imports.channel.send(embed);
    }
}