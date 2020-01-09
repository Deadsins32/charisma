let fs = require('fs-extra');
let emoji = require('node-emoji');

let items = {};
let tables = {};

function recur(path) {
    let files = fs.readdirSync(`./src/economy/${path}`);
    for (let f = 0; f < files.length; f++) {
        let isFolder = fs.statSync(`./src/economy/${path}/${files[f]}`).isDirectory();
        if (isFolder) { recur(`${path}/${files[f]}`) }
        else {
            let item = require(`./../economy/${path}/${files[f]}`);
            items[item.name] = item;
        }
    }
}

module.exports = async function(imports) {
    recur(`items`);
    imports.economy.items = items;

    let tableFiles = fs.readdirSync(`./src/economy/tables/`);
    for (let f = 0; f < tableFiles.length; f++) {
        let table = require(`./../economy/tables/${tableFiles[f]}`);
        tables[tableFiles[f].split('.js')[0]] = table;
    }

    imports.economy.tables = tables;

    imports.itemFromEmoji = function(emote) {
        let toReturn = null;
        for (let i in imports.items) { if (imports.items[i].emoji == emoji.unemojify(emote).split(' ').join('')) { toReturn = imports.items[i].name } }
        return toReturn;
    }
}