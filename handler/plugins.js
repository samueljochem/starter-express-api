var vm = require("vm");
var fs = require("fs");
var child_process = require("child_process");
var UUID = require("uuid");

var globalDbConnector;
class PluginNode {
    constructor(manifest,path,permissions) {
        this.childProcess = child_process.fork("././handler/plugin-process.js");
        this.childProcess.send({
            type: "init",
            data:{
                manifest: manifest,
                path: path
            }
        });
        this.manifest = manifest;
        this.path = path;
        this.permissions = permissions;
    }
    run() {
        this.childProcess.send({
            type: "run",
            data: {}
        });
        /*try {
            vm.runInContext(this.mainScript,this.context);
            this.triggerEvent("activate",{
                name: this.manifest.name,
                version: this.manifest.version,
                timestamp: Date.now(),
                type: "activate"
            })
        } catch(e) {
            console.error("\x1b[31;1m [ERROR] \x1b[31m" + this.manifest.name + " " + e + "\x1b[0m");
        }*/
    }
    triggerEvent(eventName,event) {
        this.childProcess.send({
            type: "triggerEvent",
            data: {
                eventName: eventName,
                event: event
            }
        });
        /*for(var i of this.eventListeners) {
            if(i.eventName === eventName) {
                console.log("Event triggered: " + eventName);
                i.eventHandler(event);
            }
        }*/
    }
    updatePermission(name,value) {
        this.childProcess.send({
            type: "updatePermissions",
            data: {
                name: name,
                value: value
            }
        });
        this.permissions.name = value;
    }
}

var loadedPlugins = [];

module.exports = {
    loadPlugins: function loadPlugins(dbConnector) {
        globalDbConnector = dbConnector;
        var pluginDb = dbConnector.readJSON("plugins") || {};
        //console.log(pluginDb);
        var installAllPlugins = 0//true;
        /*
            Create an plugin object
            Load the plugin
            Run the plugin
        */
        var pluginObject = {
            manifest: {
                name: "test",
                version: "0.0.1",
                main: "script.js",
                description: "This is a test plugin",
                author: "The CMS Team"
            },
            uuid: UUID.v4(),
            permissions: {
                databse: false,
                file: false,
                user: false,
                theme: false,
                route: false
            },
            path: "",
            activated: false
        };
        var pluginDir = fs.readdirSync("././plugins");
        for(var i in pluginDir) {
            if(fs.statSync("././plugins/" + pluginDir[i] + "").isDirectory()) {
                try {
                    var pluginUUID = fs.readFileSync("././plugins/" + pluginDir[i] + "/uuid.txt");
                    //console.log(pluginUUID);
                    try {
                        var manifest = JSON.parse(fs.readFileSync("././plugins/" + pluginDir[i] + "/manifest.json"));
                        //var manifest = pluginDb[pluginUUID].manifest;
                        loadedPlugins.push(new PluginNode(manifest,"././plugins/" + pluginDir[i] + "/"));
                    } catch(e) {
                        console.error("\x1b[31;1m [3ERROR] \x1b[31m" + pluginDir[i] + " " + e + "\x1b[0m");
                    }
                } catch(e) {
                    if(installAllPlugins) {
                        var pluginUUID = UUID.v4();
                        fs.writeFileSync("././plugins/" + pluginDir[i] + "/uuid.txt",pluginUUID);
                        pluginDb[pluginUUID] = {
                            manifest: JSON.parse(fs.readFileSync("././plugins/" + pluginDir[i] + "/manifest.json")),
                            uuid: pluginUUID,
                            permissions: {
                                databse: false,
                                file: false,
                                user: false,
                                theme: false,
                                route: false
                            },
                            path: "././plugins/" + pluginDir[i] + "/",
                            activated: true
                        };
                        globalDbConnector.writeJSON("plugins",{}/*pluginDb*/);
                        try {
                            //var manifest = JSON.parse(fs.readFileSync("././plugins/" + pluginDir[i] + "/manifest.json"));
                            var manifest = pluginDb[pluginUUID].manifest;
                            loadedPlugins.push(new PluginNode(manifest,"././plugins/" + pluginDir[i] + "/"));
                        } catch(e) {
                            console.error("\x1b[31;1m [2ERROR] \x1b[31m" + pluginDir[i] + " " + e + "\x1b[0m");
                        }
                    } else {
                        console.info("\x1b[34;1m [INFO] \x1b[34m The plugin in " + pluginDir[i] + " is not installed!\x1b[0m");
                    }
                }
            }
        }
        for(var i of loadedPlugins) {
            i.run();
        }
    },
    pluginHandler:function(req,res,parentScope,dbConnector){
        if(req.user.loggedIn){
            if(req.method === "GET"){
                ejs.renderFile("templates/plugin.ejs",{
                    pluginData: dbConnector.readJSON("plugins")
                },function(err,str) {
                    res.send(str);
                });
            }else{
                //TODO: Add POST request handler
                res.redirect("admin");
            }
        }else{
            res.redirect("admin");
        }
    }
}