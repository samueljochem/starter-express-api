/**
 * Toggles the dev mode
 */
var DEV = true;

class CMSRunner {
    static _child_process = require("child_process");
    static _process;
    static _running = false;
    static start() {
        this._process = this._child_process.fork("./server.js",["DEV="+DEV]);
        this._running = true;

    }
    static restart() {
        if(this._running) {
            console.log("Restarting")
            this._running = false;
            this._process.kill();
            this.start();
        }
    }
}

CMSRunner.start();
if(DEV) {
    setInterval(function() {
        CMSRunner.restart();
    },5000);
}