// is anything(always true)
module.exports = function(input, passthrough) {
    var output = { pass: true, value: input };
    return output;
}