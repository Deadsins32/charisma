module.exports = function(imports, guild) {
    if (imports.Guild.get(guild.id) == null) {
        imports.Guild.add(guild.id);
    }
}