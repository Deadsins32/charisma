function recur(obj, path, value) {
    if (path.indexOf('.') > -1) {
        let arr = path.split('.');
        let prop = arr.shift();
        if (!obj[prop]) { obj[prop] = {} }
        else { recur(obj[prop], arr.join('.'), value) }
    }

    else { if (value != undefined) { obj[path] = value } else { obj[path] = true } }
}

module.exports = function(input, passthrough) {
    let pass = true;
    let obj = {
        tags: [],
        attributes: {},
        options: []
    };
    
    let arr = input.split(',');
    for (let a = 0; a < arr.length; a++) { arr[a] = arr[a].trim() }
    for (let a = 0; a < arr.length; a++) {
        let reversed = false;
        if (arr[a].startsWith('!')) { reversed = true; arr[a] = arr.substring(1) }
        if (arr[a].startsWith('#')) {
            arr[a] = arr[a].substring(1);
            if (reversed) { arr[a] = `!${arr[a]}` }
            obj.tags.push(arr[a]);
        }

        else if (arr[a].startsWith('.')) {
            let value;
            if (arr[a].indexOf('=') > -1) { value = arr[a].split('=')[1] }
            arr[a] = arr[a].substring(1);
            let path = arr[a].split('.');
            path = path.filter(Boolean);
            recur(obj.attributes, path.join('.'), value);
        }

        else if (arr[a].startsWith('-')) {
            arr[a] = arr[a].substring(1);
            obj.options.push(arr[a]);
        }
    }

    return { pass: pass, value: obj }
}