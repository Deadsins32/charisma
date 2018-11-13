var Discord = require('discord.js');

module.exports = function(imports, parameters) {
    var embed = new Discord.RichEmbed();
    embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);

    function parse(name) {
        var status = imports.Command.status({name: name}, imports.local, imports.member, imports.channel, imports.guild);
        if (status) {
            if (status.userUsable && status.visible && !status.blacklisted && status.whitelisted) {
                if (status.nsfw && !imports.channel.nsfw) { return false }
                else { return true }
            }

            else { return false }
        }

        else { return false }
    }

    var page = 0;
    var tag = false;
    var name = false;

    var configs = imports.Command.configs;
    var list = new Object();

    if (parameters[0]) {
        if (!isNaN(parameters[0])) {
            page = parseInt(parameters[0]) - 1;
            for (c in configs) { if (parse(c)) { list[c] = configs[c] } }
        }

        else {
            if (parameters[0] == 'help') {
                return imports.channel.send(':unamused:');
            }

            else {
                if (configs[parameters[0]]) { name = true }
                else { for (c in configs) { if (configs[c].tags) { if (configs[c].tags.includes(parameters[0])) { tag = true } } } }

                if (tag) { for (c in configs) { if (configs[c].tags) { if (configs[c].tags.includes(parameters[0])) { if (parse(c)) { list[c] = configs[c] } } } } }
                if (name) {
                    var config = configs[parameters[0]];

                    embed.addField('description', config.description, true);
                    embed.addField('usage', '`' + imports.Command.syntax(imports.data.guilds[imports.guild.id].config.prefix, parameters[0]) + '`', true);
                    if (config.tags) {
                        embed.addField('tags', `` + JSON.stringify(config.tags) + '`', true);
                    }

                    embed.addField('nsfw', config.nsfw, true);
                    return imports.channel.send(embed);
                }
            }
        }
    }

    else { for (var c = 0; c < configs.length; c++) { if (parse(c)) { list[c] = configs[c] } } }


    var array = new Array();
    for (l in list) { array.push([l, list[l]]) }
    
    if (tag) { if (!isNaN(parameters[1])) { page = parseInt(parameters[1]) - 1 } }

    var maxPage = Math.ceil(array.length / 10) - 1;
    
    if (page > maxPage) {
        embed.setDescription('no information could be found');
        return imports.channel.send(embed);
    }

    for (i = 0; i < 10; i++) {
        if (array[(page * 10) + i]) {
            var syntax = imports.Command.syntax(imports.data.guilds[imports.guild.id].config.prefix, array[(page * 10) + i][0]);
            embed.addField(array[(page * 10) + i][0], '`' + syntax + '`');
        }
    }

    embed.setFooter('page ' + (page + 1) + ' / ' + (maxPage + 1), imports.client.user.avatarURL);
    imports.channel.send(embed);
}