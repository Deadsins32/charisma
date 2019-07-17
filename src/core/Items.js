var syncFs = require('./syncFs.js');

var items = {};

module.exports = async function() {
    async function recur(path) {
        var files = await syncFs.readDir(`./src/economy/${path}`);
        for (var f = 0; f < files.length; f++) {
            var isFolder = await syncFs.isFolder(`./src/economy/${path}/${files[f]}`);
            if (isFolder) { await recur(`${path}/${files[f]}`) }
            else {
                var item = require(`./../economy/${path}/${files[f]}`);
                items[item.name] = item;
            }
        }
    }

    await recur(`items`);

    return items;
}