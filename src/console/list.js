var fs = require('fs');
var os = require('os');

module.exports = async function(imports, parameters) {
    if (parameters[0] == 'guilds') {
        var guilds = imports.client.guilds.array();
        for (g in guilds) {
            console.log(`${guilds[g].name} (${guilds[g].id})`);
        }
    }

    else if (parameters[0] == 'channels') {
        var guild = imports.client.guilds.get(parameters[1]);
        var channels = guild.channels.array();
        for (c in channels) {
            if (channels[c].type == 'text') {
                console.log(`${channels[c].name} (${channels[c].id})`);
            }
        }
    }

    else if (parameters[0] == 'messages') {
        var guild = imports.client.guilds.get(parameters[1]);
        var channel = guild.channels.get(parameters[2]);
        var number = parameters[3];
        var log;
        if (parameters[4]) {
            log = parameters[4];
        }

        var whole = Math.floor(number / 100);
        var remainder = number % 100;

        var fetched;
        var last;

        var messages = new Array();

        for (var w = 0; w < whole; w++) {
            if (w == 0) {
                fetched = await channel.fetchMessages({limit: 100});

                for (var f = 0; f < fetched.array().length; f++) {
                    var time = fetched.array()[f].createdAt;
                    messages.push(`[${time.getMonth() + 1}/${time.getUTCHours()}/${time.getFullYear()} @ ${time.getHours() + 1}:${time.getMinutes()}] ${fetched.array()[f].author.username}: ${fetched.array()[f].content}`);
                }

                last = fetched.array()[fetched.array().length - 1].id;
            }

            else {
                fetched = await channel.fetchMessages({limit: 100, before: last});
                
                for (var f = 0; f < fetched.array().length; f++) {
                    var time = fetched.array()[f].createdAt;
                    messages.push(`[${time.getMonth() + 1}/${time.getUTCHours()}/${time.getFullYear()} @ ${time.getHours() + 1}:${time.getMinutes()}] ${fetched.array()[f].author.username}: ${fetched.array()[f].content}`);
                }

                last = fetched.array()[fetched.array().length - 1].id;
            }
        }

        if (last) {
            fetched = await channel.fetchMessages({limit: remainder, before: last});
            for (var f = 0; f < fetched.array().length; f++) {
                var time = fetched.array()[f].createdAt;
                messages.push(`[${time.getMonth() + 1}/${time.getUTCHours()}/${time.getFullYear()} @ ${time.getHours() + 1}:${time.getMinutes()}] ${fetched.array()[f].author.username}: ${fetched.array()[f].content}`);
            }
        }

        else {
            fetched = await channel.fetchMessages({limit: remainder});
            for (var f = 0; f < fetched.array().length; f++) {
                var time = fetched.array()[f].createdAt;
                messages.push(`[${time.getMonth() + 1}/${time.getUTCHours()}/${time.getFullYear()} @ ${time.getHours() + 1}:${time.getMinutes()}] ${fetched.array()[f].author.username}: ${fetched.array()[f].content}`);
            }
        }

        messages = messages.reverse();

        if (log) {
            var messageString = messages.join(os.EOL);
            fs.writeFileSync(log, messageString);
            console.log(`successfully logged ${number} messages to ${log}`);
        }

        else {
            for (var m = 0; m < messages.length; m++) {
                console.log(messages[m]);
            }
        }
    }
}

/*async () => {
    let fetched;
    do {
      fetched = await channel.fetchMessages({limit: 100});
      message.channel.bulkDelete(fetched);
    }
    while(fetched.size >= 2);
}*/