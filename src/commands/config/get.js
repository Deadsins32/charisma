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
}

function index(obj, is, value) {
    try {
        if (typeof is == 'string') { return index(obj,is.split('.'), value) }
        else if (is.length == 1 && value !== undefined) { return obj[is[0]] = value }
        else if (is.length == 0) { return obj }
        else { return index(obj[is[0]], is.slice(1), value) }
    }

    catch(error) {}
}

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
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
        return hex.length == 1 ? '0' + hex : hex;
    }

    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

async function imageToAverage(url) {
    var buffer = await getBuffer(url);
    var average = await getAverage(buffer);
    var hex = toHex(average[0], average[1], average[2]);
    return hex;
}

function clone(obj) {
    var copy;
    if (null == obj || "object" != typeof obj) return obj;
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) { copy[i] = clone(obj[i]) }
        return copy;
    }

    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) { if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]) }
        return copy;
    }

    throw new Error(`unable to copy obj! it's type isn't supported`);
}

// I'm literally losing my mind

module.exports = {
    config: {
        permissions: [],
        description: 'gets a value from whatever you specify',
        hidden: false,
        nsfw: false,
        tags: ['management', 'utility'],
        params: [
            { type: 'string', required: true, name: 'path' },
            { type: 'string', required: false, name: 'user | role | channel' }
        ]
    },

    command: async function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
    
        var guild = await imports.Data.guild.get(imports.guild.id);

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

        var evalKeys = clone(imports.config.main.gets);
        var keys = {};

        // get object prop from dot notation string
        function recur(k, e) {
            for (var i in e) {
                if (typeof e[i] != 'object') {  try { k[i] = eval(e[i]) } catch(e) { k[i] = "none" } }
                else { k[i] = {}; recur(k[i], e[i]) }
            }
        }

        recur(keys, evalKeys);
    
        if (!keys.bot.avatar) { delete keys.bot.avatar }
        if (!keys.guild.avatar) { delete keys.guild.avatar }
        if (!keys.user.avatar) { delete keys.user.avatar }

        if (imports.client.user.presence.game) { keys.bot.status = imports.client.user.presence.game.name } // sets bot.status to the status activity of the bot (if any)
    
        if (keys.guild.avatar) {
            var guildIconBuff = await getBuffer(keys.guild.avatar);
            var average = await getAverage(guildIconBuff);
            var averageHex = toHex(average[0], average[1], average[2]);
            keys.guild.hideColor = averageHex;
        }
    
        if (parameters[1]) {
            var passthrough = { guild: imports.guild, channel: imports.channel, member: imports.member, user: imports.user }
            if (imports.Command.methods.mention(parameters[1], passthrough).pass) {
                if (imports.guild.members.get(imports.Command.methods.mention(parameters[1], passthrough).value)) {
                    keys.user = new Member(imports.guild.members.get(imports.Command.methods.mention(parameters[1], passthrough).value));
                }
            }
    
            else if (imports.Command.methods.channel(parameters[1], passthrough).pass) {
                if (imports.guild.channels.get(imports.Command.methods.channel(parameters[1], passthrough).value)) {
                    keys.channel = new Channel(imports.guild.channels.get(imports.Command.methods.channel(parameters[1], passthrough).value));
                }
            }
    
            else {
                if (parameters[0] == 'role') {
                    if (imports.guild.roles.find('name', parameters[1])) { keys.role = new Role(imports.guild.roles.find('name', parameters[1])) }
                    else if (imports.guild.roles.find(parameters[1])) { keys.role = new Role(imports.guilds.roles.find(parameters[1])) }
                }
            }
        }
        
        // "." = root of object
        if (parameters[0] == '.') { object = keys }

        else { object = index(keys, parameters[0]) }
        if (object != undefined) {
            var size;
            if (object instanceof Object) {
                var size;
                if (object instanceof Array) { size = object.length }
                else { size = Object.size(object) }
                
                if (size != 0) {
                    if (object instanceof Array) { embed.setDescription(object.join(',\n')) }
                    else {
                        if (object.color) { embed.setColor(object.color) } // sets embed color to obj color prop
                        if (object.hideColor) { embed.setColor(object.hideColor) } // sets embed color to obj hideColor prop(hideColor is removed from obj later)
                        if (object.avatar) { embed.setImage(object.avatar) } // sets embed image to avatar prop
                        for (o in object) {
                            if (object[o] instanceof Array) { embed.addField(o, `${object[o].length} items`, true) } // if prop is an array, sets the display text accordingly
                            else if (object[o] instanceof Object) { embed.addField(o, `${Object.size(object[o])} items`, true) } // does the same with sub objects
                            else {
                                if (o != 'avatar' && o != 'hideColor' && object[o] != null) {
                                    if (object[o] == '' && typeof object[o] != 'boolean') { embed.addField(o, null, true) }
                                    else { embed.addField(o, object[o], true) }
                                }
                            }
                        }
                    }
                }
    
                else { embed.setDescription(`\`${parameters[0]}\` does not have any properties`) }
            }
    
            else {
                if (validURL(object)) {
                    embed.setColor(await imageToAverage(object));
                    embed.setImage(object);
                }
                
                else { embed.setDescription(object) }
            }
        }
    
        else {
            embed.setThumbnail('');
            embed.setImage('');
            embed.setDescription(`\`${parameters[0]}\` does not exist`);
        }
    
        imports.channel.send(embed);
    }
}