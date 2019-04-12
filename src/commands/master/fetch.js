var fs = require('fs');
var Discord = require('discord.js');

function getStats(path) {
    return new Promise(function(resolve, reject) {
        fs.stat(path, function(error, stats) {
            if (error) { reject(error) }
            else { resolve(stats) }
        });
    });
}

function getDirectory(path) {
    return new Promise(function(resolve, reject) {
        fs.readdir(path, function(error, dirent) {
            if (error) { reject(error) }
            else { resolve(dirent) }
        });
    });
}

module.exports = {
    config: {
        permissions: ['BOT.MASTER'],
        description: 'fetches the current directory tree or file associated with the specified path',
        hidden: false,
        nsfw: false,
        tags: ['management', 'utility'],
        params: [
            { type: 'string', required: true, name: 'path' }
        ]
    },

    command: async function(imports, parameters) {
        var path = parameters[0];
        if (!path.startsWith('./')) {
            if (path.startsWith('/')) { path = `.${path}` }
            else { path = `./${path}` }
        }
        var stats;
    
        var doesExist = true;
        try { stats = await getStats(path) }
        catch(error) { doesExist = false }
    
        if (doesExist) {
            var isDirectory = stats.isDirectory();
            if (isDirectory) {
                var embed = new Discord.RichEmbed();
                embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
    
                var items = await getDirectory(path);
    
                var directories = new Array();
                var files = new Array();
    
                for (var i = 0; i < items.length; i++) {
                    var iStats = await getStats(`${path}/${items[i]}`);
                    if (iStats.isDirectory()) { directories.push(`${items[i]} [directory]`) }
                    else { files.push(`${items[i]} [file]`) }
                }
    
                var output = `${directories.join('\n')}\n${files.join('\n')}`;
                embed.setDescription('```' + output + '```');
                imports.channel.send(embed);
            }
    
            else {
                imports.channel.send('', { files: [path] });
            }
        }
    
        else {
            var embed = new Discord.RichEmbed();
            embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
            embed.setDescription('the specified file or directory does not exist');
            imports.channel.send(embed);
        }
    }
}