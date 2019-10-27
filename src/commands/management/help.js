var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        hidden: false,
        nsfw: false,
        params: [
            { type: 'string', required: false, name: 'search term | page number' },
            { type: 'string', required: false, name: 'page number (only if applicable)'}
        ]
    },

    command: async function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
    
        async function parse(name) {
            var status = await imports.Command.status({name: name}, imports.local, imports.member, imports.channel, imports.guild);
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
            for (c in configs) { if (configs[c].tags) { if (configs[c].tags.includes(parameters[0])) { tag = true; break; } } }
            for (c in configs) { if (parameters[0] == c) { name = true } }
            if (!name && !tag) { if (!isNaN(parameters[0])) { page = parseInt(parameters[0]) - 1 } }
            else if (parameters[1]) { if (!isNaN(parameters[1])) { page = parseInt(parameters[1]) - 1 } }
        }
    
        if (name) {
            var config = configs[parameters[0]];
            if (config.permissions.includes('BOT.MASTER') && imports.config.master != imports.user.id) { embed.setDescription(`no commands were found`); return imports.channel.send(embed); }
            embed.addField(`description`, config.description, true);
            embed.addField(`usage`, `\`${imports.Command.syntax(imports.local.guild.config.prefix, parameters[0])}\``, true);
            if (config.tags) { embed.addField(`tags`, config.tags.join(', '), true) }
            if (config.permissions.length > 0) {
                var finalPermArr = new Array();
                for (var p = 0; p < config.permissions.length; p++) { finalPermArr.push(`\`${config.permissions[p]}\``) }
                embed.addField(`permissions`, finalPermArr.join(', '));
            }
            embed.addField(`nsfw`, config.nsfw, true);
            return imports.channel.send(embed);
        }
    
        else {
            if (!tag && parameters[0] && isNaN(parameters[0])) { embed.setDescription(`no commands were found`); return imports.channel.send(embed) }
            if (tag) { for (c in configs) { if (await parse(c) && configs[c].tags && configs[c].tags.includes(parameters[0])) { list[c] = configs[c] } } }
            else { for (c in configs) { if (await parse(c)) { list[c] = configs[c] } } }
            var array = new Array();
            for (l in list) { array.push([l, list[l]]) }
            var maxPage = Math.ceil(array.length / 10) - 1;
            if (page > maxPage) {
                if (array.length == 0) { embed.setDescription(`no commands were found`) }
                else { embed.setDescription(`please specify a smaller page number`) }
                return imports.channel.send(embed);
            }
    
            for (var i = 0; i < 10; i++) {
                if (array[(page * 10) + i]) {
                    var syntax = imports.Command.syntax(imports.local.guild.config.prefix, array[(page * 10) + i][0]);
                    embed.addField(array[(page * 10) + i][0], `\`${syntax}\``);
                }
            }
    
            embed.setFooter(`page ${page + 1}/${maxPage + 1}`);
            imports.channel.send(embed);
        }
    }
}