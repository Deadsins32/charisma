var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: ['BOT.MASTER'],
        description: 'evaluates the given statement and returns the output',
        hidden: false,
        nsfw: false,
        tags: ['management', 'utility'],
        params: [
            { type: 'string', required: true }
        ]
    },

    command: function(imports, parameters) {
        if (parameters[0].startsWith('object')) {
            var object = JSON.stringify(eval(parameters[0].replace('object', '')), null, 4);
            
            if (object.length > 2000) {
                object = new Buffer(object);
                var attachment = new Discord.Attachment(object, 'eval.json');
                imports.channel.send(attachment);
            }
        
            else {
                imports.channel.send('```json\n' + object + '\n```');
            }
        }
    
        else if (parameters[0].startsWith('return')) {
            imports.channel.send('`' + eval(parameters[0].replace('return', '')) + '`');
        }
    
        else {
            eval(parameters[0]);
        }
    }
}