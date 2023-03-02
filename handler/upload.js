var crypto = require("crypto");
var ejs = require("ejs");

module.exports = function handleUpload(req,res,parentScope,dbConnector) {
    //console.log(req.headers,req.cookies)
    var users = dbConnector.readJSON("users") || [];
    var sessions = dbConnector.readJSON("sessions") || [];
    /*if(req.method === "POST"){
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
        }
    }*/
    if(sessions.includes(req.cookies.auth)) {
        var fileUploads = dbConnector.readJSON("file-uploads");
        if(req.method === "GET") {
            //console.log(req);
            if(req.query.path) {
                /*for(var i = 0;i < publicBlogPosts.length;i++){
                    if(publicBlogPosts[i].title === req.query.edit){
                        postMetadata = publicBlogPosts[i];
                        postMetadata.public = true;
                    }
                }
                for(var i = 0;i < privateBlogPosts.length;i++){
                    if(privatePosts[i].title === req.query.edit){
                        postMetadata = privateBlogPosts[i];
                        postMetadata.public = false;
                    }
                }*/
            } else {
                ejs.renderFile("templates/upload.ejs",{
                    fileUploads
                },function(err,str) {
                    res.send(str);
                });
            }

        } else {
            if("save" in req.body) {
                /*var 
                dbConnector.writeJSON()*/
            }
        }
    } else {
        res.redirect("admin");
    }

}