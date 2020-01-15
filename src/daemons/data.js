var rethink = require('rethinkdb');
var config;
var connection;
var name;
var defaults;

function setToValue(obj, value, path) {
    var i;
    path = path.split('.');
    for (i = 0; i < path.length - 1; i++) { obj = obj[path[i]] }
    obj[path[i]] = value;
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
}

module.exports = async function(imports) {
    config = imports.config.main;
    name = imports.config.meta.name;
    defaults = clone(imports.config.defaults);
    imports.Data = {
        start: async function() {
            connection = await rethink.connect({ host: config.host, port: config.port });
            var databases = await rethink.dbList().run(connection);
            if (!databases.includes(name)) { await rethink.dbCreate(name).run(connection) }
            var tables = await rethink.db(name).tableList().run(connection);
            if (!tables.includes('guild')) { await rethink.db(name).tableCreate('guild').run(connection) }
            if (!tables.includes('user')) { await rethink.db(name).tableCreate('user').run(connection) }
            if (!tables.includes('inventory')) { await rethink.db(name).tableCreate('inventory').run(connection) }
            if (!tables.includes(config.variation)) { await rethink.db(name).tableCreate(config.variation).run(connection) }
            console.ready(`connected to rethink://${config.host}:${config.port}`);
            connection.addListener('close', function() {
                console.error('lost connection...');
                process.emit('SIGINT');
            });
        },

        _get: async function(table, id) {
            var obj = await rethink.db(name).table(table).get(id).run(connection);
            if (obj == null) {
                defaults[table].id = id;
                await rethink.db(name).table(table).get(id).replace(defaults[table]).run(connection);
                obj = await rethink.db(name).table(table).get(id).run(connection);
            }

            return obj;
        },

        _set: async function(table, id, path, value) {
            var obj = await this.get(table, id);
            setToValue(obj, value, path);
            await rethink.db(name).table(table).get(id).replace(obj).run(connection);
        },

        _replace: async function(table, id, obj) {
            obj.id = id;
            await rethink.db(name).table(table).get(id).replace(obj).run(connection);
        },

        guild: {
            get: async function(id) {
                let guild = await imports.Data._get('guild', id);

                let variation = await rethink.db(name).table(config.variation).get(id).run(connection);
                if (variation == null) {
                    defaults.variations[config.variation].id = id;
                    await rethink.db(name).table(config.variation).get(id).replace(defaults.variations[config.variation]).run(connection);
                    variation = await rethink.db(name).table(config.variation).get(id).run(connection);
                }

                guild.config.prefix = variation.prefix;
                guild.colors.accent = variation.accent;

                return guild;
            },

            set: async function(id, path, value) {
                let guild = await this.get(id);
                setToValue(guild, value, path);
                let variation = {
                    id: id,
                    prefix: guild.config.prefix,
                    accent: guild.colors.accent
                }

                delete guild.config.prefix;
                delete guild.colors.accent;

                await rethink.db(name).table('guild').get(id).replace(guild).run(connection);
                await rethink.db(name).table(config.variation).get(id).replace(variation).run(connection);
            },

            replace: async function(id, obj) {
                obj.id = id;
                let variation = {
                    id: id,
                    prefix: obj.config.prefix,
                    accent: obj.colors.accent
                }

                delete obj.config.prefix;
                delete obj.colors.accent;

                await rethink.db(name).table('guild').get(id).replace(obj).run(connection);
                await rethink.db(name).table(config.variation).get(id).replace(variation).run(connection);
            }
        },

        user: {
            get: async function(id) {
                var user = await imports.Data._get('user', id);
                return user;
            },

            set: async function(id, path, value) {
                await imports.Data._set('user', id, path, value);
            },

            replace: async function(id, obj) {
                await imports.Data._replace('user', id, obj);
            }
        },

        inventory: {
            get: async function(id) {
                let inventory = await imports.Data._get('inventory', id);
                return inventory;
            },

            item: {
                get: async function(id, item) {
                    let inventory = await imports.Data.inventory.get(id);
                    let toReturn = null;
                    for (let i in inventory.items) { if (i == item) { toReturn = inventory.items[i] } }
                    return toReturn;
                },

                has: async function(id, item) { return await this.get(id, item) != null },

                add: async function(id, item, meta) {
                    if (!isNaN(meta)) {
                        let num = parseInt(meta);
                        meta = [];
                        for (let i = 0; i < num; i++) { meta.push({}) }
                    }

                    if (!Array.isArray(meta)) { meta = [meta] }

                    let inventory = await imports.Data.inventory.get(id);
                    if (!inventory.items[item]) { inventory.items[item] = meta }
                    else { for (let i = 0; i < meta.length; i++) { inventory.items[item].push(meta[i]) } }
                    if (!inventory.obtained[item]) { inventory.obtained[item] = meta.length }
                    else { inventory.obtained[item] += meta.length }

                    await rethink.db(name).table('inventory').get(id).replace(inventory).run(connection);
                },

                addMany: async function(id, item, metas) {
                    let inventory = await imports.Data.inventory.get(id);
                    if (inventory.items[item] == undefined) { inventory.items[item] = metas }
                    else {
                        if (!(metas instanceof Array)) { metas = [metas] }
                        for (let m = 0; m < metas.length; m++) { inventory.items[item].push(metas[m]) }
                    }

                    await rethink.db(name).table('inventory').get(id).replace(inventory).run(connection);
                },

                remove: async function(id, item, quantity) {
                    let inventory = await imports.Data.inventory.get(id);
                    let q = quantity != undefined ? quantity : 1;
                    for (let qq = 0; qq < q; qq++) { inventory.items[item].shift(); }

                    await rethink.db(name).table('inventory').get(id).replace(inventory).run(connection);
                },

                removeAt: async function(id, item, index) {
                    let inventory = await imports.Data.inventory.get(id);
                    let i = 0;
                    if (index) { i = index }
                    if (inventory.items[item]) { inventory.items[item].splice(i, 1) }
                    if (inventory.items[item].length == 0) { delete inventory.items[item] }
                    await rethink.db(name).table('inventory').get(id).replace(inventory).run(connection);
                },

                setMeta: async function(id, item, index, meta) {
                    let inventory = await imports.Data.inventory.get(id);
                    inventory.items[item][index] = meta;
                    await rethink.db(name).table('inventory').get(id).replace(inventory).run(connection);
                },

                key: {
                    get: async function(id, item) {
                        let inventory = await imports.Data.inventory.get(id);
                        let toReturn = null;
                        if (inventory.key[item]) { toReturn = inventory.key[item] }
                        return toReturn;
                    },

                    set: async function(id, item, meta) {
                        let inventory = await imports.Data.inventory.get(id);
                        if (inventory.key[item]) {
                            await imports.Data.inventory.item.add(id, item, meta);
                            inventory.key[item] = meta;
                        }

                        else { inventory.key[item] = meta }

                        await rethink.db(name).table('inventory').get(id).replace(inventory).run(connection);
                    },

                    remove: async function(id, item) {
                        let inventory = await imports.Data.inventory.get(id);
                        if (inventory.key[item]) { await imports.Data.inventory.item.add(id, item, inventory.key[item]) }
                        delete inventory.key[item];
                        await rethink.db(name).table('inventory').get(id).replace(inventory).run(connection);
                    }
                },

                obtained: {
                    get: async function(id, item) {
                        let inventory = await imports.Data.inventory.get(id);
                        let toReturn = 0;
                        if (inventory.obtained[item]) { toReturn = inventory.obtained[item] }
                        return toReturn;
                    },

                    delete: async function(id, item) {
                        let inventory = await imports.Data.inventory.get(id);
                        if (inventory.obtained[item]) { delete inventory.obtained[item] }
                        await rethink.db(name).table('inventory').get(id).replace(inventory).run(connection);
                    },

                    deleteAll: async function(id) {
                        let inventory = await imports.Data.inventory.get(id);
                        inventory.obtained = {};
                        await rethink.db(name).table('inventory').get(id).replace(inventory).run(connection);
                    }
                }
            },

            money: {
                get: async function(id) {
                    let inventory = await imports.Data.inventory.get(id);
                    return inventory.balance;
                },

                add: async function(id, money) {
                    let inventory = await imports.Data.inventory.get(id);
                    inventory.balance += money;
                    await rethink.db(name).table('inventory').get(id).replace(inventory).run(connection);
                },

                remove: async function(id, money) {
                    let inventory = await imports.Data.inventory.get(id);
                    inventory.balance -= money;
                    if (inventory.balance < 0) { inventory.balance = 0 }
                    await rethink.db(name).table('inventory').get(id).replace(inventory).run(connection);
                }
            }
        }
    }
}