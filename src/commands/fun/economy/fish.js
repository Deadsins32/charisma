var Discord = require('discord.js');
var emoji = require('node-emoji');

String.prototype.replaceAll = function(str1, str2, ignore) { return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2) } 

function get(input) {
    var array = [];
    for(var item in input) { if ( input.hasOwnProperty(item) ) { for( var i=0; i<input[item]; i++ ) { array.push(item) } } }
    return array[Math.floor(Math.random() * array.length)];
}

module.exports = {
    config: {
        permissions: [],
        description: 'go fishing!',
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        cooldown: 60000,
    },

    command: async function(imports, parameters) {
        var embed = new Discord.RichEmbed();
        embed.setColor(imports.local.guild.colors.accent);

        let pole = await imports.Data.inventory.item.key.get(imports.user.id, 'fishing pole');
        let table = imports.economy.tables.fishing.default;

        let items = imports.economy.items;

        if (pole) {
            let roll = get(table);
            if (roll != 'nothing') {
                let meta = {};
                if (roll == 'loot bag') {
                    let lootTable = imports.economy.tables.lootBag.fishing;
                    let contents = [];
                    meta.items = {};

                    let count = Math.floor(Math.random() * 5) + 3;
                    for (let c = 0; c < count; c++) {
                        let bagRoll = get(lootTable);
                        contents.push(bagRoll);
                    }

                    for (let c = 0; c < contents.length; c++) {
                        if (!meta.items[contents[c]]) { meta.items[contents[c]] = [] }
                        meta.items[contents[c]].push({});
                    }
                }

                await imports.Data.inventory.item.add(imports.user.id, roll, meta);
                embed.setDescription(`you caught a ${items[roll].emoji}`);
            }

            else { embed.setDescription(`you didn't catch anything ;-;`) }
        }

        else { imports.local.user.cooldowns.fish = -1; embed.setDescription(`you don't have a :fishing_pole_and_fish:`); }

        let newDescription = embed.description;
        let split = newDescription.split(' ');
        for (let s = 0; s < split.length; s++) {
            for (let i in items) {
                if (split[s].split('x')[0] == items[i].emoji) {
                    let obtained = await imports.Data.inventory.item.obtained.get(imports.user.id, items[i].name);
                    if (obtained == 1) { newDescription = newDescription.replace(split[s], `${split[s]} (${items[i].name})`); embed.setDescription(newDescription); }
                }
            }
        }
        
        embed.setDescription(newDescription);

        imports.channel.send(embed);
    }
}