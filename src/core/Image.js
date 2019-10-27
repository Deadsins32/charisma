var request = require('request');

async function getBuffer(url) {
    return new Promise(function(resolve, reject) {
        request({ url, encoding: null }, function(error, response, buffer) {
            if (error) { reject(error) }
            else { resolve(buffer) }
        });
    });
}

module.exports = {
    getLastImage: async function(imports) {
        var messages = await imports.channel.fetchMessages({limit: 20});
        var imageAttachment;
        for (var m in messages.array()) {
            if (messages.array()[m].attachments.size > 0) {
                var attachment = messages.array()[m].attachments.array()[messages.array()[m].attachments.array().length - 1];
                var filename = attachment.filename;
                var extension = filename.split('.')[filename.split('.').length - 1].toLowerCase();
                if (extension == 'png' || extension == 'jpg' || extension == 'jpeg' || extension == 'gif') {
                    imageAttachment = attachment;
                    break;
                }
            }

            else if (messages.array()[m].embeds.length > 0) {
                var fetchedEmbed = messages.array()[m].embeds[messages.array()[m].embeds.length - 1];
                if (fetchedEmbed.image) {
                    imageAttachment = {
                        url: fetchedEmbed.image.url,
                        filename: fetchedEmbed.image.url.split('/')[fetchedEmbed.image.url.split('/').length - 1].split('?')[0]
                    }
                    break;
                }

                else if (fetchedEmbed.url) {
                    imageAttachment = {
                        url: fetchedEmbed.url,
                        filename: fetchedEmbed.url.split('/')[fetchedEmbed.url.split('/').length - 1].split('?')[0]
                    }
                    break;
                }
            }
        }

        if (imageAttachment) {
            return {
                attachment: imageAttachment,
                buffer: await getBuffer(imageAttachment.url)
            }
        }

        else { return null }
    }
}