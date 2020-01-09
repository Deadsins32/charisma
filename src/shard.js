let Discord = require('discord.js');
let config = require('./../berry.json');
let options = require('./config/options.json');
let token = config.token;

let fs = require('fs-extra');

let syncFs = require('./core/syncFs.js');
let colors = require('./core/colors.js');
let exists = syncFs.exists;
let readDir = syncFs.readDir;
let isFolder = syncFs.isFolder;
let inspect = require('./core/utils/inspect.js');

function getOutput(content, marker, highlighted) {
    if (!marker) { marker = '' }
    else { marker = `${marker} ` }
    let lines = [];
    if (typeof content === 'object' && typeof content != null)  {
        let objectString = inspect(content);
        let regexp = /^\d\d:\d\d$/;
        lines = objectString.split('\n');
    }

    else { content = `${content}`; lines = content.split('\n') }
    lines.filter(line => line != '');
    if (highlighted) { lines = colors.highlight(lines.join('\n')).split('\n') }
    for (let l = 0; l < lines.length; l++) { lines[l] = `${marker}${lines[l]}` }
    return lines.join('\n');
}


// overwrites console object with new methods
global.console = {
    log: function(toLog) {
        let error = new Error();
        let marker = colors.fg.wrap('[?]', colors.colors.log);
        let from = error.stack.split('\n')[2].split('\\')[error.stack.split('\n')[2].split('\\').length - 1].slice(0, -1);
        if (options.logs.showOriginFile) { marker = colors.fg.wrap(`[${from}]`, colors.colors.log) }
        let out = getOutput(toLog, marker);
        process.stdout.write(`${out}\n`);
    },

    info: function(toLog) {
        let marker = colors.fg.wrap('[~]', colors.colors.ready);
        let out = getOutput(toLog, marker);
        process.stdout.write(`${out}\n`);
    },

    infolight: function(toLog) {
        if (options.logs.infoWeight > 1) {
            let marker = colors.fg.wrap('[~]', colors.colors.ready);
            let out = getOutput(toLog, marker);
            process.stdout.write(`${out}\n`);
        }
    },

    infoheavy: function(toLog) {
        if (options.logs.infoWeight > 2) {
            let marker = colors.fg.wrap('[~]', colors.colors.ready);
            let out = getOutput(toLog, marker);
            process.stdout.write(`${out}\n`);
        }
    },

    ready: function(toLog) {
        let marker = colors.fg.wrap('[+]', colors.colors.success);
        let out = getOutput(toLog, marker);
        process.stdout.write(`${out}\n`);
    },

    warn: function(toLog) {
        let marker = colors.fg.wrap('[-]', colors.colors.warning);
        let out = getOutput(toLog, marker, true);
        process.stdout.write(`${out}\n`);
    },

    warnlight: function(toLog) {
        if (options.logs.warnWeight > 1) {
            let marker = colors.fg.wrap('[-]', colors.colors.warning);
            let out = getOutput(toLog, marker, true);
            process.stdout.write(`${out}\n`);
        }
    },

    warnheavy: function(toLog) {
        if (options.logs.warnWeight > 2) {
            let marker = colors.fg.wrap('[-]', colors.colors.warning);
            let out = getOutput(toLog, marker, true);
            process.stdout.write(`${out}\n`);
        }
    },

    error: function(error) {
        let marker = colors.fg.wrap('[!]', colors.colors.error);
        let content;
        if (error instanceof Error) { content = error.stack }
        else { content = error }
        process.stdout.write(`${getOutput(content, marker)}\n`);
    },

    errorlight: function(error) {
        if (options.logs.errorWeight > 1) {
            let marker = colors.fg.wrap('[!]', colors.colors.error);
            let content;
            if (error instanceof Error) { content = error.stack }
            else { content = error }
            process.stdout.write(`${getOutput(content, marker)}\n`);
        }
    },

    errorheavy: function(error) {
        if (options.logs.errorWeight > 2) {
            let marker = colors.fg.wrap('[!]', colors.colors.error);
            let content;
            if (error instanceof Error) { content = error.stack }
            else { content = error }
            process.stdout.write(`${getOutput(content, marker)}\n`);
        }
    }
}

let client = new Discord.Client();

