var vm = require("vm");
var fs = require("fs");

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
        CMS.Logger = {
            log:console.log
        }
        CMS.Plugin ={
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
        this.context = {
            CMS:CMS
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
                timestamp: Date.now()
            })
        } catch(e) {
            console.error("\x1b[31;1m [ERROR] \x1b[31m" + this.manifest.name + " " + e + "\x1b[0m");
        }
    }
    triggerEvent(eventName,event) {
        for(var i of this.eventListeners) {
            if(i.eventName === eventName) {
                i.eventHandler(event);
            }
        }
    }
}

var loadedPlugins = [];

module.exports = {
    loadPlugins: function loadPlugins() {
        var pluginDir = fs.readdirSync("././plugins");
        for(var i in pluginDir) {
            var manifest = JSON.parse(fs.readFileSync("././plugins/" + pluginDir[i] + "/manifest.json"));
            loadedPlugins.push(new PluginNode(manifest,"././plugins/" + pluginDir[i] + "/"));
        }
        for(var i of loadedPlugins) {
            i.run();
        }
    }
}