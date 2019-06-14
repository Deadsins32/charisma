async function blog() {
    var index = JSON.parse(await read('./posts/index.json'));
    var vars = getUrlVars();
    if (vars.post) {
        var exists = false;
        for (var i = 0; i < index.length; i++) { if (index[i] == vars.post) { exists = true } }
        if (exists) {
            var post = await read(`./posts/${vars.post}.md`);
            var area = document.getElementById('postArea');
            area.innerHTML = marked(post);
            document.getElementById('postTitle').innerHTML = vars.post;
        }

        else { window.location.href = `?page=blog` }
    }

    else {
        document.getElementById('postBack').classList.add('hidden');
        var list = document.getElementById('postList');
        for (var i = 0; i < index.length; i++) {
           var li = document.createElement('li');
           var anchor = document.createElement('a');
           anchor.setAttribute(`href`, `?page=blog&post=${index[i]}`);
           anchor.innerText = index[i];
           li.appendChild(anchor);
           list.appendChild(li);
        }
    }
}