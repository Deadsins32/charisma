module.exports = function(imports) {
    imports.client.on('message', function(message) {
        try { imports.parseMessage(imports, message) }
        catch(error) { console.error(error) }
    });
}