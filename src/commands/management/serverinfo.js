var Discord = require('discord.js');
var request = require('request');
var average = require('image-average-color');

async function getBuffer(url) {
    return new Promise(function(resolve, reject) {
        request({ url, encoding: null }, function(error, response, buffer) {
            if (error) { reject(error) }
            else { resolve(buffer) }
        });
    });
}

async function getAverage(buffer) {
    return new Promise(function(resolve, reject) {
        average(buffer, function(error, color) {
            if (error) { reject(error) }
            else { resolve(color) }
        });
    });
}

function toHex(r, g, b) {
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    }

    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

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

    var output = '';

    for (var v = 0; v < vals.length; v++) {
        if (v != vals.length-1) {
            if (vals[v] > 1) {
                output += vals[v] + ' ' + suffs[v] + ', ';
            }
            
            else {
                output += vals[v] + ' ' + suffs[v].substring(0, suffs[v].length - 1) + ', ';
            }
        }
        else {
            if (vals[v] > 1) {
                output += 'and ' + vals[v] + ' ' + suffs[v];
            }

            else {
                output += 'and ' + vals[v] + ' ' + suffs[v].substring(0, suffs[v].length - 1);
            }
        }
    }
    return output;
}

module.exports = {
    config: {
        permissions: [],
        description: 'gets some nice server info',
        hidden: false,
        nsfw: false,
        tags: ['utility', 'fun'],
        params: []
    },

    command: async function(imports) {
        var embed = new Discord.RichEmbed();
        var guild = imports.guild;
        var guildIconBuff = await getBuffer(guild.iconURL);
        var average = await getAverage(guildIconBuff);
        var averageHex = toHex(average[0], average[1], average[2]);
        embed.setColor(averageHex);
    
        embed.setAuthor(guild.name);
        embed.addField('ID', guild.id, true);
        embed.addField('owner', `${guild.owner.user.username}#${guild.owner.user.discriminator} (${guild.ownerID})`, true);
        embed.setThumbnail(guild.iconURL);
        var created = guild.createdAt;
        embed.addField('server created', parseDate(Date.now() - created) + ' ago');
        embed.addField('roles', guild.roles.array().length, true);
        embed.addField('channels', guild.channels.array().length, true);
        embed.addField('members', guild.members.array().length, true);
        imports.channel.send(embed);
    }
}