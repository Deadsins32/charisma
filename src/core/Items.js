var syncFs = require('./syncFs.js');

module.exports = async function() {
    var items = {};
    var files = await syncFs.readDir('./src/items/');
    for (var f = 0; f < files.length; f++) {
        var item = require(`./../items/${files[f]}`);
        items[item.name] = item;
    }

    return items;
}