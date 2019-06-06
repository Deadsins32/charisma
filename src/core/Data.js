var rethink = require('rethinkdb');
var connection;
var defaults = require('./../../data/defaults.json');
var items = {};

function setToValue(obj, value, path) {
    var i;
    path = path.split('.');
    for (i = 0; i < path.length - 1; i++)
        obj = obj[path[i]];

    obj[path[i]] = value;
}

function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

module.exports = {
    start: async function() {
        connection = await rethink.connect();
        var databases = await rethink.dbList().run(connection);
        if (!databases.includes('charisma')) { await rethink.dbCreate('charisma').run(connection) }
        var tables = await rethink.db('charisma').tableList().run(connection);
        if (!tables.includes('guilds')) { await rethink.db('charisma').tableCreate('guilds').run(connection) }
        if (!tables.includes('users')) { await rethink.db('charisma').tableCreate('users').run(connection) }
        if (!tables.includes('inventories')) { await rethink.db('charisma').tableCreate('inventories').run(connection) }
        items = await require('./Items.js')();
    },

    getGuild: async function(id) {
        var guild = await rethink.db('charisma').table('guilds').get(id).run(connection);
        if (guild == null) {
            defaults.guild.id = id;
            await rethink.db('charisma').table('guilds').get(id).replace(defaults.guild).run(connection);
            guild = await rethink.db('charisma').table('guilds').get(id).run(connection);
        }

        return guild;
    },

    getGuildList: async function() {
        var arr = [];
        var list = await rethink.db('charisma').table('guilds').getAll().run(connection);
    },

    setGuild: async function(id, path, value) {
        var guild = await this.getGuild(id);
        setToValue(guild, value, path);
        await rethink.db('charisma').table('guilds').get(id).replace(guild).run(connection);
    },

    replaceGuild: async function(id, obj) {
        obj.id = id;
        await rethink.db('charisma').table('guilds').get(id).replace(obj).run(connection);
    },

    getUser: async function(id) {
        var user = await rethink.db('charisma').table('users').get(id).run(connection);
        if (user == null) {
            defaults.user.id = id;
            await rethink.db('charisma').table('users').get(id).replace(defaults.user).run(connection);
            user = await rethink.db('charisma').table('users').get(id).run(connection);
        }

        return user;
    },

    setUser: async function(id, path, value) {
        var user = await this.getUser(id);
        setToValue(user, value, path);
        await rethink.db('charisma').table('users').get(id).replace(user).run(connection);
    },

    replaceUser: async function(id, obj) {
        obj.id = id;
        await rethink.db('charisma').table('users').get(id).replace(obj).run(connection);
    },

    inventory: {
        get: async function(id) {
            var inventory = await rethink.db('charisma').table('inventories').get(id).run(connection);
            if (inventory == null) {
                defaults.inventory.id = id;
                await rethink.db('charisma').table('inventories').get(id).replace(defaults.inventory).run(connection);
                inventory = await rethink.db('charisma').table('inventories').get(id).run(connection);
            }

            return inventory;
        },

        getItem: async function(id, item) {
            var inventory = await this.get(id);
            var toReturn = null;
            for (var i in inventory.items) { if (i == item) { toReturn = inventory.items[i] } }
            return toReturn;
        },

        hasItem: async function(id, item) { return this.getItem(id, item) != null },

        addItem: async function(id, item, quantity) {
            var inventory = await this.get(id);
            var count = 1;
            if (quantity) { count = quantity }

            if (!inventory.items[item]) { inventory.items[item] = clone(items[item]) }
            if (inventory.items[item].count) { inventory.items[item].count += count }
            else { inventory.items[item].count = count }
            await rethink.db('charisma').table('inventories').get(id).replace(inventory).run(connection);
        },

        removeItem: async function(id, item, quantity) {
            var inventory = await this.get(id);
            var count = 1;
            if (quantity) { count = quantity }
            if (inventory.items[item]) {
                inventory.items[item].count -= count;
                if (inventory.items[item].count <= 0) { delete inventory.items[item] }
                await rethink.db('charisma').table('inventories').get(id).replace(inventory).run(connection);
            }
        },

        getMoney: async function(id) {
            var inventory = await this.get(id);
            return inventory.currency;
        },

        addMoney: async function(id, money) {
            var inventory = await this.get(id);
            inventory.currency += money;
            await rethink.db('charisma').table('inventories').get(id).replace(inventory).run(connection);
        },

        removeMoney: async function(id, money) {
            var inventory = await this.get(id);
            inventory.currency -= money;
            if (inventory.currency < 0) { inventory.currency = 0 }
            await rethink.db('charisma').table('inventories').get(id).replace(inventory).run(connection);
        }
    }
}