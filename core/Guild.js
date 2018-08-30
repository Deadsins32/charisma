var fs = require('fs');

module.exports = {
    guilds: require('./../data/settings/guilds.json'),
    defaultGuild: require('./../data/settings/defaults.json').guild,

    get: function(id) {
        var guild = null;
        for (g in module.exports.guilds) {
            if (module.exports.guilds[g].id == id) {
                guild = module.exports.guilds[g];
            }
        }

        return guild;
    },

    add: function(id) {
        var object = module.exports.defaultGuild;
        object.id = id;
        module.exports.guilds.push(object);
        var json = JSON.stringify(module.exports.guilds);
        fs.writeFile('./data/settings/guilds.json', json);
    },

    remove: function(id) {
        for (g in module.exports.guilds) {
            if (module.exports.guilds[g].id == id) {
                module.exports.guilds.splice(g, 1);
            }
        }

        var json = JSON.stringify(module.exports.guilds);
        fs.writeFile('./data/settings/guilds.json', json);
    }
}