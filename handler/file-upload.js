var crypto = require("crypto");
var ejs = require("ejs");

module.exports = function handleFileUpload(req,res,parentScope,dbConnector) {
    console.log(req.headers,req.cookies)
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
        var fileUploads = /*dbConnector.readJSON("file-uploads") || */{
            type:"folder",
            childs:{
                images:{
                    type:"folder",
                    childs:{}
                },
                "test.html":{
                    type:"file",
                    mime:"text/html",
                    size:0
                }
            }
        };
        if(req.method === "POST") {
            console.log(req);
            /*if(req.query.path) {
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
                }*
            } else {
                ejs.renderFile("templates/upload.ejs",{
                    fileUploads
                },function(err,str) {
                    res.send(str);
                });
            }

        } else {*/
            console.log(req.files);
            if(req.body["Delete"]){
                var deleteFile = req.body["Delete"];
                //dbConnector.writeFile("uploads/" + deleteFile,"");
                var files = dbConnector.readJSON("file-uploads")||{};
                files.childs[deleteFile] = undefined;
                dbConnector.writeJSON("file-uploads",files);
                res.send("Success");
            }else if(!req.files){
                res.status(400).send("No files were uploaded.");
            }else if(req.files.Upload){
                var uploadFile = req.files.Upload;
                dbConnector.writeFile("uploads/" + uploadFile.name,uploadFile.data);
                var files = dbConnector.readJSON("file-uploads")||{};
                files.childs[uploadFile.name] = {
                    type:"file",
                    size:uploadFile.size,
                    modified:Date.now()
                }
                dbConnector.writeJSON("file-uploads",files);
                res.send("Success");
            }
        }
    } else {
        res.redirect("admin");
    }

}