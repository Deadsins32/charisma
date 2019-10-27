var Discord = require('discord.js');
var Image = require('./../../core/Image.js');
var gm = require('gm');

function gmToBuffer(data) {
    return new Promise(function(resolve, reject) {
        data.stream(function(err, stdout, stderr) {
            if (err) { return reject(err) }
            const chunks = []
            stdout.on('data', function(chunk) { chunks.push(chunk) })
            stdout.once('end', function() { resolve(Buffer.concat(chunks)) })
            stderr.once('data', function(data) { reject(String(data)) })
        });
    });
}

module.exports = {
    config: {
        permissions: ["PATREON.BUBBLEGUM"],
        description: 'perform some image magik!',
        hidden: false,
        nsfw: false,
        tags: ['image', 'patreon'],
        params: []
    },

    command: async function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
        
        var image = await Image.getLastImage(imports);

        if (image) {
            imports.channel.startTyping();
            var data = gm(image.buffer, image.attachment.filename);

            data.swirl(50 + Math.floor(Math.random() * 50));
            if (Math.floor(Math.random() * 2) == 0) { data.blur((2 + Math.floor(Math.random() * 10), (2 + Math.floor(Math.random() * 5)))) }
            if (Math.floor(Math.random() * 2) == 0) { data.colorize(10 + Math.floor(Math.random() * 50), 10 + Math.floor(Math.random() * 50), 10 + Math.floor(Math.random() * 50)) }
            
            var magikBuffer = await gmToBuffer(data);

            var magikEmbed = new Discord.RichEmbed();
            magikEmbed.setColor(imports.local.guild.colors.accent);
            magikEmbed.attachFile({
                attachment: magikBuffer,
                name: image.attachment.filename
            });

            magikEmbed.setImage(`attachment://${image.attachment.filename}`);
            imports.channel.stopTyping(true);
            imports.channel.send(magikEmbed);
        }

        else {
            embed.setDescription('no images were found');
            imports.channel.send(embed);
        }
    }
}