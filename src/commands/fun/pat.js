var Reaction = require('./../../core/Reaction.js');

module.exports = {
    config: {
        permissions: [],
        description: 'gives the person of your choosing a nice pat on the head',
        hidden: false,
        nsfw: false,
        tags: ['fun'],
        params: [
            { type: 'mention', required: true, name: 'user' }
        ]
    },

    command: function(imports, parameters) { Reaction(imports, 'pat', parameters) }
}