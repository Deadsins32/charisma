require('seedrandom');

module.exports = {
    parse: function(characterArray) {
        var output = new Array();
        for (i in characterArray) {
            for (c in module.exports.characters) {
                if (characterArray[i] == module.exports.characters.split('')[c]) {
                    if (isOdd(c)) {
                        output.push(1);
                    }

                    else {
                        output.push(0);
                    }
                }
            }
        }

        return output;
    },

    calculate: function(parsedArray) {
        var output = 0;

        for (p in parsedArray) {
            output += parsedArray[p];
        }

        return output / parsedArray.length;
    }
}