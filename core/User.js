var fs = require('fs');

module.exports = {
    users: require('./../data/settings/users.json'),
    defaultUser: require('./../data/settings/defaults.json').user,

    get: function(id) {
        var user = null;
        for (u in module.exports.users) {
            if (module.exports.users[u].id == id) {
                user = module.exports.users[u];
            }
        }

        return user;
    },

    add: function(id) {
        var object = module.exports.defaultUser;
        object.id = id;
        module.exports.users.push(object);
        var json = JSON.stringify(module.exports.users);
        fs.writeFile('./data/settings/users.json', json);
    },

    remove: function(id) {

    }
}