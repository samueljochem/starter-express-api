var vm = require("vm");
var fs = require("fs");




class PluginNode {
    constructor(manifest,path,permissions) {
        var _glob = this;
        this.manifest = manifest;
        this.path = path;
        this.permissions = permissions;
        this.eventListeners = {
            Core: [],
            Plugin: [],
            Plugins: [],
            Permission: []
        };
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
            memoryUsage:process.memoryUsage,
            cpuUsage:process.cpuUsage,
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
                _glob.eventListeners.Plugin.push({
                    eventName: eventName,
                    eventHandler: eventHandler
                });
                //console.log(eventName);
            }
        }
        CMS.Permission = {
            on: function on(eventName,eventHandler) {
                _glob.eventListeners.Permission.push({
                    eventName: eventName,
                    eventHandler: eventHandler
                });
                //console.log(eventName);
            },
            request: function request(permissionName,callback) {
                _glob.eventListeners.Permission.push({
                    eventName: eventName,
                    eventHandler: eventHandler
                });
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
            this.triggerEvent("Plugin","activate",{
                name: this.manifest.name,
                version: this.manifest.version,
                timestamp: Date.now(),
                type: "activate"
            })
        } catch(e) {
            console.error("\x1b[31;1m [ERROR] \x1b[31m" + this.manifest.name + " " + e + "\x1b[0m");
        }
    }
    triggerEvent(namespace,eventName,event) {
        for(var i of this.eventListeners[namespace]) {
            if(i.eventName === eventName) {
                console.log("Event triggered: " + eventName);
                i.eventHandler(event);
            }
        }
    }
    updatePermission(name, value) {
        if(this.permissions.name !== value && value !== "requested"){
            switch(value) {
                case "granted":
                    this.triggerEvent("Permission","granted",{
                        name: name,
                        allowed: value === "granted",
                        timestamp: Date.now(),
                        type: "granted"
                    });
                    break;
            }
        }
        this.permissions.name = value;
    }
}

var pluginNode;
process.on("message",function(message) {
    switch(message.type) {
        case "init":
            pluginNode = new PluginNode(message.data.manifest,message.data.path);
            break;
        case "run":
            pluginNode.run();
            break;
        case "triggerEvent":
            pluginNode.triggerEvent(message.data.eventName,message.data.event);
            break;
        case "updatePermissions":
            pluginNode.updatePermission(message.data.name,message.data.value);
            break;
        default:
    }
});
//var pluginNode = new PluginNode(manifest,path);