let imports = {
    client: client,
    syncFs: syncFs,
    config: {},
    modules: {},
    commands: {
        functions: {},
        configs: {},
        permissions: {},
        aliases: {},
        methods: {}
    },

    parseMessage: require('./parseMessage.js'),

    economy: {},

    core: {},

    gets: {},
    sets: {}
}

let excluded = {
    permissions: [],
    parameters: []
}

let just = {
    commands: async function() {
        let total = 0;
        async function scavenge(path) {
            let items = await readDir(path);
            for (let i = 0; i < items.length; i++) {
                items[i] = `${path}/${items[i]}`;
                if (await isFolder(items[i])) { await scavenge(items[i]) }
                else {
                    items[i] = items[i].split('/src').join('');
                    let command = require(items[i]);
                    if (command.config.params && command.config.params.length > 0 && !(command.config.params[0] instanceof Array)) { command.config.params = [command.config.params] }
                    if (!(command.command instanceof Array)) { command.command = [command.command] }
                    // let name = path.split('/')[path.split('/').length - 1].split('.')[0];
                    let name = items[i].split('/')[items[i].split('/').length - 1].split('.')[0];
                    if (command.config.aliases) { for (let a = 0; a < command.config.aliases.length; a++) { imports.commands.aliases[command.config.aliases[a]] = name } }
                    if (!command.config.permissions) { command.config.permissions = [] }
                    imports.commands.configs[name] = command.config;
                    imports.commands.functions[name] = command.command;
                    total += 1;
                }
            }
        }

        await scavenge(`./src/commands`);
        return total;
    },

    permissions: async function() {
        let count = 0;
        let permissions = require(`./permissions.js`);
        function recur(base, perm, dotnote = '') {
            for (let p in perm) {
                let permDotnote = dotnote;
                if (permDotnote == '') { permDotnote = p }
                else { permDotnote += `.${p}` }
                
                if (typeof perm[p] === 'function') { base[p] == perm[p]; count++; }
                else { base[p] = {}; recur(base[p], perm[p], permDotnote) }
                base[p] = perm[p]
            }
        }

        recur(imports.commands.permissions, permissions);
        return count;
    },

    daemons: async function() {
        let daemons = await readDir(`./src/daemons`);
        for (let d = 0; d < daemons.length; d++) { load.daemon(`./daemons/${daemons[d]}`) }
        return daemons.length;
    },

    // if (!doesExist) { imports.commands.methods[p] = parameters[p]; parameterCount++ }
    parameters: async function() {
        let count = 0;
        async function recur(path) {
            let items = await readDir(path);
            for (let i = 0; i < items.length; i++) {
                items[i] = `${path}/${items[i]}`;
                if (await isFolder(items[i])) { await recur(items[i]) }
                else {
                    items[i] = items[i].split('/src').join('');
                    imports.commands.methods[items[i].split('/')[items[i].split('/').length - 1].split('.')[0]] = require(items[i]);
                    count++;
                }
            }
        }

        await recur(`./src/parameters`);
        return count;
    }
}

