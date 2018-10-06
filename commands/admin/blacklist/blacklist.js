module.exports = function(imports, params) {
    if (imports.settings.blacklist[imports.guild.id] == undefined) {
        imports.settings.blacklist[imports.guild.id] = new Object();
        var json = JSON.stringify(imports.settings.blacklist, null, 4);
        imports.fs.writeFileSync('./data/settings/blacklist.json', json);
    }

    if (params[0] == 'get') {
        if (params[1] != undefined) {
            if (imports.Command.methods.mention(params[1]).pass) {
                var id = imports.Command.methods.mention(params[1]).value;

                if (imports.settings.blacklist[imports.guild.id][id] == undefined) {
                    imports.settings.blacklist[imports.guild.id][id] = new Array();
                    var json = JSON.stringify(imports.settings.blacklist, null, 4);
                    imports.fs.writeFileSync('./data/settings/blacklist.json', json);
                }

                imports.channel.send('```' + JSON.stringify(imports.settings.blacklist[imports.guild.id][id], null, 4) + '```');
            }
        }

        else {
            if (imports.settings.blacklist[imports.guild.id][imports.user.id] == undefined) {
                imports.settings.blacklist[imports.guild.id][imports.user.id] = new Array();
                var json = JSON.stringify(imports.settings.blacklist, null, 4);
                imports.fs.writeFileSync('./data/settings/blacklist.json', json);
            }

            imports.channel.send('```' + JSON.stringify(imports.settings.blacklist[imports.guild.id][imports.user.id], null, 4) + '```');
        }
    }

    else if (params[0] == 'add') {
        if (params[1] != undefined) {
            if (imports.Command.methods.mention(params[1]).pass) {
                var id = imports.Command.methods.mention(params[1]).value;
                if (params[2] != undefined) {
                    var exists = false;
                    for (o in imports.Command.objects) {
                        if (params[2] == imports.Command.objects[o].name) {
                            exists = true;
                        }
                    }
                    
                    if (exists) {
                        if (imports.settings.blacklist[imports.guild.id][id] == undefined) {
                            imports.settings.blacklist[imports.guild.id][id] = new Array();
                            var json = JSON.stringify(imports.settings.blacklist, null, 4);
                            imports.fs.writeFileSync('./data/settings/blacklist.json', json);
                        }

                        var blacklisted = false;
                        for (i in imports.settings.blacklist[imports.guild.id][id]) {
                            if (imports.settings.blacklist[imports.guild.id][id][i] == params[2]) {
                                blacklisted = true;
                            }
                        }

                        if (blacklisted) {
                            imports.channel.send('`"' + params[2] + '" is already blacklisted`');
                        }

                        else {
                            imports.settings.blacklist[imports.guild.id][id].push(params[2]);
                            var json = JSON.stringify(imports.settings.blacklist, null, 4);
                            imports.fs.writeFileSync('./data/settings/blacklist.json', json);
                            imports.channel.send('`command "' + params[2] + '" has been blacklisted for user: ' + imports.guild.members.find('id', id).displayName + '`');
                        }
                    }

                    else {
                        imports.channel.send('`command "' + params[2] + '" was not found`');
                    }
                }

                else {
                    imports.channel.send('`please specify a valid command`');
                }
            }

            else {
                imports.channel.send('`invalid user`');
            }
        }

        else {
            imports.channel.send('`please specify a user and a valid command`');
        }
    }

    else if (params[0] == 'remove') {
        if (params[1] != undefined) {
            if (imports.Command.methods.mention(params[1]).pass) {
                var id = imports.Command.methods.mention(params[1]).value;
                if (params[2] != undefined) {
                    var exists = false;
                    for (o in imports.Command.objects) {
                        if (params[2] == imports.Command.objects[o].name) {
                            exists = true;
                        }
                    }
                    
                    if (exists) {
                        if (imports.settings.blacklist[imports.guild.id][id] != undefined) {
                            var blacklisted = false;
                            var index;
                            for (i in imports.settings.blacklist[imports.guild.id][id]) {
                                if (imports.settings.blacklist[imports.guild.id][id][i] == params[2]) {
                                    blacklisted = true;
                                    index = i;
                                }
                            }

                            if (blacklisted) {
                                var list = new Array();

                                for (i in imports.settings.blacklist[imports.guild.id][id]) {
                                    if (imports.settings.blacklist[imports.guild.id][id][i] != params[2]) {
                                        list.push(imports.settings.blacklist[imports.guild.id][id][i]);
                                    }
                                }

                                imports.settings.blacklist[imports.guild.id][id] = list;
                                var json = JSON.stringify(imports.settings.blacklist, null, 4);
                                imports.fs.writeFileSync('./data/settings/blacklist.json', json);
                                imports.channel.send('`user: ' + imports.guild.members.find('id', id).displayName + ' is no longer blacklisted from using the "' + params[2] + '" command`');
                            }

                            else {
                                imports.channel.send('`command "' + params[2] + '" is not blacklisted for user: ' + imports.guild.members.find('id', id).displayName + '`');
                            }
                        }

                        else {
                            imports.channel.send('`command "' + params[2] + '" is not blacklisted for user: ' + imports.guild.members.find('id', id).displayName + '`');
                        }
                    }

                    else {
                        imports.channel.send('`command "' + params[2] + '" was not found`');
                    }
                }

                else {
                    imports.channel.send('`please specify a valid command`');
                }
            }

            else {
                imports.channel.send('`invalid user`');
            }
        }

        else {
            imports.channel.send('`please specify a user and a valid command`');
        }
    }

    /*if (type == 'get') {
        if (mention != undefined) {
            var isBlacklisted = false;
            var endString = '```';
            for (i in settings.blacklist) {
                if (settings.blacklist[i].guild == guildID) {
                    for (l in settings.blacklist[i].list) {
                        if (settings.blacklist[i].list[l].user == mention) {
                            for (c in settings.blacklist[i].list[l].commands) {
                                isBlacklisted = true;
                                endString += settings.blacklist[i].list[l].commands[c];
                                if (settings.blacklist[i].list[l].commands[c++] != undefined) {
                                    endString += ',\n';
                                }
                            }
                        }
                    }
                }
            }

            if (isBlacklisted) {
                endString += '```';
            }

            else {
                endString = '```' + message.guild.members.find('id', mention).displayName + ' does not have any blacklisted commands```';
            }

            message.channel.send(endString);
        }

        else {
            message.channel.send('```please specify a user```');
        }
    }

    else if (type == 'add') {
        if (mention != undefined) {
            if (command != undefined) {
                var error = false;
                var valid = false;
                for (cc in Command.commands) {
                    if (Command.commands[cc].name == command) {
                        valid = true;
                    }
                }

                for (i in settings.blacklist) {
                    if (settings.blacklist[i].guild == guildID) {
                        var isUser = false;
                        for (l in settings.blacklist[i].list) {
                            if (settings.blacklist[i].list[l].user == mention) {
                                isUser = true;
                            }
                        }

                        if (isUser) {
                            if (valid) {
                                for (l in settings.blacklist[i].list) {
                                    if (settings.blacklist[i].list[l].user == mention) {
                                        var exists = false;
                                        for (c in settings.blacklist[i].list[l].commands) {
                                            for (cc in Command.commands) {
                                                if (settings.blacklist[i].list[l].commands[c] == command) {
                                                    exists = true;
                                                }
                                            }
                                        }

                                        if (!exists) {
                                            settings.blacklist[i].list[l].commands.push(command);
                                        }

                                        else {
                                            error = true;
                                            message.channel.send('```that command is already blacklisted```');
                                        }
                                    }
                                }
                            }

                            else {
                                error = true;
                                message.channel.send('```that command doesn\'t exist```');
                            }
                        }

                        else {
                            if (valid) {
                                settings.blacklist[i].list.push({user: mention, commands: new Array(command)});
                            }
                        
                            else {
                                error = true;
                                message.channel.send('```command not found```');
                            }
                        }
                    }
                }

                if (!error) {
                    var json = JSON.stringify(settings.blacklist);
                    fs.writeFile('./data/settings/blacklist.json', json);
                    message.channel.send('added "' + command + '" to ' + message.guild.members.find('id', mention).displayName + '\'s blacklist');
                }
            }

            else {
                message.channel.send('```please specify a command```');
            }
        }

        else {
            message.channel.send('```please specify a user```');
        }
    }

    else if (type == 'remove') {
        if (command != undefined) {
            if (mention != undefined) {
                var error = false;
                var valid = false;
                for (cc in Command.commands) {
                    if (Command.commands[cc].name == command) {
                        valid = true;
                    }
                }

                for (i in settings.blacklist) {
                    if (settings.blacklist[i].guild == guildID) {
                        var isUser = false;
                        for (l in settings.blacklist[i].list) {
                            if (settings.blacklist[i].list[l].user == mention) {
                                isUser = true;
                            }
                        }

                        if (isUser) {
                            if (valid) {
                                for (l in settings.blacklist[i].list) {
                                    if (settings.blacklist[i].list[l].user == mention) {
                                        var exists = false;
                                        for (c in settings.blacklist[i].list[l].commands) {
                                            for (cc in Command.commands) {
                                                if (settings.blacklist[i].list[l].commands[c] == Command.commands[cc].name) {
                                                    exists = true;
                                                }
                                            }
                                        }

                                        if (exists) {
                                            for (c in settings.blacklist[i].list[l].commands) {
                                                if (settings.blacklist[i].list[l].commands[c] == command) {
                                                    settings.blacklist[i].list[l].commands.splice(c, 1);
                                                }
                                            }
                                        }

                                        else {
                                            error = true;
                                            message.channel.send('```that command has not been blacklisted```');
                                        }
                                    }
                                }
                            }

                            else {
                                error = true;
                                message.channel.send('```that command doesn\'t exist```');
                            }
                        }

                        else {
                            error = true;
                            message.channel.send('```that command has not been blacklisted```');
                        }
                    }
                }

                if (!error) {
                    var json = JSON.stringify(settings.blacklist);
                    fs.writeFile('./data/settings/blacklist.json', json);
                    message.channel.send('removed "' + command + '" from ' + message.guild.members.find('id', mention).displayName + '\'s blacklist');
                }
            }

            else {
                message.channel.send('```please specify a user```');
            }
        }

        else {
            message.channel.send('```please specify a command```');
        }
    }*/
}