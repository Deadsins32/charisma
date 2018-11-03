var fs = require('fs');
var enabled = require('./../flavors/enabled.json');
var accentbank = require('./../flavors/accentbank.json');

module.exports = {
    get: function(flavor) {
        var output = null;
        var root = fs.readdirSync('./flavors/');

        for (r in root) {
            if (!root[r].endsWith('.json')) {
                if (root[r] == flavor) {
                    output = new Object();
                    var files = fs.readdirSync('./flavors/' + flavor + '/');
                    for (f in files) {
                        var current = fs.readFileSync('./flavors/' + flavor + '/' + files[f], 'utf8');
                        var json = JSON.parse(current, 'utf8');
                        output[files[f].split('.json')[0]] = json;
                    }
                }
            }
        }

        return output;
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