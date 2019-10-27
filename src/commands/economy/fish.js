var Discord = require('discord.js');
var emoji = require('node-emoji');

String.prototype.replaceAll = function(str1, str2, ignore) { return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2) } 

function get(input) {
    var array = [];
    for(var item in input) { if ( input.hasOwnProperty(item) ) { for( var i=0; i<input[item]; i++ ) { array.push(item) } } }
    return array[Math.floor(Math.random() * array.length)];
}

function countInArray(array, what) {
    var count = 0;
    for (var i = 0; i < array.length; i++) { if (array[i] === what) { count++ } }
    return count;
}

module.exports = {
    config: {
        permissions: [],
        description: 'go fishing!',
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        cooldown: 60000,
        params: []
    },

    command: async function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);

        // await imports.Data.inventory.addMoney(imports.user.id, money);
        // await imports.Data.inventory.addItem(imports.user.id, `${item.name} seed`);

        var lootTable = imports.Data.getLootTables().fishing.default;

        var fishingPole = await imports.Data.inventory.getKeyItem(imports.user.id, 'fishing pole');
        if (fishingPole) {
            var roll = get(lootTable);
            if (roll != 'nothing') {
                if (roll != 'loot bag') {
                    await imports.Data.inventory.addItem(imports.user.id, roll);
                    embed.setDescription(`you caught a ${await imports.Data.getItem(roll).emoji}`);
                }

                else {
                    var lootBagTable = imports.Data.getLootTables().lootBag.fishing;

                    var bagContents = [];
                    var contentObj = {};
                    var count = Math.floor(Math.random() * 5) + 3;
                    for (var c = 0; c < count; c++) {
                        var bagRoll = get(lootBagTable);
                        bagContents.push(bagRoll);
                    }

                    for (var l in lootBagTable) {
                        var howMany = countInArray(bagContents, l);
                        if (howMany > 0) { contentObj[l] = howMany }
                    }

                    await imports.Data.inventory.addContainer(imports.user.id, roll, { contents: contentObj });
                    embed.setDescription(`you got a ${await imports.Data.getItem(roll).emoji} with some goodies inside!`);
                }
            }

            else { embed.setDescription(`you didn't catch anything ;-;`) }
        }

        else { imports.local.user.cooldowns.fish = -1; embed.setDescription(`you don't have a :fishing_pole_and_fish:`); }

        var newDescription = embed.description;
        var items = imports.Data.getItems();
        var split = newDescription.split(' ');
        for (var s = 0; s < split.length; s++) {
            for (var i in items) {
                if (split[s].split('x')[0] == items[i].emoji) {
                    var obtained = await imports.Data.inventory.getObtained(imports.user.id, items[i].name);
                    if (obtained == 1) { newDescription = newDescription.replace(split[s], `${split[s]} (${items[i].name})`) }
                }
            }
        }
        
        embed.setDescription(newDescription);

        imports.channel.send(embed);
    }
}