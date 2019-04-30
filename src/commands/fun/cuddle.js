var Reaction = require('./../../core/Reaction.js');

module.exports = {
    config: {
        permissions: [],
        description: 'gives the person of your choosing some nice cuddles',
        hidden: false,
        nsfw: false,
        tags: ['fun'],
        params: [
            { type: 'mention', required: true, name: 'user' }
        ]
    },

    command: function(imports, parameters) { Reaction(imports, 'cuddle', parameters) }
}