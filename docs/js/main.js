$('.dropdown').on('show.bs.dropdown', function() {
    $(this).find('.dropdown-menu').first().stop(true, true).slideDown();
});

$('.dropdown').on('hide.bs.dropdown', function() {
    $(this).find('.dropdown-menu').first().stop(true, true).slideUp();
});

/*$(function(){ 
     var navMain = $("#nav-main");
     navMain.on("click", "a", null, function () {
         navMain.collapse('hide');
     });
 });*/

 $('.navbar-collapse').on('click', 'a', null, function() {
    $('.navbar-collapse').collapse('hide');
 });

async function read(file) {
    return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', file, false);
        request.overrideMimeType("text/plain");
        request.onreadystatechange = function() {
            if (request.readyState === 4) {
                if (request.status === 200 || request.status === 0) {
                    resolve(request.responseText);
                }

                else {
                    reject();
                }
            }

            else {
                reject();
            }
        }

        request.send(null);
    });
}

function navigate(destination, id) {
    var container = document.getElementsByClassName('container')[0];

    var navElement = document.getElementById(id);
    var navItems = document.getElementsByClassName('nav-item');
    for (var i = 0; i < navItems.length; i++) { navItems[i].classList.remove('active') }

    var containerChildren = container.children;
    for (var c = 0; c < containerChildren.length; c++) { containerChildren[c].setAttribute('class', '') }

    navElement.classList.add('active');

    var section = document.getElementById(destination);
    section.setAttribute('class', 'selected');
}

var commands;

async function init() {
    var commandQuery = document.getElementById('commandQuery');
    commands = JSON.parse(await read('commands.json'));
    var tags = new Array();

    for (c in commands) {
        if (commands[c].tags) {
            for (var t = 0; t < commands[c].tags.length; t++) {
                var has = false;
                for (var tt = 0; tt < tags.length; tt++) { if (commands[c].tags[t] == tags[tt]) { has = true } }
                if (!has) { tags.push(commands[c].tags[t]) }
            }
        }
        var commandDiv = document.createElement('div');
        commandDiv.setAttribute('class', 'command');
        commandDiv.setAttribute('name', c);
        
        commandHead = document.createElement('p');
        commandHead.setAttribute('class', 'commandHeader');
        commandHead.innerText = c;

        commandDiv.appendChild(commandHead);
        commandQuery.appendChild(commandDiv);
    }

    var queryTags = document.getElementById('queryTags');
    for (var t = 0; t < tags.length; t++) {
        var divTag = document.createElement('div');
        divTag.setAttribute('class', 'queryTag p-2');
        divTag.setAttribute('onclick', `filterTag('${tags[t]}')`);
        divTag.innerText = tags[t];
        queryTags.appendChild(divTag);
    }
}

function filterTag(tag) {
    var commandQuery = document.getElementById('commandQuery');
    var commandElements = commandQuery.getElementsByClassName('command');
    var filter = document.getElementById('currentFilter');

    var queryTags = document.getElementById('queryTags');
    var tagElements = queryTags.getElementsByClassName('queryTag');

    for (var c = 0; c < commandElements.length; c++) { commandElements[c].classList.remove('hidden') }
    if (filter.getAttribute('tag') == tag) {
        for (var t = 0; t < tagElements.length; t++) { tagElements[t].classList.remove('active') }
        filter.setAttribute('tag', '');
    }

    else {
        var displayCommands = new Array();
        for (c in commands) {
            var exists = false;
            if (commands[c].tags) {
                for (var t = 0; t < commands[c].tags.length; t++) {
                    if (commands[c].tags[t] == tag) { exists = true }
                }
            }

            if (exists) { displayCommands.push(c) }
        }

        for (var t = 0; t < tagElements.length; t++) {
            if (tagElements[t].innerText == tag) {
                tagElements[t].classList.add('active');
            }
        }

        filter.setAttribute('tag', tag);

        for (var c = 0; c < commandElements.length; c++) {
            var name = commandElements[c].getAttribute('name');
            var exists = false;
            for (var d = 0; d < displayCommands.length; d++) {
                if (displayCommands[d] == name) { exists = true }
            }

            if (!exists) { commandElements[c].classList.add('hidden') }
        }
    }
}

init();