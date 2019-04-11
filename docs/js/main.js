$('.dropdown').on('show.bs.dropdown', function() {
    $(this).find('.dropdown-menu').first().stop(true, true).slideDown();
});

$('.dropdown').on('hide.bs.dropdown', function() {
    $(this).find('.dropdown-menu').first().stop(true, true).slideUp();
});

 $('.navbar-collapse').on('click', 'a', null, function() {
    $('.navbar-collapse').collapse('hide');
 });

function navigate(destination, id) {
    var container = document.getElementsByClassName('container')[0];

    var navElement = document.getElementById(id);
    if (navElement) {
        var navItems = document.getElementsByClassName('nav-item');
        for (var i = 0; i < navItems.length; i++) { navItems[i].classList.remove('active') }

        var containerChildren = container.children;
        for (var c = 0; c < containerChildren.length; c++) { containerChildren[c].setAttribute('class', '') }

        navElement.classList.add('active');
        var section = document.getElementById(destination);
        section.setAttribute('class', 'selected');
    }
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){ urlparameter = getUrlVars()[parameter] }
    return urlparameter;
}


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

async function init() {
    var page = getUrlParam('page', 'about');
    if (page == 'about') { navigate(page, 'aboutNav') }
    else { navigate(page, 'usageNav') }
    await commandQuery();
    expChart();
}

init();