let load = {
    module: async function(name) {
        let moduleConfig = require(`./modules/${name}/config.json`);
        let returnString = `loaded module "${name}"`;

        function recur(base, obj) {
            for (let i in obj) {
                if (base[i]) {
                    if (typeof base[i] === 'object' && base[i] !== null) {
                        if (typeof obj[i] === 'object' && obj[i] !== null) { recur(base[i], obj[i]) }
                        else { console.error('error overwritting config'); process.exit(); }
                    }

                    else {
                        if (typeof obj[i] === 'object' && obj[i] !== null) { console.error('error overwritting config'); process.exit(); }
                        else { base[i] = obj[i] }
                    }
                }

                else {
                    if (typeof obj[i] === 'object' && obj[i] !== null) {
                        base[i] = {};
                        recur(base[i], obj[i]);
                    }

                    else { base[i] = obj[i] }
                }
            }
        }

        if (moduleConfig.overwrites) { recur(imports.config, moduleConfig.overwrites) }
        if (moduleConfig.gets) { recur(imports.gets, moduleConfig.gets) }
        if (moduleConfig.sets) { recur(imports.sets, moduleConfig.sets) }
        if (await exists(`./src/modules/${name}/commands`)) {
            let total = 0;
            async function scavenge(path) {
                let items = await readDir(path);
                for (let i = 0; i < items.length; i++) {
                    items[i] = `${path}/${items[i]}`;
                    if (await isFolder(items[i])) { await scavenge(items[i]) }
                    else {
                        items[i] = items[i].split('/src').join('');
                        let wasAdded = await load.command(items[i], name);
                        if (wasAdded) { total += 1 }
                    }
                }
            }

            await scavenge(`./src/modules/${name}/commands`);
            returnString += ` > ${total} commands`;
        }

        if (await exists(`./src/modules/${name}/permissions.js`)) {
            let permissionCount = 0;
            let permissions = require(`./modules/${name}/permissions.js`);

            let conflictions = [];

            function recurPerm(base, perm, dotnote = '') {
                for (let p in perm) {
                    let permDotnote = dotnote;
                    if (permDotnote == '') { permDotnote = p }
                    else { permDotnote += `.${p}` }
                    if (base[p]) {
                        if (typeof base[p] === 'object' && typeof perm[p] === 'object') { recurPerm(base[p], perm[p], permDotnote) }
                        else { conflictions.push(permDotnote); break; }
                    }

                    else {
                        if (typeof perm[p] === 'function') { base[p] == perm[p]; permissionCount++; }
                        else { base[p] = {}; recurPerm(base[p], perm[p], permDotnote) }
                        base[p] = perm[p]
                    }
                }
            }

            recurPerm(imports.commands.permissions, permissions);
            
            if (conflictions.length > 0) {
                for (let c = 0; c < conflictions.length; c++) {
                    console.error(`conflicting permission: "${conflictions[c]}"`);
                    console.errorlight(`removing all commands using "${conflictions[c]}"`);
                    excluded.permissions.push(conflictions[c]);
                    for (let cc in imports.commands.configs) {
                        for (let p = 0; p < imports.commands.configs[cc].permissions.length; p++) {
                            if (imports.commands.configs[cc].permissions[p].startsWith(conflictions[c])) {
                                console.errorlight(`\tremoved command "${cc}" from module "${imports.commands.configs[cc].origin}"`);
                                delete imports.commands.configs[cc];
                                delete imports.commands.functions[cc];
                                break;
                            }
                        }
                    }
                }
            }

            returnString += ` > ${permissionCount} permissions`;
        }

        if (await exists(`./src/modules/${name}/parameters.js`)) {
            let parameterCount = 0;
            let parameters = require(`./modules/${name}/parameters.js`);
            for (let p in parameters) {
                let doesExist = false;
                for (let m in imports.commands.methods[p]) {
                    if (p == m) {
                        doesExist = true;
                        console.error(`conflicting parameter type: "${p}"`);
                        console.errorlight(`removing all commands using parameter type: "${p}"`)
                        excluded.parameters.push(p);
                        for (let c in imports.commands.configs) {
                            for (let pp = 0; p < imports.commands.configs[c].params.length; pp++) {
                                if (imports.commands.configs[c].params[pp].type == p) {
                                    console.errorlight(`\tremoved command "${c}" from module "${imports.commands.configs[c].origin}"`);
                                    delete imports.commands.configs[c];
                                    delete imports.commands.functions[c];
                                }
                            }
                        }
                    }
                }

                if (!doesExist) { imports.commands.methods[p] = parameters[p]; parameterCount++ }
            }

            returnString += ` > ${parameterCount} parameter types`;
        }

        if (await exists(`./src/modules/${name}/daemons`)) {
            let daemons = await readDir(`./src/modules/${name}/daemons`);
            for (let d = 0; d < daemons.length; d++) { load.daemon(`./modules/${name}/daemons/${daemons[d]}`) }
            returnString += ` > ${daemons.length} daemons`;
        }

        return returnString;
    },

    command: async function(path, moduleName) {
        let command = require(path);
        //if (arr[0].constructor === Array) { /*...*/ }
        if (command.config.params && command.config.params.length > 0 && !(command.config.params[0] instanceof Array)) { command.config.params = [command.config.params] }
        if (!(command.command instanceof Array)) { command.command = [command.command] }
        
        command.config.origin = moduleName;
        let name = path.split('/')[path.split('/').length - 1].split('.')[0];

        let isExcluded = false;
        for (let p = 0; p < excluded.permissions; p++) {
            for (let pp = 0; p < command.config.permissions.length; pp++) { if (command.config.permissions[pp].startsWith(excluded.permissions[p])) { isExcluded = true; break; } }
            if (isExcluded) { break; }
        }

        if (!isExcluded) {
            for (let p = 0; p < excluded.parameters; p++) {
                for (let pp = 0; pp < command.config.params.length; pp++) {
                    for (let ppp = 0; ppp < command.config.params[pp]; ppp++) {
                        if (command.config.params[pp][ppp].type == excluded.parameters[p]) { isExcluded = true; break; }
                    }
                }
            }
        }

        if (!isExcluded) {
            let aliases = [];
            if (command.config.aliases) { aliases = command.config.aliases }
            if (imports.commands.configs[name]) {
                function conflicts() {
                    let toReturn = null;
                    for (let a = 0; a < aliases.length; a++) {
                        if (!imports.commands.configs[aliases[a]]) { toReturn = aliases[a] }
                    }

                    return toReturn;
                }

                let conflictSubstitute = conflicts();
                if (conflictSubstitute) {
                    console.warn(`conflicting command: "${name}"; reassigning to "${conflictSubstitute}" to prevent confliction`);
                    console.warnlight(`\tfrom module "${imports.commands.configs[name].origin}"`)
                    name = conflictSubstitute;
                    imports.commands.configs[conflictSubstitute] = command.config;
                    imports.commands.functions[conflictSubstitute] = command.command;
                }

                else {
                    console.warn(`conflicting command: "${name}"; no suitable replacement was found`);
                    console.warnlight(`\tfrom module "${imports.commands.configs[name].origin}"`);
                    name = null;
                }
            }

            if (name) {
                for (let a = 0; a < aliases.length; a++) {
                    if (imports.commands.aliases[aliases[a]]) {
                        console.warn(`conflicting alias: "${aliases[a]}" from command "${name}"`);
                        console.warnlight(`\tfrom module "${moduleName}"`)
                        let index = command.config.aliases.indexOf(aliases[a]);
                        if (index != -1) { command.config.aliases.splice(index, 1) }
                    }

                    else { imports.commands.aliases[aliases[a]] = name; }
                }

                if (!command.config.permissions) { command.config.permissions = [] }
                imports.commands.configs[name] = command.config;
                imports.commands.functions[name] = command.command;
            }

            return true;
        }

        else { console.warnlight(`command "${name}" from module "${moduleName}" failed to load due to conflictions`) }
    },

    daemon: async function(path) {
        let daemon = require(path);
        if (daemon.constructor.name === 'AsyncFunction') { await daemon(imports) }
        else { daemon(imports) }
    },

    configs: async function() {
        imports.config.meta = require('./../berry.json');
        let configs = await readDir('./src/config');
        let count = 0;
        for (let c = 0; c < configs.length; c++) {
            if (!configs[c].endsWith(`.example.json`)) {
                imports.config[configs[c].split('.')[0]] = require(`./config/${configs[c]}`);
                count++;
            }
        }

        return `loaded ${count} config files`;
    },

    cores: async function() {
        let count = 0;
        async function recurCore(obj, path) {
            let items = await readDir(`./src/${path}`);
            for (let i = 0; i < items.length; i++) {
                if (await isFolder(`./src/${path}/${items[i]}`)) { obj[items[i]] = {}; await recurCore(obj[items[i]], `${path}/${items[i]}`) }
                else { obj[items[i].split('.')[0]] = require(`./${path}/${items[i]}`); count++; }
            }
        }

        await recurCore(imports.core, `core`);
        return `loaded ${count} cores`;
    }
}

async function start() {
    console.info(await load.configs());
    console.info(await load.cores());
    if (options.modular) {
        let modules = await readDir(`./src/modules`);
        for (let m = 0; m < modules.length; m++) { console.info(await load.module(modules[m])) }
    }

    else {
        console.info(`loaded ${await just.commands()} commands`);
        console.info(`loaded ${await just.parameters()} parameters`);
        console.info(`loaded ${await just.permissions()} permissions`);
        console.info(`loaded ${await just.daemons()} daemons`);
    }

    client.on('ready', async function() {
        if (imports.Data) { await imports.Data.start() }
        console.ready(`logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
    });
}

client.on('error', function(error) { console.error(error) });
client.on('disconnect', function() { console.error(disconnected) });

start();

client.login(token);