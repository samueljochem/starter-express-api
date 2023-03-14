var crypto = require("crypto");
var ejs = require("ejs");

module.exports = function handleAdmin(req,res,parentScope,dbConnector){
    console.log(req.headers,req.cookies)
    var users = dbConnector.readJSON("users")||[];
    var sessions = dbConnector.readJSON("sessions")||[];
    var cSessions = dbConnector.readJSON("cSessions")||{};
    var loggedIn = false;
    if(users.length === 0){
        //
    }
    if(req.method === "POST"){
        console.log("POST")
        console.log(req.body)
        if("login" in req.body){
            console.log("Login")
            for(var i = 0;i < users.length;i++){
                if(users[i].username === req.body.username){
                    console.log("User exists")
                    var hash = crypto.createHash("sha256");
                    var hashData = hash.update(req.body.password,"utf8");
                    if(users[i].password === hashData.digest("hex")){
                        console.log("Password is correct")
                        loggedIn = true;
                        var uuid = crypto.randomUUID();

                        /*/START OLD
                        sessions.push(uuid);
                        dbConnector.writeJSON("sessions",sessions);
                        //END OLD*/

                        cSessions[uuid] = users[i];
                        dbConnector.writeJSON("cSessions",cSessions);
                        //TODO: secure cookie if TLS
                        res.cookie("auth",uuid,{
                            httpOnly:true
                        });
                    }
                }
            }
        }else if("logout" in req.body){

            /*/START OLD
            var index = sessions.indexOf(req.cookies.auth);
            if (index !== -1) {
                sessions.splice(index, 1);
            }
            dbConnector.writeJSON("sessions",sessions);
            //END OLD*/

            delete cSessions[req.cookies.auth];
            dbConnector.writeJSON("cSessions",cSessions);
            loggedIn = false;
        }
    }
    if(req.cookies.auth in cSessions/*sessions.includes(req.cookies.auth)*/){
        loggedIn = true;
    }
    ejs.renderFile("templates/admin.ejs",{
        loggedIn
    },function(err,str) {
        res.send(str);
    });
}