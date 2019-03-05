var syncFs = require('./../core/syncFs.js');

async function save(imports) {
    for (g in imports.data.guilds) {
        if (!await syncFs.exists(`./data/guilds/${g}`)) { await syncFs.createDirectory(`./data/guilds/${g}`) }
        for (p in imports.data.guilds[g]) {
            if (p != 'members') { await syncFs.writeFile(`./data/guilds/${g}/${p}.json`, JSON.stringify(imports.data.guilds[g][p], null, 4)) }
            else { if (!await syncFs.exists(`./data/guilds/${g}/members`)) { await syncFs.createDirectory(`./data/guilds/${g}/members`) } }
        }

        for (m in imports.data.guilds[g].members) { await syncFs.writeFile(`./data/guilds/${g}/members/${m}.json`, JSON.stringify(imports.data.guilds[g].members[m], null, 4)) }
    }

    for (u in imports.data.users) { await syncFs.writeFile(`./data/users/${u}.json`, JSON.stringify(imports.data.users[u], null, 4)) }
    //console.log('saving information...');
}

module.exports = async function(imports) {
    process.on('SIGINT', async function() {
        var connections = imports.client.voiceConnections.array();
        for (var c = 0; c < connections.length; c++) { connections[c].disconnect() }
        await save(imports);
        process.exit();
    }.bind());

    setInterval(async function() {
        await save(imports);
    }, 1800000);
}