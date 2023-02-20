var crypto = require("crypto");
var ejs = require("ejs");

module.exports = function handleAdmin(req,res,parentScope,dbConnector){
    console.log(req.headers,req.cookies)
    var users = dbConnector.readJSON("users")||[];
    var sessions = dbConnector.readJSON("sessions")||[];
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
                        sessions.push(uuid);
                        dbConnector.writeJSON("sessions",sessions);
                        res.cookie("auth",uuid);
                    }
                }
            }
        }else if("logout" in req.body){
            var index = sessions.indexOf(req.cookies.auth);
            if (index !== -1) {
                sessions.splice(index, 1);
            }
            dbConnector.writeJSON("sessions",sessions);
            loggedIn = false;
        }
    }
    if(sessions.includes(req.cookies.auth)){
        loggedIn = true;
    }
    ejs.renderFile("templates/admin.ejs",{
        loggedIn
    },function(err,str) {
        res.send(str);
    });
}