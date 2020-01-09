var Discord = require('discord.js');

function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

module.exports = {
    config: {
        permissions: [],
        description: `see what's in the shop!`,
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        params: [
            { type: 'string', required: false, name: 'search | page' },
            { type: 'number', required: false, name: 'page (only if applicable)' }
        ]
    },

    command: async function(imports, parameters) {
        let embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);
        embed.setTitle('shop');

        let items = imports.economy.items;
        let shoppables = {};
        for (let i in items) {
            if (items[i].shoppable) {
                if (imports.shop.isAvailable(items[i])) {
                    shoppables[i] = clone(items[i]);
                    shoppables[i].value = imports.shop.getPrice(items[i]);
                }
            }
        }

        let page = 0;
        if (parameters[0]) {
            if (!isNaN(parameters[0])) { page = parseInt(parameters[0]) - 1 }
            else {
                for (let s in shoppables) { if (!shoppables[s].tags.includes(parameters[0])) { delete shoppables[s] } }
                if (parameters[1]) { if (!isNaN(parameters[1])) { page = parseInt(parameters[1]) - 1 } }
            }
        }

        let shoppableArray = new Array();
        for (var s in shoppables) { shoppableArray.push(shoppables[s]) }

        let resultArray = new Array();
        let maxPage = Math.ceil(shoppableArray.length / 20) - 1;
        if (page > maxPage) { embed.setDescription(`please specify a smaller page number`) }
        else {
            for (var i = 0; i < 20; i++) {
                if (shoppableArray[(page * 20) + i]) {
                    resultArray.push(`${shoppableArray[(page * 20) + i].emoji} ${shoppableArray[(page * 20) + i].name} : **$${shoppableArray[(page * 20) + i].value}**`);
                }
            }
        }

        embed.setDescription(resultArray.join('\n'));
        if (maxPage != 0) { embed.setFooter(`page ${page+1}/${maxPage+1}`) }
        if (!embed.description) { embed.setDescription(`no items match your query`); embed.setTitle(''); }
        imports.channel.send(embed);
    }
}