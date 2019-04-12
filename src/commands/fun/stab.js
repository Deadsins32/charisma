var Discord = require('discord.js');

var gifs = [
    'https://media.giphy.com/media/moWba8OhAmhZ6/giphy.gif',
    'https://media2.giphy.com/media/zbVuat3JlInNS/giphy.gif',
    'http://gifimage.net/wp-content/uploads/2017/09/anime-stab-gif-10.gif',
    'http://i0.kym-cdn.com/photos/images/original/000/934/866/c5b.gif',
    'http://gifimage.net/wp-content/uploads/2017/09/anime-stab-gif-11.gif',
    'http://giffiles.alphacoders.com/834/8340.gif',
    'https://media.giphy.com/media/cThssR9peQeoo/giphy.gif',
    'https://i.stack.imgur.com/5IQ0b.gif',
    'http://i.imgur.com/zFdoyn9.gif',
    'http://i.imgur.com/nM9Xdib.gif'
]

var gifs2 = [
    'https://media.giphy.com/media/cThssR9peQeoo/giphy.gif'
]

module.exports = {
    config: {
        permissions: [],
        description: 'stab whoever you mention',
        hidden: true,
        nsfw: false,
        params: [
            { type: 'mention', required: true }
        ]
    },

    command: function(imports, arguments) {
        var id = arguments[0];
        var username = imports.guild.members.get(id).user.username;
        if (imports.user.id == '393915173406244885' || imports.user.id == imports.config.master) {
            var url = gifs[Math.floor(Math.random() * gifs.length)];
            var embed = new Discord.RichEmbed();
            embed.setAuthor('Charisma', imports.client.user.avatarURL);
            embed.setDescription(imports.user.username + ' stabbed ' + username);
            embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
            embed.setImage(url);
            imports.channel.send(embed);
        }
    
        else {
            imports.channel.send('only kewl kids can stab people :shrug:');
        }
    }
}