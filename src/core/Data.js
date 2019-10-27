var rethink = require('rethinkdb');
var syncFs = require('./syncFs.js');
var connection;
var defaults = require('./../config/defaults.json');
var config = require('./../config/config.json');

var items = {};
var lootTables = {};

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
        connection = await rethink.connect({ host: config.databaseIp, port: config.databasePort });
        var databases = await rethink.dbList().run(connection);
        if (!databases.includes('charisma')) { await rethink.dbCreate('charisma').run(connection) }
        var tables = await rethink.db('charisma').tableList().run(connection);
        if (!tables.includes(config.variation)) { await rethink.db('charisma').tableCreate(config.variation).run(connection) }
        if (!tables.includes('guilds')) { await rethink.db('charisma').tableCreate('guilds').run(connection) }
        if (!tables.includes('users')) { await rethink.db('charisma').tableCreate('users').run(connection) }
        if (!tables.includes('inventories')) { await rethink.db('charisma').tableCreate('inventories').run(connection) }
        if (!tables.includes('market')) { await rethink.db('charisma').tableCreate('market').run(connection) }
        items = await require('./Items.js')();

        var tableFiles = await syncFs.readDir('./src/economy/loot tables/');
        for (var f = 0; f < tableFiles.length; f++) {
            var table = require(`./../economy/loot tables/${tableFiles[f]}`);
            lootTables[tableFiles[f].split('.js')[0]] = table;
        }
    },

    clearTable: async function(table) {
        await rethink.db('charisma').tableDrop(table).run(connection);
        await rethink.db('charisma').tableCreate(table).run(connection);
    },

    getGuild: async function(id) {
        var guild = await rethink.db('charisma').table('guilds').get(id).run(connection);
        if (guild == null) {
            defaults.guild.id = id;
            await rethink.db('charisma').table('guilds').get(id).replace(defaults.guild).run(connection);
            guild = await rethink.db('charisma').table('guilds').get(id).run(connection);
        }

        var variation = await rethink.db('charisma').table(config.variation).get(id).run(connection);
        if (variation == null) {
            defaults.variations[config.variation].id = id;
            await rethink.db('charisma').table(config.variation).get(id).replace(defaults.variations[config.variation]).run(connection);
            variation = await rethink.db('charisma').table(config.variation).get(id).run(connection);
        }

        guild.config.prefix = variation.prefix;
        guild.colors.accent = variation.accent;
        if (config.variation != 'lavender') { guild.options.leveling = false }

        return guild;
    },

    setGuild: async function(id, path, value) {
        var guild = await this.getGuild(id);
        setToValue(guild, value, path);
        var variation = {
            id: id,
            prefix: guild.config.prefix,
            accent: guild.colors.accent
        }

        delete guild.config.prefix;
        delete guild.colors.accent;

        await rethink.db('charisma').table('guilds').get(id).replace(guild).run(connection);
        await rethink.db('charisma').table(config.variation).get(id).replace(variation).run(connection);
    },

    replaceGuild: async function(id, obj) {
        obj.id = id;
        var variation = {
            id: id,
            prefix: obj.config.prefix,
            accent: obj.colors.accent
        }

        delete obj.config.prefix;
        delete obj.colors.accent;

        await rethink.db('charisma').table('guilds').get(id).replace(obj).run(connection);
        await rethink.db('charisma').table(config.variation).get(id).replace(variation).run(connection);
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

    getItem: function(item) { if (items[item]) { return items[item] } },
    getItems: function() { return items },
    getLootTables: function() { return lootTables },

    inventory: {
        get: async function(id) {
            var inventory = await rethink.db('charisma').table('inventories').get(id).run(connection);
            if (inventory == null) {
                defaults.inventory.id = id;
                await rethink.db('charisma').table('inventories').get(id).replace(defaults.inventory).run(connection);
                inventory = await rethink.db('charisma').table('inventories').get(id).run(connection);
            }

            if (!inventory.obtained) { inventory.obtained = {} }
            return inventory;
        },

        getObtained: async function(id, item) {
            var inventory = await rethink.db('charisma').table('inventories').get(id).run(connection);
            var toReturn = 0;
            if (inventory.obtained[item]) { toReturn = inventory.obtained[item] }
            return toReturn;
        },

        deleteObtained: async function(id, item) {
            var inventory = await rethink.db('charisma').table('inventories').get(id).run(connection);
            if (inventory.obtained[item]) { delete inventory.obtained[item] }
            await rethink.db('charisma').table('inventories').get(id).replace(inventory).run(connection);
        },

        deleteAllObtained: async function(id) {
            var inventory = await rethink.db('charisma').table('inventories').get(id).run(connection);
            inventory.obtained = {};
            await rethink.db('charisma').table('inventories').get(id).replace(inventory).run(connection);
        },

        getItem: async function(id, item) {
            var inventory = await this.get(id);
            var toReturn = null;
            for (var i in inventory.items) { if (i == item) { toReturn = inventory.items[i] } }
            return toReturn;
        },

        hasItem: async function(id, item) { return await this.getItem(id, item) != null },

        addItem: async function(id, item, quantity) {
            var inventory = await this.get(id);
            var count = 1;
            if (quantity) { count = quantity }
            if (!inventory.items[item]) { inventory.items[item] = count }
            else { inventory.items[item] += count }

            if (!inventory.obtained[item]) { inventory.obtained[item] = 1 }
            else { inventory.obtained[item] += 1 }
            
            await rethink.db('charisma').table('inventories').get(id).replace(inventory).run(connection);
        },

        removeItem: async function(id, item, quantity) {
            var inventory = await this.get(id);
            var count = 1;
            if (quantity) { count = quantity }
            if (inventory.items[item]) {
                inventory.items[item] -= count;
                if (inventory.items[item] <= 0) { delete inventory.items[item] }
                await rethink.db('charisma').table('inventories').get(id).replace(inventory).run(connection);
            }
        },

        getKeyItem: async function(id, item) {
            var inventory = await this.get(id);
            var toReturn = null;
            if (inventory.key[item]) { toReturn = inventory.key[item] }
            return toReturn;
        },

        addKeyItem: async function(id, item, meta) {
            var inventory = await this.get(id);
            var metadata = {};
            if (meta) { metadata = {} }
            if (!inventory.key[item]) { inventory.key[item] = metadata }
            await rethink.db('charisma').table('inventories').get(id).replace(inventory).run(connection);
        },

        setKeyItem: async function(id, item, meta) {
            var inventory = await this.get(id);
            if (inventory.key[item]) { inventory.key[item] = meta }
            await rethink.db('charisma').table('inventories').get(id).replace(inventory).run(connection);
        },

        getContainer: async function(id, name, index) {
            var inventory = await this.get(id);
            var toReturn = null;
            if (inventory.containers[name] && inventory.containers[name][index]) { toReturn = inventory.containers[name][index] }
            return toReturn;
        },

        getContainers: async function(id, name) {
            var inventory = await this.get(id);
            var toReturn = null;
            if (inventory.containers[name]) { toReturn = inventory.containers[name] }
            return toReturn;
        },

        addContainer: async function(id, name, container) {
            var inventory = await this.get(id);
            if (!inventory.containers[name]) { inventory.containers[name] = new Array() }
            inventory.containers[name].push(container);
            if (!inventory.obtained[name]) { inventory.obtained[name] = 1 }
            else { inventory.obtained[name] += 1 }
            await rethink.db('charisma').table('inventories').get(id).replace(inventory).run(connection);
        },

        removeContainer: async function(id, name, index) {
            var inventory = await this.get(id);
            if (inventory.containers[name] && inventory.containers[name][index]) { inventory.containers[name].splice(index, 1) }
            if (inventory.containers[name] && inventory.containers[name].length == 0) { delete inventory.containers[name] }
            await rethink.db('charisma').table('inventories').get(id).replace(inventory).run(connection);
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
    },

    market: {
        get: async function(id) {
            var market = await rethink.db('charisma').table('market').get(id).run(connection);
            if (market == null) {
                market = {id: id};
                await rethink.db('charisma').table('market').get(id).replace(market).run(connection);
            }

            return market;
        },

        getAll: async function() {
            return await rethink.db('charisma').table('market').getAll().run(connection);
        }
    }
}