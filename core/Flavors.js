var fs = require('fs');
var root = fs.readdirSync(__dirname + '/../data/flavors/');

module.exports = {
    get: function(flavor) {
        var output = null;
        for (r in root) {
            if (root[r] == flavor) {
                output = new Object();
                var files = fs.readdirSync(__dirname + '/../data/flavors/' + flavor + '/');
                for (f in files) {
                    var current = fs.readFileSync(__dirname + '/../data/flavors/' + flavor + '/' + files[f], 'utf8');
                    var jsonObj = JSON.parse(current, 'utf8');
                    output[files[f].split('.json')[0]] = jsonObj;
                }
            }
        }

        return output;
    },

    getFlavors: function() {
        var flavors = require('./../data/flavors/enabled.json');
        return flavors;
    },

    check: function(flavor) {
        var enabled = require('./../data/flavors/enabled.json');
        var passed = false;
        for (e in enabled) {
            if (enabled[e] == flavor) {
                passed = true;
            }
        }

        return passed;
    },

    pick: function(flavor, main, sub) {
        var accentbank = fs.readFileSync(__dirname + '/../data/flavors/accentbank.json', 'utf8');
        var accentbank = JSON.parse(accentbank, 'utf8')[flavor];

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

                var randAccent = accentbank[accent][Math.floor(Math.random() * accentbank[accent].length)];
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