var Reaction = require('./../../core/Reaction.js');

module.exports = {
    config: {
        permissions: [],
        description: 'give someone a slap',
        hidden: false,
        nsfw: false,
        tags: ['fun'],
        params: [
            { type: 'mention', required: true, name: 'user' }
        ]
    },

    command: function(imports, parameters) { Reaction(imports, 'slap', parameters) }
}