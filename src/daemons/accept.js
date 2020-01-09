function clearEmpties(o) {
    for (var k in o) {
        if (!o[k] || typeof o[k] !== "object") { continue }
        clearEmpties(o[k]);
        if (Object.keys(o[k]).length === 0) { delete o[k] }
    }
}

let Discord = require('discord.js');

module.exports = async function(imports) {
    imports.requests = {};

    // -1: active request already exists
    // 0: request expired
    // 1: request accepted
    imports.awaitRequest = function(guild, channel, user, password) {
        return new Promise(function(resolve, reject) {
            if (!imports.requests[guild]) { imports.requests[guild] = {} }
            if (!imports.requests[guild][channel]) { imports.requests[guild][channel] = {} }
            if (!imports.requests[guild][channel][user]) { if (password) { imports.requests[guild][channel][user] = password } else { imports.requests[guild][channel][user] = false } }
            else { resolve(-1) }

            let count = 0;
            let interval = setInterval(function() {
                count += 1;
                if (imports.requests[guild][channel][user] == true) {
                    delete imports.requests[guild][channel][user];
                    clearEmpties(imports.requests[guild]);
                    if (imports.requests[guild] == {}) { delete imports.requests[guild] }
                    clearInterval(interval);
                    resolve(1);
                }

                else if (count == 300) {
                    delete imports.requests[guild][channel][users];
                    clearEmpties(imports.requests[guild]);
                    if (imports.requests[guild] == {}) { delete imports.requests[guild] }
                    clearInterval(interval);
                    resolve(0);
                }
            }, 100);
        });
    }
}