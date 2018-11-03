var fs = require('fs');
var enabled = require('./../flavors/enabled.json');
var accentbank = require('./../flavors/accentbank.json');
var flavors = new Object();
var root = fs.readdirSync('./src/flavors/');
for (r in root) {
    if (!root[r].endsWith('.json')) {
        flavors[root[r]] = new Object();
        var files = fs.readdirSync(`./src/flavors/${root[r]}/`);
        for (f in files) { flavors[root[r]][files[f].split('.json')[0]] = require(`./../flavors/${root[r]}/${files[f]}`) }
    }
}

module.exports = {
    get: function(flavor) {
        if (flavors[flavor]) { return flavors[flavor] }
    },

    getFlavors: function() {
        return enabled;
    },

    check: function(flavor) {
        var passed = false;
        for (e in enabled) {
            if (enabled[e] == flavor) {
                passed = true;
            }
        }

        return passed;
    },

    pick: function(flavor, main, sub) {
        var accents = accentbank[flavor];

        var flavorText = module.exports.get(flavor);
        var textArray = flavorText[main][sub];

        var rand = textArray[Math.floor(Math.random() * textArray.length)];

        for (i in rand.split('')) {
            if (rand[i] == '{') {
                var accent = '';
                var running = true;
                var t = i;

                while(running) {
                    t++;
                    if (rand.split('')[t] == '}') {
                        running = false;
                    }

                    else {
                        accent += rand.split('')[t];
                    }
                }

                var randAccent = accents[accent][Math.floor(Math.random() * accents[accent].length)];
                rand = rand.replace('{' + accent + '}', randAccent);
            }
        }

        return rand;
    },

    variables: function(inputString, objectArray) {
        var variableArray = new Array();
        for (i in inputString.split('')) {
            if (inputString.split('')[i] == '[') {
                var variable = '';
                var running = true;
                var t = i;

                while(running) {
                    t++;
                    if (inputString.split('')[t] == ']') {
                        running = false;
                    }

                    else {
                        variable += inputString.split('')[t];
                    }
                }

                variableArray.push(variable);
            }
        }

        for (a in objectArray) {
            for (v in variableArray) {
                if (objectArray[a].name == variableArray[v]) {
                    inputString = inputString.replace('[' + variableArray[v] + ']', objectArray[a].value);
                }
            }
        }

        return inputString;
    }
}