module.exports = function(imports, arguments) {
    var textArray = [
        'Certainly',
        'Yes',
        'No',
        'Why would I tell you?',
        'You don\'t want to know...'
    ]
    Math.seedrandom(arguments[0]);
    imports.channel.send(textArray[Math.floor(Math.random() * textArray.length)]);
}