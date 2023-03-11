var vm = require("vm");
var fs = require("fs");
var UUID = require("uuid");

var globalDbConnector;
class PluginNode {
    constructor(manifest,path) {
        var _glob = this;
        this.manifest = manifest;
        this.path = path;
        this.eventListeners = [];
        function CMS() {}
        /*Object.defineProperty(CMS,"Plugin",{
            value: {
                on: function on(eventName,eventHandler) {
                    _glob.eventListeners.push({
                        eventName: eventName,
                        eventHandler: eventHandler
                    });
                    //console.log(eventName);
                },
                requestPermission: function requestPermission(permissionName,callback) {
                    //
                }
            }
        })
        Object.defineProperty(CMS,"Logger",{
            value: {
                log: console.log
            }
        })
        this.context = {
            CMS: CMS
        }*/
        CMS.Core = {
            version: {
                major: 0,
                minor: 0,
                patch: 1,
                toString: function toString() {
                    return this.major + "." + this.minor + "." + this.patch;
                }
            }
        }
        CMS.Console = {
            error: console.error,
            log: console.log
        }
        CMS.Logger = {
            error: function log(message) {
                console.log("\x1b[31;1m [ERROR] \x1b[31m" + _glob.manifest.name + " " + message + "\x1b[0m");
            },
            log: function log(message) {
                console.log("\x1b[1m [LOG] \x1b[0m" + _glob.manifest.name + " " + message + "\x1b[0m");
            }
        }
        CMS.Plugin = {
            on: function on(eventName,eventHandler) {
                _glob.eventListeners.push({
                    eventName: eventName,
                    eventHandler: eventHandler
                });
                //console.log(eventName);
            }
        }
        CMS.Permission = {
            on: function on(eventName,eventHandler) {
                _glob.eventListeners.push({
                    eventName: eventName,
                    eventHandler: eventHandler
                });
                //console.log(eventName);
            },
            request: function request(permissionName,callback) {
                return new Promise(function(resolve,reject) {
                    //TODO: Implement Permission Request API
                })
            }
        }
        this.context = {
            CMS: CMS
        }
        vm.createContext(this.context);
        this.mainScript = fs.readFileSync(path + manifest.main,{
            encoding: "utf8"
        })
    }
    run() {
        try {
            vm.runInContext(this.mainScript,this.context);
            this.triggerEvent("activate",{
                name: this.manifest.name,
                version: this.manifest.version,
                timestamp: Date.now(),
                type: "activate"
            })
        } catch(e) {
            console.error("\x1b[31;1m [ERROR] \x1b[31m" + this.manifest.name + " " + e + "\x1b[0m");
        }
    }
    triggerEvent(eventName,event) {
        for(var i of this.eventListeners) {
            if(i.eventName === eventName) {
                console.log("Event triggered: " + eventName);
                i.eventHandler(event);
            }
        }
    }
}

var loadedPlugins = [];

module.exports = {
    loadPlugins: function loadPlugins(dbConnector) {
        globalDbConnector = dbConnector;
        var pluginDb = dbConnector.readJSON("plugins") || {};
        console.log(pluginDb);
        var installAllPlugins = true;
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
                        //var manifest = JSON.parse(fs.readFileSync("././plugins/" + pluginDir[i] + "/manifest.json"));
                        var manifest = pluginDb[pluginUUID].manifest;
                        loadedPlugins.push(new PluginNode(manifest,"././plugins/" + pluginDir[i] + "/"));
                    } catch(e) {
                        console.error("\x1b[31;1m [ERROR] \x1b[31m" + pluginDir[i] + " " + e + "\x1b[0m");
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
                        globalDbConnector.writeJSON("plugins",pluginDb);
                        try {
                            //var manifest = JSON.parse(fs.readFileSync("././plugins/" + pluginDir[i] + "/manifest.json"));
                            var manifest = pluginDb[pluginUUID].manifest;
                            loadedPlugins.push(new PluginNode(manifest,"././plugins/" + pluginDir[i] + "/"));
                        } catch(e) {
                            console.error("\x1b[31;1m [ERROR] \x1b[31m" + pluginDir[i] + " " + e + "\x1b[0m");
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