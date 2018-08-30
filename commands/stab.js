module.exports = function(imports, arguments) {
    var gifs = [
        "https://media.giphy.com/media/moWba8OhAmhZ6/giphy.gif",
        "https://media2.giphy.com/media/zbVuat3JlInNS/giphy.gif",
        "http://gifimage.net/wp-content/uploads/2017/09/anime-stab-gif-10.gif",
        "http://i0.kym-cdn.com/photos/images/original/000/934/866/c5b.gif",
        "http://gifimage.net/wp-content/uploads/2017/09/anime-stab-gif-11.gif",
        "http://giffiles.alphacoders.com/834/8340.gif",
        "https://media.giphy.com/media/cThssR9peQeoo/giphy.gif",
        "https://i.stack.imgur.com/5IQ0b.gif",
        "http://i.imgur.com/zFdoyn9.gif",
        "http://i.imgur.com/nM9Xdib.gif"
    ]

    var gifs2 = [
        "https://media.giphy.com/media/cThssR9peQeoo/giphy.gif"
    ]

    var username = imports.guild.members.find('id', imports.Command.methods.mention(arguments[0]).value).user.username;
    if (imports.user.id == "393915173406244885" || imports.user.id == imports.config.master) {
        var url = gifs[Math.floor(Math.random() * gifs.length)];
        var embed = new imports.Discord.RichEmbed();
        embed.setAuthor('Charisma', imports.client.user.avatarURL);
        embed.setDescription(imports.user.user.username + ' stabbed ' + username);
        embed.setColor(eval('0x' + imports.localsettings.guild.accentcolor.split('#')[1]));
        embed.setImage(url);
        imports.channel.send({embed});
    }

    else {
        imports.channel.send('You either need to be Luxamine or Red');
    }
}