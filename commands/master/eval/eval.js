var Discord = require('discord.js');

module.exports = function(imports, parameters) {
    if (parameters[0].startsWith('object')) {
        var object = JSON.stringify(eval(parameters[0].replace('object', '')), null, 4);
        
        if (object.length > 2000) {
            object = new Buffer(object);
            var attachment = new Discord.Attachment(object, 'eval.json');
            imports.channel.send(attachment);
        }
    
        else {
            imports.channel.send('json```' + object + '```');
        }
    }

    else if (parameters[0].startsWith('return')) {
        imports.channel.send('`' + eval(parameters[0].replace('return', '')) + '`');
    }

    else {
        eval(parameters[0]);
    }
}