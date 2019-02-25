$('.dropdown').on('show.bs.dropdown', function() {
    $(this).find('.dropdown-menu').first().stop(true, true).slideDown();
});

$('.dropdown').on('hide.bs.dropdown', function() {
    $(this).find('.dropdown-menu').first().stop(true, true).slideUp();
});

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

async function init() {
    await commandQuery();
    expChart();
}

init();