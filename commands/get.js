module.exports = function(imports, arguments) {
    var keys = {
        bot: {

        },

        guild: {
            id: function(arguments) {
                imports.channel.send('`' + imports.guild.id + '`');
            },

            accentcolor: function(arguments) {
                imports.channel.send('`' + imports.settings.guilds[imports.guild.id].accentcolor + '`');
            },

            flavor: function(arguments) {
                imports.channel.send('`' + imports.settings.guilds[imports.guild.id].flavor + '`');
            },

            expcurve: function(arguments) {
                imports.channel.send('`' + imports.settings.guilds[imports.guild.id].expcurve + '`');
            }
        },

        channel: {
            id: function(arguments) {
                if (arguments[2] != undefined) {

                }

                else {
                    imports.channel.send('`' + imports.channel.id + '`');
                }
            }
        },

        user: {
            id: function(arguments) {
                if (arguments[2] != undefined) {
                    if (imports.Command.methods.mention(arguments[2]).pass) {
                        imports.channel.send('`' + imports.Command.methods.mention(arguments[2]).value + '`');
                    }

                    else {
                        imports.channel.send('`invalid mention`');
                    }
                }

                else {
                    imports.channel.send('`' + imports.user.id + '`');
                }
            },

            avatar: function(arguments) {
                var embed = new imports.Discord.RichEmbed();
                embed.setColor(eval('0x' + imports.settings.guilds[imports.guild.id].accentcolor.split('#')[1]));
                embed.setFooter(imports.client.user.username, imports.client.user.avatarURL);
                var id;
                var run = true;
                if (arguments[1] == undefined) {
                    id = imports.user.id;
                }

                else {
                    if (imports.Command.methods.mention(arguments[1]).pass) {
                        id = imports.Command.methods.mention(arguments[1]).value;
                    }

                    else {
                        imports.channel.send('`invalid mention`');
                        run = false;
                    }
                }

                if (run) {
                    var member = imports.guild.members.find('id', id);
                    embed.setImage(member.user.avatarURL);
                    imports.channel.send(embed);
                }
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