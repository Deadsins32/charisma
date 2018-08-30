module.exports = function(imports, arguments) {
    var helpEmbed = new imports.Discord.RichEmbed();
    var pageNumber = 1;
    helpEmbed.setAuthor('Command List');
    helpEmbed.setColor(eval('0x' + imports.settings.guilds[imports.guild.id].accentcolor.split('#')[1]));

    var tag = false;
    var next = true;

    if (arguments[0] != undefined) {
        if (!isNaN(arguments[0])) {
            pageNumber = parseInt(arguments[0]);
        }

        else {
            var next = false;
            if (arguments[0] == 'help') {
                imports.channel.send(':unamused:');
            }

            else {
                for (o in imports.Command.objects) {
                    for (t in imports.Command.objects[o].tags) {
                        if (arguments[0] == imports.Command.objects[o].tags[t]) {
                            tag = true;
                        }
                    }
                }

                if (tag) {
                    if (!isNaN(arguments[1])) {
                        pageNumber = parseInt(arguments[1]);
                    }
                }

                else {
                    var index = null;
                    for (o in imports.Command.objects) {
                        if (arguments[0] == imports.Command.objects[o].name) {
                            index = o;
                        }
                    }

                    if (index != null) {
                        var commandEmbed = new imports.Discord.RichEmbed();
                        commandEmbed.setFooter(arguments[0]);
                        commandEmbed.setColor(0xFF2121);

                        var status = imports.Command.get.status(imports, imports.Command.objects[index], imports.settings.blacklist);
                        if (status.blacklisted && !status.master) {
                            if (status.visible) {
                                imports.channel.send('`you are blacklisted from using the "' + arguments[0] + '" command`');
                            }

                            else {
                                imports.channel.send('`command: "' + arguments[0] + '" was not found`');
                            }
                        }

                        else {
                            if (status.usable || status.master) {
                                commandEmbed.addField('description', imports.Command.objects[index].description);
                                commandEmbed.addField('usage', imports.Command.syntax.get(imports.localsettings.guild.prefix, arguments[0]), true);
                                if (imports.Command.objects[index].tags != undefined) {
                                    commandEmbed.addField('tags', JSON.stringify(imports.Command.objects[index].tags), true);
                                }

                                imports.channel.send(commandEmbed);
                            }

                            else {
                                if (status.visible) {
                                    imports.channel.send('`' + JSON.stringify(status.requiredPermissions) + ' is required`');
                                }

                                else {
                                    imports.channel.send('`command: "' + arguments[0] + '" was not found`');
                                }
                            }
                        }
                    }

                    else {
                        imports.channel.send('`command: "' + arguments[0] + '" was not found`');
                    }
                }
            }
        }
    }

    if (next) {
        var max = pageNumber * 10;
        var min = max - 9;

        var counter = min - 1;

        var commandArray = new Array();

        if (tag) {
            for (o in imports.Command.objects) {
                var isTagged = false;
                for (t in imports.Command.objects[o].tags) {
                    if (arguments[0] == imports.Command.objects[o].tags[t]) {
                        isTagged = true;
                    }
                }

                var status = imports.Command.get.status(imports, imports.Command.objects[o], imports.settings.blacklist);
                if (isTagged) {
                    if ((status.visible && status.usable && !status.blacklisted) || status.master) {
                        if (imports.Command.objects[o].name != 'help') {
                            commandArray.push(imports.Command.objects[o]);
                        }
                    }
                }
            }
        }

        else {
            //console.log(imports.Command.get.status(imports, imports.Command.objects[11], imports.settings.blacklist));
            //console.log(imports.Command.objects[11]);
            for (o in imports.Command.objects) {
                var status = imports.Command.get.status(imports, imports.Command.objects[o], imports.settings.blacklist);
                if ((status.visible && status.usable && !status.blacklisted) || status.master) {
                    if (imports.Command.objects[o].name != 'help') {
                        commandArray.push(imports.Command.objects[o]);
                    }
                }
            }
        }

        var max = pageNumber * 10;
        var min = max - 9;
        if (commandArray[max - 1] == undefined) {
            max = commandArray.length;
        }

        var displayedArray = commandArray.slice(min - 1, max);


        for (d in displayedArray) {
            helpEmbed.addField(displayedArray[d].name, displayedArray[d].description);
        }

        var maxPage = Math.ceil(commandArray.length / 10);
        if (pageNumber > maxPage) {
            imports.channel.send('`page "' + pageNumber + '" does not exist`');
        }

        else {
            helpEmbed.setFooter('page ' + pageNumber + '/' + maxPage);
            imports.channel.send(helpEmbed);
        }
    }
}