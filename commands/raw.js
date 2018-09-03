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

module.exports = function(imports, arguments) {
    var arrays = [];
    var arrayTotal = 0;

    var objs = [];
    var objTotal = 0;

    var knotted = true;
    
    function replacer(key, value) {
        if (value instanceof Object && value instanceof Array) {
            if (value.length > 20) {
                arrays[arrayTotal] = value;
                arrayTotal++;
                return '[a]';
            }
        }

        else if (value instanceof Object && !(value instanceof Array) && !knotted) {
            if (Object.size(value) > 20) {
                objs[objTotal] = value;
                objTotal++;
                return '[o]';
            }
        }

        return value;
    }

    var rawMembers = imports.guild.members;
    var membersArray = new Array();
    var members = new Object();

    function Member(member) {
        this.username = member.user.username;
        this.nickname = member.nickname;
        this.id = member.user.id;
        this.discriminator = member.user.discriminator,
        this.status = member.user.presence.status;
        this.joinedAt = member.joinedAt.toString();
        this.avatar = member.user.avatarURL;
        this.permissions = member.permissions.serialize(true);
    }

    for (m in rawMembers.array()) {
        membersArray[m] = new Member(rawMembers.array()[m]);
    }

    rawMembers.forEach(function(member, memberId) {
        members[memberId] = new Member(member);
    });

    var rawRoles = imports.guild.roles;
    var rolesArray = new Array();
    var roles = new Object();

    function Role(role) {
        this.name = role.name;
        this.id = role.id;
        this.color = role.hexColor;
        this.mentionable = role.mentionable;
        this.createdAt = role.createdAt.toString();
        this.permissions = role.serialize(true);
        this.members = new Array();

        for (m in role.members.array()) {
            this.members[m] = role.members.array()[m].user.username + '#' + role.members.array()[m].user.discriminator;
        }
    }

    for (r in rawRoles.array()) {
        rolesArray[r] = new Role(rawRoles.array()[r]);
    }

    rawRoles.forEach(function(role, roleId) {
        roles[roleId] = new Role(role);
    });

    var rawChannels = imports.guild.channels;
    var channelsArray = new Array();
    var channels = new Object();

    function Channel(channel) {
        this.name = channel.name;
        this.id = channel.id;
        if (channel.parent) {
            this.category = channel.parent.name;
        }
        this.type = channel.type;
        this.createdAt = channel.createdAt.toString();
    }

    for (c in rawChannels.array()) {
        channelsArray[c] = new Channel(rawChannels.array()[c]);
    }

    rawChannels.forEach(function(channel, channelId) {
        channels[channelId] = new Channel(channel);
    });

    var objects = {
        charisma: {
            username: imports.client.user.username,
            id: imports.client.user.id,
            discriminator: '#' + imports.client.user.discriminator,
            avatar: imports.client.user.avatarURL,
            status: null,
            createdAt: imports.client.user.createdAt.toString(),
            flavors: imports.Flavors.getFlavors()
        },

        guild: {
            name: imports.guild.name,
            id: imports.guild.id,
            owner: new Member(imports.guild.owner),
            defaultRole: new Role(imports.guild.defaultRole),
            members: members,
            roles: roles,
            channels: channels,
            settings: {
                prefix: imports.settings.guilds[imports.guild.id].prefix,
                flavor: imports.settings.guilds[imports.guild.id].flavor,
                accentcolor: imports.settings.guilds[imports.guild.id].accentcolor,
                description: imports.settings.guilds[imports.guild.id].description,
                expcurve: imports.settings.guilds[imports.guild.id].expcurve,
                logchannel: imports.settings.guilds[imports.guild.id].logchannel,
                autorole: imports.settings.guilds[imports.guild.id].autorole,
                selfroles: imports.settings.guilds[imports.guild.id].selfroles
            }
        },

        user: new Member(imports.user),
        channel: new Channel(imports.channel),

        members: membersArray,
        roles: rolesArray,
        channels: channelsArray
    }

    if (imports.client.user.presence.game) {
        object.charisma.status = imports.client.user.presence.game.name;
    }

    if (arguments[1]) {
        if (imports.Command.methods.mention(arguments[1]).pass) {
            objects.user = new Member(imports.guild.members.find('id', imports.Command.methods.mention(arguments[1]).value));
        }

        else if (imports.Command.methods.channel(arguments[1]).pass) {
            objects.channel = new Channel(imports.guild.channels.find('id', imports.Command.methods.channel(arguments[1]).value));
        }
    }

    var object = Object.byString(objects, arguments[0]);

    for (i in object) {
        if (typeof object[i] === 'object') {
            knotted = false;
        }
    }

    if (object != undefined) {
        var json = JSON.stringify(object, replacer, 4);
        for (a in arrays) {
            json = json.replace('"[a]"', '[ ' + arrays[a].length + ' items ]');
        }

        for (o in objs) {
            json = json.replace('"[o]"', '[ ' + Object.size(objs[o]) + ' items ]');
        }

        imports.channel.send('```json\n' + json + '\n```');
    }

    else {
        imports.channel.send('`"' + arguments[0] + '" does not exist`');
    }
}