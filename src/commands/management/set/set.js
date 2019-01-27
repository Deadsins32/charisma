var fs = require('fs');
var Discord = require('discord.js');

module.exports = function(imports, parameters) {
    var embed = new Discord.RichEmbed();
    embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);

    var keys = {
        charisma: {
            status: function(parameters) {
                if (imports.user.id == imports.config.master) {
                    imports.client.user.setPresence({game: {name: parameters[1], type: 0}});
                    embed.setDescription(`set status to "playing ${parameters[1]}"`);
                }
            }
        },

        guild: {
            config: {
                colors: {
                    accent: function(parameters) {
                        if (imports.Command.methods.color(parameters[1]).pass) {
                            imports.data.guilds[imports.guild.id].colors.accent = parameters[1];
                            embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
                            embed.setDescription(`the accent color has been set to "${parameters[1]}"`);
                        }

                        else { embed.setDescription(`please enter a valid hexadecimal color`) }
                    },

                    logs: {
                        joins: function(parameters) {
                            if (imports.Command.methods.color(parameters[1]).pass) {
                                imports.data.guilds[imports.guild.id].colors.logs.joins = parameters[1];
                                embed.setColor(imports.data.guilds[imports.guild.id].colors.logs.joins);
                                embed.setDescription(`the joins color has been set to "${parameters[1]}"`);
                            }

                            else { embed.setDescription(`please enter a valid hexadecimal color`) }
                        },

                        leaves: function(parameters) {
                            if (imports.Command.methods.color(parameters[1]).pass) {
                                imports.data.guilds[imports.guild.id].colors.logs.leaves = parameters[1];
                                embed.setColor(imports.data.guilds[imports.guild.id].colors.logs.leaves);
                                embed.setDescription(`the leaves color has been set to "${parameters[1]}"`);
                            }

                            else { embed.setDescription(`please enter a valid hexadecimal color`) }
                        },

                        nicknamechanges: function(parameters) {
                            if (imports.Command.methods.color(parameters[1]).pass) {
                                imports.data.guilds[imports.guild.id].colors.logs.nicknamechanges = parameters[1];
                                embed.setColor(imports.data.guilds[imports.guild.id].colors.logs.nicknamechanges);
                                embed.setDescription(`the nickname changes color has been set to "${parameters[1]}"`);
                            }

                            else { embed.setDescription(`please enter a valid hexadecimal color`) }
                        },

                        usernamechanges: function(parameters) {
                            if (imports.Command.methods.color(parameters[1]).pass) {
                                    imports.data.guilds[imports.guild.id].colors.logs.usernamechanges = parameters[1];
                                    embed.setColor(imports.data.guilds[imports.guild.id].colors.logs.usernamechanges);
                                    embed.setDescription(`the usernamechanges color has been set to "${parameters[1]}"`);
                            }

                            else { embed.setDescription(`please enter a valid hexadecimal color`) }
                        }
                    }
                },

                prefix: function(parameters) {
                    if (imports.member.permissions.serialize().ADMINISTRATOR) {
                        imports.data.guilds[imports.guild.id].config.prefix = parameters[1];
                        embed.setDescription(`the prefix has been set to "${parameters[1]}"`);
                    }

                    else { embed.setDescription(`you don't have permission to do that`) }
                },

                description: function(parameters) {
                    if (imports.member.permissions.serialize().ADMINISTRATOR) {
                        imports.data.guilds[imports.guild.id].config.description = parameters[1];
                        embed.setDescription(`the description has been set to "${parameters[1]}"`);
                    }

                    else { embed.setDescription(`you don't have permission to do that`) }
                },

                expcurve: function(parameters) {
                    if (imports.member.permissions.serialize().ADMINISTRATOR) {
                        if (imports.Command.methods.number(parameters[1]).pass) {
                            var curve = parseFloat(parameters[1]);
                            imports.data.guilds[imports.guild.id].config.expcurve = curve;
                            embed.setDescription(`the expcurve has been set to ${parameters[1]}`);
                        }

                        else { embed.setDescription(`please specify a valid number`) }
                    }

                    else { embed.setDescription(`you don't have permission to do that`) }
                },

                logchannel: function(parameters) {
                    if (imports.member.permissions.serialize().ADMINISTRATOR) {
                        if (imports.Command.methods.channel(parameters[1]).pass) {
                            var channel = imports.Command.methods.channel(parameters[1]).value;
                            imports.data.guilds[imports.guild.id].config.logchannel = channel;
                            embed.setDescription(`the logchannel has been set to "${imports.guild.channels.get(channel).name}"`);
                        }

                        else { embed.setDescription(`please specify a channel`) }
                    }

                    else { embed.setDescription(`you don't have permission to do that`) }
                },

                autorole: function(parameters) {
                    if (imports.member.permissions.serialize().ADMINISTRATOR) {
                        if (imports.Command.methods.role(parameters[1]).pass) {
                            var role = imports.Command.methods.role(parameters[1]).value;
                            imports.data.guilds[imports.guild.id].config.autorole = role;
                            embed.setDescription(`the autorole has been set to @${imports.guild.roles.get(role).name}`);
                        }

                        else if (imports.guild.roles.find('name', parameters[1])) {
                            var role = imports.guild.roles.find('name', parameters[1]);
                            imports.data.guilds[imports.guild.id].config.autorole = role.id;
                            embed.setDescription(`the autorole has been set to @${role.name}`);
                        }

                        else if (imports.guild.roles.get(parameters[1])) {
                            var role = imports.guild.roles.get(parameters[1]);
                            imports.data.guilds[imports.guild.id].config.autorole = role.id;
                            embed.setDescription(`the autorole has been set to @${role.name}`);
                        }

                        else { embed.setDescription(`please specify a channel`) }
                    }

                    else { embed.setDescription(`you don't have permission to do that`) }
                },

                flavor: function(parameters) {
                    if (imports.member.permissions.serialize().ADMINISTRATOR) {
                        if (imports.Flavors.get(parameters[1]) != null) {
                            imports.data.guilds[imports.guild.id].config.flavor = parameters[1];
                            embed.setDescription(`the flavor has been set to "${parameters[1]}"`);
                        }
                    
                        else { embed.setDescription(`the flavor "${parameters[1]}" does not exist`) }
                    }

                    else { embed.setDescription(`you don't have permission to do that`) }
                }
            }
        },

        profile: {
            color: function(parameters) {
                if (imports.Command.methods.color(parameters[1]).pass) {
                    imports.data.users[imports.user.id].color = parameters[1];
                    embed.setColor(parameters[1]);
                    embed.setDescription(`the profile color has been set to ${parameters[1]}`);
                }

                else { embed.setDescription(`please enter a valid hexadecimal color`) }
            },

            description: function(parameters) {
                imports.data.users[imports.user.id].description = parameters[1];
                embed.setDescription(`the profile description has been set to "${parameters[1]}"`);
            }
        }
    }

    try { eval(`keys.${parameters[0]}`)(parameters) }
    catch(error) { embed.setDescription(`\`${parameters[0]}\` does not exist`) }

    imports.channel.send(embed);
}