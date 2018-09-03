module.exports = {
    // START MASTER //
    sudo: require('./commands/sudo.js'),
    say: require('./commands/say.js'),
    // END MASTER //

    // START MANAGEMENT //
    enable: require('./commands/enable.js'),
    disable: require('./commands/disable.js'),
    blacklist: require('./commands/blacklist.js'),
    set: require('./commands/set.js'),
    prune: require('./commands/prune.js'),
    kick: require('./commands/kick.js'),
    ban: require('./commands/ban.js'),
    
    nick: require('./commands/nick.js'),
    // END MANAGEMENT //

    // START FUN //
    anime: require('./commands/anime.js'),
    magicball: require('./commands/ball.js'),
    psychopass: require('./commands/psychopass.js'),
    hug: require('./commands/hug.js'),
    pat: require('./commands/pat.js'),
    kiss: require('./commands/kiss.js'),
    stab: require('./commands/stab.js'),
    // END FUN //

    // START GENERAL //
    help: require('./commands/help.js'),
    get: require('./commands/get.js'),
    raw: require('./commands/raw.js'),
    tree: require('./commands/tree.js'),
    profile: require('./commands/profile.js'),
    // END GENERAL //
}