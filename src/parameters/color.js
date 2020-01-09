// is valid hex color code (probably not very well written)
module.exports = function(input, passthrough) {
    var output = { pass: true, value: null };
    var input = input.toLowerCase();

    if (input.startsWith('#')) {
        var input = input.split('#')[1].substring(0, input.split('#')[1].length).toLowerCase();

        if (input.split('').length == 6) {
            for (c in input.split('')) {
                if (
                    input.split('')[c] == '0' ||
                    input.split('')[c] == '1' ||
                    input.split('')[c] == '2' ||
                    input.split('')[c] == '3' ||
                    input.split('')[c] == '4' ||
                    input.split('')[c] == '5' ||
                    input.split('')[c] == '6' ||
                    input.split('')[c] == '7' ||
                    input.split('')[c] == '8' ||
                    input.split('')[c] == '9' ||
                    input.split('')[c] == 'a' ||
                    input.split('')[c] == 'b' ||
                    input.split('')[c] == 'c' ||
                    input.split('')[c] == 'e' ||
                    input.split('')[c] == 'f'
                ) { output.pass = true }

                else { output.pass = false }
            }
        }

        else if (input.split('').length == 3) {
            for (c in input.split('')) {
                if (
                    input.split('')[c] == '0' ||
                    input.split('')[c] == '1' ||
                    input.split('')[c] == '2' ||
                    input.split('')[c] == '3' ||
                    input.split('')[c] == '4' ||
                    input.split('')[c] == '5' ||
                    input.split('')[c] == '6' ||
                    input.split('')[c] == '7' ||
                    input.split('')[c] == '8' ||
                    input.split('')[c] == '9' ||
                    input.split('')[c] == 'a' ||
                    input.split('')[c] == 'b' ||
                    input.split('')[c] == 'c' ||
                    input.split('')[c] == 'e' ||
                    input.split('')[c] == 'f'
                ) { output.pass = true }

                else { output.pass = false }
            }
        }

        else { output.pass = false }

        if (output.pass && input.split('').length == 3) {
            var newInput = '';

            for (cc in input.split('')) {
                newInput += input.split('')[cc];
                newInput += input.split('')[cc];
            }

            input = newInput;
        }
    }

    else { output.pass = false }
    
    if (output.pass) { output.value = input }
    else { output.value = null }
    return output;
}