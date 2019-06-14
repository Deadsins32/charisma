var Discord = require('discord.js');
var emoji = require('node-emoji');

function parseDate(milliseconds) {
    var seconds = Math.floor(milliseconds / 1000);
    var minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    var hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    var days = Math.floor(hours / 24);
    hours = hours % 24;
    var weeks = Math.floor(days / 7);
    days = days % 7;
    var months = Math.floor(weeks / 4);
    weeks = weeks % 4;
    var years = Math.floor(months / 12);
    months = months % 12;

    var suffixes = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];
    var values = [years, months, weeks, days, hours, minutes, seconds];
    var suffs = new Array();
    var vals = new Array();

    for (v in values) {
        if (values[v] != 0) {
            suffs.push(suffixes[v]);
            vals.push(values[v]);
        }
    }

    var arr = new Array();
    for (var v = 0; v < values.length; v++) {
        if (values[v] != 0) {
            //console.log(values[v]);
            var suffix = suffixes[v];
            if (values[v] == 1) { suffix = suffix.slice(0, -1) }
            arr.push(`${values[v]} ${suffix}`);
        }
    }

    var toReturn = arr.join(', ');
    return toReturn;
}

module.exports = {
    config: {
        permissions: [],
        description: 'harvest your plants',
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        params: [ { type: "string", required: true, name: "crop" } ]
    },

    command: async function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);

        var items = imports.Data.getItems();
        var itemName = parameters[0];
        if (!items[itemName]) {
            if (emoji.hasEmoji(itemName)) {
                var count = 0;
                for (var i in items) {
                    if (items[i].emoji == emoji.unemojify(itemName)) {
                        itemName = items[i].name;
                        count += 1;
                    }
                }

                if (count > 1) { itemName = undefined }
            }
        }

        if (items[itemName]) {
            if (items[`${itemName} seed`]) {
                var item = items[`${itemName} seed`];
                if (item.plantType == 'tree') {
                    var trees = imports.local.user.trees;
                    if (trees[itemName]) {
                        var date = new Date();
                        var now = date.getTime();
                        var grown = 0;
                        var harvestable = 0;
                        var toYield = 0;
                        for (var i = 0; i < trees[itemName].length; i++) {
                            if (now >= trees[itemName][i].planted + item.growthTime) {
                                grown += 1;
                                if (trees[itemName][i].harvestedLast == -1 || now >= trees[itemName][i].harvestedLast + item.harvestTime) {
                                    harvestable += 1;
                                    trees[itemName][i].harvestedLast = now;
                                    toYield += Math.floor(Math.random() * ((item.maxYield - item.minYield) + 1)) + item.minYield;
                                }
                            }
                        }
                    
                        if (grown > 0) {
                            if (harvestable > 0) {
                                await imports.Data.inventory.addItem(imports.user.id, itemName, toYield);
                                embed.setDescription(`you harvested ${harvestable} of your ${items[itemName].emoji} ${itemName} trees and got **${toYield} ${items[itemName].emoji}**`);
                            }

                            else { embed.setDescription(`you don't have any ${items[itemName].emoji} trees that are ready for harvesting`) }
                        }

                        else { embed.setDescription(`you don't have any fully grown ${items[itemName].emoji} trees`) }
                    }

                    else { embed.setDescription(`you don't have any ${items[itemName].emoji} trees planted`) }
                }
            }

            else { embed.setDescription(`crops of that item don't exist`) }
        }

        else { embed.setDescription(`that item doesn't exist`) }

        imports.channel.send(embed);
    }
}