module.exports = {
    message: require('./events/message.js'),
    guildCreate: require('./events/guildCreate.js'),
    guildDelete: require('./events/guildDelete.js'),

    guildMemberAdd: require('./events/guildMemberAdd.js'),
    guildMemberRemove: require('./events/guildMemberRemove.js'),

    guildMemberUpdate: require('./events/guildMemberUpdate.js'),
    userUpdate: require('./events/userUpdate.js'),

    //guildBanAdd: require('./events/guildBanAdd.js'),
    //guildBanRemove: require('./events/guildBanRemove.js')
}