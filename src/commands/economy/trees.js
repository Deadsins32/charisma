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
        description: 'check on your trees',
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        params: [ { type: "string", required: false, name: "specific fruit" } ]
    },

    command: async function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);

        var items = imports.Data.getItems();
        if (parameters[0]) {
            var itemName = parameters[0];
            if (!items[itemName]) {
                if (emoji.hasEmoji(itemName)) {
                    var count = 0;
                    for (var i in items) {
                        if (items[i].emoji == emoji.unemojify(itemName)) { itemName = items[i].name; count += 1; }
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
                            var embedArr = new Array();
                            var date = new Date();
                            var now = date.getTime();
                            for (var i = 0; i < trees[itemName].length; i++) {
                                var isGrown = now >= trees[itemName][i].planted + item.growthTime;
                                if (isGrown) {
                                    var isHarvestable = trees[itemName][i].harvestedLast == -1 || now >= trees[itemName][i].harvestedLast + item.harvestTime;
                                    var nextHarvest = 'now';
                                    if (!isHarvestable) {
                                        var when = (trees[itemName][i].harvestedLast + item.harvestTime) - now;
                                        nextHarvest = ` in ${parseDate(when)}`;
                                    }

                                    embedArr.push(`${items[itemName].emoji} | next harvest: **${nextHarvest}**`);
                                }

                                else {
                                    var when = (trees[itemName][i].planted + item.growthTime) - now;
                                    embedArr.push(`${items[itemName].emoji} | fully grown in **${parseDate(when)}**`);
                                }
                            }

                            embed.setDescription(embedArr.join(`\n`));
                        }

                        else { embed.setDescription(`you don't have any ${items[itemName].emoji} trees planted`) }
                    }

                    else { embed.setDescription(`trees of that item doesn't exist`) }
                }

                else { embed.setDescription(`trees of that item doesn't exist`) }
            }

            else { embed.setDescription(`that item doesn't exist`) }
        }

        else {
            var trees = imports.local.user.trees;
            var embedArr = new Array();
            for (var t in trees) {
                var item = items[`${t} seed`];
                var yieldItem = items[t];
                var date = new Date();
                var now = date.getTime();
                var total = 0;
                var grown = 0;
                var harvestable = 0;
                for (var i = 0; i < trees[t].length; i++) {
                    total += 1;
                    var isGrown = now >= trees[t][i].planted + item.growthTime;
                    if (isGrown) {
                        grown += 1;
                        console.log(trees[t][i]);
                        if (trees[t][i].harvestedLast == -1 || now >= trees[t][i].harvestedLast + item.harvestTime) { harvestable += 1 }
                    }
                }

                embedArr.push(`${yieldItem.emoji} - grown: **${grown}**, harvestable: **${harvestable}**, total: **${total}**`);
            }

            if (embedArr.length != 0) { embed.setDescription(embedArr.join(`\n`)) }
            else { embed.setDescription(`you don't have any trees planted`) } 
        }

        imports.channel.send(embed);
    }
}