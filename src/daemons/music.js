module.exports = function() {
    global.music.instances = new Object();
    global.music.play = function(id, song) {
        if (song) {
            music.instances[id].playing = true;
            var stream = ytdl(music.instances[id].queue[0].url, {filter: 'audioonly'})
            music.instances[id].connection.playStream(stream);
            console.log(music.instances[id].queue[0].url);
            music.instances[id].connection.dispatcher.setVolume(music.instances[id].volume/100);
            music.instances[id].connection.dispatcher.on('end', function(reason) {
                console.log(`ended: ${reason}`);
                if (reason != 'shuffle') {
                    if (music.instances[id]) {
                        music.instances[id].queue.shift();
                        music.play(id, music.instances[id].queue[0]);
                    }
                }
            });

            music.instances[id].connection.dispatcher.on('error', function(error) { console.error(error) });
        }

        else { music[id].playing = false }
    }

    global.music.add = function(id, video) {
        music.instances[id].queue.push({
            title: video.title,
            id: video.id,
            url: video.url
        });

        if (!music.instances[id].playing) { if (music.instances[id].queue.length == 0) { music.play(id, music.instances[id].queue[0]) } }
    }
}