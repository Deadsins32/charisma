Object.byString = function(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

var Discord = require('discord.js');

module.exports = function(imports, arguments) {
    var embed = new Discord.RichEmbed();
    embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);
    embed.setFooter(imports.client.user.username, imports.client.user.avatarURL);

    function Member(member) {
        this.username = member.user.username;
        this.nickname = member.nickname;
        this.id = member.user.id;
        this.color = member.displayHexColor,
        this.discriminator = '#' + member.user.discriminator,
        this.status = member.user.presence.status;
        this.joinedAt = member.joinedAt.toString();
        this.avatar = member.user.avatarURL;
    }

    function Role(role) {
        this.name = role.name;
        this.id = role.id;
        this.color = role.hexColor;
        this.mentionable = role.mentionable;
        this.createdAt = role.createdAt.toString();
    }

    function Channel(channel) {
        this.name = channel.name;
        this.id = channel.id;
        this.type = channel.type;
        this.createdAt = channel.createdAt.toString();
        if (channel.parent) { this.category = channel.parent.name }
    }

    var objects = {
        charisma: {
            username: imports.client.user.username,
            id: imports.client.user.id,
            discriminator: '#' + imports.client.user.discriminator,
            avatar: imports.client.user.avatarURL,
            createdAt: imports.client.user.createdAt.toString(),
            flavors: imports.Flavors.getFlavors()
        },

        guild: {
            name: imports.guild.name,
            id: imports.guild.id,
            owner: new Member(imports.guild.owner),
            defaultRole: new Role(imports.guild.defaultRole),
            config: imports.data.guilds[imports.guild.id].config,
            colors: imports.data.guilds[imports.guild.id].colors,
            selfroles: []
        },

        user: new Member(imports.member),
        channel: new Channel(imports.channel),
    }

    var selfroles = imports.data.guilds[imports.guild.id].selfroles;

    for (s in selfroles) {
        var role = imports.guild.roles.get(selfroles[s]);
        if (role) { objects.guild.selfroles.push(role.name) }
    }

    if (imports.client.user.presence.game) { objects.charisma.status = imports.client.user.presence.game.name }

    if (arguments[1]) {
        if (imports.Command.methods.mention(arguments[1]).pass) {
            objects.user = new Member(imports.guild.members.find('id', imports.Command.methods.mention(arguments[1]).value));
        }

        else if (imports.Command.methods.channel(arguments[1]).pass) {
            objects.channel = new Channel(imports.guild.channels.find('id', imports.Command.methods.channel(arguments[1]).value));
        }

        else {
            if (arguments[0] == 'role') {
                if (imports.guild.roles.find('name', arguments[1])) {
                    objects.role = new Role(imports.guild.roles.find('name', arguments[1]));
                }

                else if (imports.guild.roles.find('id', arguments[1])) {
                    objects.role = new Role(imports.guilds.roles.find('id', arguments[1]));
                }
            }
        }
    }

    if (arguments[0] == 'user') {
        embed.setThumbnail(objects.user.avatar);
    }

    if (arguments[0] == 'user.avatar') {
        embed.setImage(objects.user.avatar);
    }

    var object = Object.byString(objects, arguments[0]);

    if (object != undefined) {
        if (object.color) {
            embed.setColor(object.color);
        }

        for (o in object) {
            if (isNaN(o)) {
                if (object[o] instanceof Object) {
                    if (object[o] instanceof Array) {
                        embed.addField(o, object[o].length + ' items', true);
                    }

                    else {
                        embed.addField(o, Object.size(object[o]) + ' items', true);
                    }
                }

                else {
                    if (object[o]) {
                        embed.addField(o, object[o], true);
                    }
                }
            }
        }

        if (object instanceof Object) {
            if (object instanceof Array) {
                if (object.length == 0) {
                    embed.setDescription('there\'s no subvalues in `' + arguments[0] + '`');
                }

                else {
                    embed.addField(arguments[0], object.join('\n'));
                }
            }

            else {
                if (Object.size(object) == 0) {
                    embed.setDescription('there\'s no subvalues in `' + arguments[0] + '`');
                }
            }
        }

        else if (imports.Command.methods.color(object).pass) {
            embed.setColor(object);
            embed.setDescription(object);
            embed.setFooter('');
        }

        imports.channel.send(embed);
    }

    else {
        embed.setThumbnail('');
        embed.setDescription('`' + arguments[0] + '` does not exist');
        imports.channel.send(embed);
    }
}