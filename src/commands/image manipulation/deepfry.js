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
        description: 'deepfry an image!',
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
            
            try {
                var data = gm(image.buffer, image.attachment.filename);
                data.modulate(120, 400).contrast(10).quality(0.001).sharpen(10, 1);
            
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

            catch(error) {
                imports.channel.stopTyping(true);
                embed.setDescription('an error occured');
                imports.channel.send(embed);
                console.error(error);
            }
        }

        else {
            embed.setDescription('no images were found');
            imports.channel.send(embed);
        }
    }
}