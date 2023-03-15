var crypto = require("crypto");
var ejs = require("ejs");

module.exports = function handleFileUpload(req,res,parentScope,dbConnector) {
    //console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
    //console.log(req.headers,req.cookies)
    var users = dbConnector.readJSON("users") || [];
    //var sessions = dbConnector.readJSON("sessions") || [];
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
    if(req.user.loggedIn/*sessions.includes(req.cookies.auth)*/) {
        var fileUploads = /*dbConnector.readJSON("file-uploads") || */{
            type: "folder",
            childs: {
                images: {
                    type: "folder",
                    childs: {}
                },
                "test.html": {
                    type: "file",
                    mime: "text/html",
                    size: 0
                }
            }
        };
        function splitPath(path) {
            console.log("CUR_PATH",path);
            path = path.replaceAll(/(^\/|\/$)/g,"");
            return path.split(/[/\\]/) || [path];
        }

        function getPathInfo(path,files) {
            path = splitPath(path);
            console.log(path);
            var currentPos = files;
            for(var i of path) {
                if(typeof currentPos.childs[i] === "object" && !!currentPos.childs[i]) {
                    currentPos = currentPos.childs[i];
                } else {
                    return currentPos;
                }
            }
            return currentPos;
        }

        function setPathInfo(path,files,info) {
            path = splitPath(path);
            var currentPos = files;
            for(var i = 0; i < path.length; i++) {
                console.log((i == path.length - 1),!(path[i] in currentPos.childs),currentPos);
                if(i == path.length - 1) {
                    currentPos.childs[path[i]] = info;
                    console.log(path,i);
                    return files;
                }
                if(!(path[i] in currentPos.childs)) {
                    console.log("Not complete",path[i]);
                    currentPos.childs[path[i]] = {
                        type:"folder",
                        childs:{}
                    }
                    //return false;
                }
                currentPos = currentPos.childs[path[i]];
            }
        }

        if(req.method === "POST") {
            //console.log(req);
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
            
            //console.log(req.files);
            var currentPath = req.body["CurrentPath"];
            if(currentPath) {
                if(!currentPath.endsWith("/")){
                    currentPath += "/";
                }
                console.log(currentPath);
                console.log(req.body);
                if(req.body["Delete"]) {
                    var deleteFile = currentPath + req.body["Delete"];
                    //dbConnector.writeFile("uploads/" + deleteFile,"");
                    var files = dbConnector.readJSON("file-uploads") || {};
                    //files.childs[deleteFile] = undefined;
                    setPathInfo(deleteFile, files, undefined);
                    dbConnector.writeJSON("file-uploads",files);
                    res.send("Success");
                } else if(req.body["CreateFile"]) {
                    var fileName = currentPath + req.body["CreateFile"];
                    dbConnector.writeFile("uploads" + fileName,"");
                    var files = dbConnector.readJSON("file-uploads") || {};
                    /*files.childs[fileName] = {
                        type: "file",
                        size: 0,
                        modified: Date.now()
                    }*/
                    console.log(JSON.stringify(setPathInfo(fileName, files, {
                        type:"file",
                        size:0,
                        created:Date.now(),
                        modified:Date.now(),
                    }),null,3));
                    dbConnector.writeJSON("file-uploads",files);
                    res.json(files);
                } else if(req.body["CreateFolder"]) {
                    var folderName = currentPath + req.body["CreateFolder"];
                    dbConnector.createFolder("uploads"/* + currentPath*/,folderName);
                    var files = dbConnector.readJSON("file-uploads") || {};
                    /*files.childs[folderName] = {
                        type: "folder",
                        childs: {}
                    };*/
                    setPathInfo(folderName, files, {
                        type:"folder",
                        childs:{}
                    });
                    dbConnector.writeJSON("file-uploads",files);
                    console.log(files);
                    res.send("Success");
                } else if(!req.files) {
                    res.status(400).send("No files were uploaded.");
                } else if(req.files.Upload) {
                    var uploadFile = req.files.Upload;
                    uploadFile.name = currentPath + uploadFile.name;
                    console.log(currentPath,uploadFile.name);
                    dbConnector.writeFile("uploads"/* + currentPath* + "/"*/ + uploadFile.name,uploadFile.data);
                    var files = dbConnector.readJSON("file-uploads") || {};
                    /*files.childs[uploadFile.name] = {
                        type: "file",
                        size: uploadFile.size,
                        modified: Date.now()
                    }*/
                    setPathInfo(uploadFile.name, files, {
                        type:"file",
                        size: uploadFile.size,
                        modified: Date.now()
                    });
                    dbConnector.writeJSON("file-uploads",files);
                    res.send("Success");
                }
            } else {
                res.status(404);
            }

        }else{
            //console.log(req.query);
            var files = dbConnector.readJSON("file-uploads") || {};
            //console.log(getPathInfo(req.query["CurrentPath"], files));
            //console.log("\n\n");
            res.json(JSON.stringify(getPathInfo(req.query["CurrentPath"], files),null,3));
        }
    } else {
        res.redirect("admin");
    }

}