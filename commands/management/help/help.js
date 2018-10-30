var Discord = require('discord.js');

module.exports = function(imports, arguments) {
    var embed = new Discord.RichEmbed();
    
    embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);

    function parse(name, command) {
        var status = imports.Command.get.status(imports, name, command, imports.blacklist);
        if (status.userUsable && status.visible && !status.blacklisted) {
            if (status.nsfw) {
                if (imports.channel.nsfw) {
                    return true;
                }

                else {
                    return false;
                }
            }

            else {
                return true;
            }
        }

        else {
            return false
        }
    }

    var page = 0;
    var tag = false;
    var name = false;

    var configs = imports.Command.configs;
    var list = new Object();

    if (arguments[0]) {
        if (!isNaN(arguments[0])) {
            page = parseInt(arguments[0]) - 1;
            for (c in configs) {
                if (parse(c, configs[c])) {
                    list[c] = configs[c];
                }
            }
        }

        else {
            if (arguments[0] == 'help') {
                return imports.channel.send(':unamused:');
            }

            else {
                if (configs[arguments[0]]) { name = true }
                else {
                    for (c in configs) {
                        for (t in configs[c].tags) {
                            if (arguments[0] == configs[c].tags[t]) {
                                tag = true;
                            }
                        }
                    }
                }

                if (tag) {
                    for (c in configs) {
                        var finished = false;
                        if (!finished) {
                            for (t in configs[c].tags) {
                                if (arguments[0] == configs[c].tags[t]) {
                                    if (parse(c, configs[c])) {
                                        list[c] = configs[c];
                                    }

                                    finished = true;
                                }
                            }
                        }
                    }
                }

                if (name) {
                    var config = configs[arguments[0]];

                    embed.addField('description', config.description, true);
                    embed.addField('usage', '`' + imports.Command.syntax.get(imports.data.guilds[imports.guild.id].config.prefix, arguments[0]) + '`', true);

                    if (config.tags) {
                        embed.addField('tags', '`' + JSON.stringify(config.tags) + '`', true);
                    }

                    embed.addField('nsfw', config.nsfw, true);
                    return imports.channel.send(embed);
                }
            }
        }
    }

    else {
        for (c in configs) {
            if (parse(c, configs[c])) {
                list[c] = configs[c];
            }
        }
    }

    var array = new Array();
    for (l in list) {
        array.push([l, list[l]]);
    }
    
    if (tag) {
        if (!isNaN(arguments[1])) {
            page = parseInt(arguments[1]) - 1;
        }
    }
    
    var maxPage = Math.ceil(array.length / 10) - 1;
    
    if (page > maxPage) {
        embed.setDescription('please specify a smaller page number');
        return imports.channel.send(embed);
    }

    for (i = 0; i < 10; i++) {
        if (array[(page * 10) + i]) {
            var syntax = imports.Command.syntax.get(imports.data.guilds[imports.guild.id].config.prefix, array[(page * 10) + i][0]);
            embed.addField(array[(page * 10) + i][0], '`' + syntax + '`');
        }
    }

    embed.setFooter('page ' + (page + 1) + ' / ' + (maxPage + 1), imports.client.user.avatarURL);
    imports.channel.send(embed);
}