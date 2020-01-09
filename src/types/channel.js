module.exports = function(input, imports) {
    if (imports.Command.methods.channel(input).pass) {
        if (imports.guild.channels.get(imports.Command.methods.channel(input).value)) {
            return imports.Command.methods.channel(input).value;
        }
    }
}