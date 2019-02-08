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

function index(obj, is, value) {
    try {
        if (typeof is == 'string') { return index(obj,is.split('.'), value) }
        else if (is.length == 1 && value !== undefined) { return obj[is[0]] = value }
        else if (is.length == 0) { return obj }
        else { return index(obj[is[0]], is.slice(1), value) }
    }

    catch(error) {}
}

var Discord = require('discord.js');
var average = require('image-average-color');
var request = require('request');
async function getBuffer(url) {
    return new Promise(function(resolve, reject) {
        request({ url, encoding: null }, function(error, response, buffer) {
            if (error) { reject(error) }
            else { resolve(buffer) }
        });
    });
}

async function getAverage(buffer) {
    return new Promise(function(resolve, reject) {
        average(buffer, function(error, color) {
            if (error) { reject(error) }
            else { resolve(color) }
        });
    });
}

function toHex(r, g, b) {
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

module.exports = async function(imports, parameters) {
    var embed = new Discord.RichEmbed();
    embed.setColor(imports.data.guilds[imports.guild.id].colors.accent);

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

    var keys = {
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
            selfroles: [],
            avatar: imports.guild.iconURL
        },

        user: new Member(imports.member),
        channel: new Channel(imports.channel),
    }

    var selfroles = imports.data.guilds[imports.guild.id].selfroles;

    for (s in selfroles) {
        var role = imports.guild.roles.get(selfroles[s]);
        if (role) { keys.guild.selfroles.push(role.name) }
    }

    if (imports.client.user.presence.game) { keys.charisma.status = imports.client.user.presence.game.name }

    var guildIconBuff = await getBuffer(keys.guild.avatar);
    var average = await getAverage(guildIconBuff);
    var averageHex = toHex(average[0], average[1], average[2]);
    keys.guild.hideColor = averageHex;


    if (parameters[1]) {
        if (imports.Command.methods.mention(parameters[1]).pass) {
            if (imports.guild.members.get(imports.Command.methods.mention(parameters[1]).value)) {
                keys.user = new Member(imports.guild.members.get(imports.Command.methods.mention(parameters[1]).value));
            }
        }

        else if (imports.Command.methods.channel(parameters[1]).pass) {
            if (imports.guild.channels.get(imports.Command.methods.channel(parameters[1]).value)) {
                keys.channel = new Channel(imports.guild.channels.get(imports.Command.methods.channel(parameters[1]).value));
            }
        }

        else {
            if (parameters[0] == 'role') {
                if (imports.guild.roles.find('name', parameters[1])) { keys.role = new Role(imports.guild.roles.find('name', parameters[1])) }
                else if (imports.guild.roles.find(parameters[1])) { keys.role = new Role(imports.guilds.roles.find(parameters[1])) }
            }
        }
    }


    //if (parameters[0] == 'user') { embed.setThumbnail(keys.user.avatar) }
    //else if (parameters[0] == 'user.avatar') { embed.setImage(keys.user.avatar) }

    //var object = Object.byString(objects, parameters[0]);
    var object = index(keys, parameters[0]);
    if (object) {
        var size;
        if (object instanceof Object) {
            var size;
            if (object instanceof Array) { size = object.length }
            else { size = Object.size(object) }
            
            if (size != 0) {
                if (object instanceof Array) { embed.setDescription(object.join(',\n')) }
                else {
                    if (object.color) { embed.setColor(object.color) }
                    if (object.hideColor) { embed.setColor(object.hideColor) }
                    if (object.avatar) { embed.setImage(object.avatar) }
                    for (o in object) {
                        if (object[o] instanceof Array) { embed.addField(o, `${object[o].length} items`, true) }
                        else if (object[o] instanceof Object) { embed.addField(o, `${Object.size(object[o])} items`, true) }
                        else {
                            if (o != 'avatar' && o != 'hideColor' && object[o] != null) {
                                if (object[o] == '') { embed.addField(o, null, true) }
                                else { embed.addField(o, object[o], true) }
                            }
                        }
                    }
                }
            }

            else { embed.setDescription(`${parameters[0]} does not have any properties`) }
        }

        else { embed.setDescription(`cannot display individual properties`) }
    }

    else {
        embed.setThumbnail('');
        embed.setImage('');
        embed.setDescription(`${parameters[0]} does not exist`);
    }

    imports.channel.send(embed);
}