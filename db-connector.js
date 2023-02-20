module.exports = class DBConnector {
    /**
     * 
     * @param {("filesystem"|"mariadb"|"mongodb")} type 
     * @param {string} credentials 
     */
    constructor(type,credentials) {
        this.type = type;
        this.credentials = credentials;
        switch(type) {
            case "filesystem":
                this.db = require("fs");
                break;
            case "mariadb":
                this.db = require("mariadb").MongoClient;
                break;
            case "mongodb":
                this.db = require("mongodb").MongoClient;
                break;
            default:
                this.db = "No DB!";
        }
    }
    connect() {
        switch(this.type) {
            case "filesystem":
                this.connection = this.db;
                break;
            case "mariadb":
                this.connection = this.db.createPool(this.credentials);
                break;
            case "mongodb":
                this.connection = this.db.connect(this.credentials);
        }
    }
    writeFile(location,data) {
        switch(this.type) {
            case "filesystem":
                this.connection.writeFileSync("filesystem/" + location,data);
                break;
        }
    }
    writeJSON(location,data) {
        switch(this.type) {
            case "filesystem":
                this.connection.writeFileSync("filesystem/" + location + ".json",JSON.stringify(data),{
                    encoding: "utf8"
                });
                break;
        }
    }
    readFile(location) {
        switch(this.type) {
            case "filesystem":
                return this.connection.readFileSync("filesystem/" + location);
        }
    }
    readJSON(location) {
        switch(this.type) {
            case "filesystem":
                if(this.connection.existsSync("filesystem/" + location + ".json")) {
                    try {
                        var json = JSON.parse(this.connection.readFileSync("filesystem/" + location + ".json",{
                            encoding: "utf8"
                        }));
                        return json;
                    } catch(e) {
                        return false;
                    }
                } else {
                    return false;
                }
        }
    }
}