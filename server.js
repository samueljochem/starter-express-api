var crypto = require("crypto");
var ejs = require("ejs");
var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var fileUpload = require("express-fileupload");
var DBConnector = require("./db-connector");
var Plugins = require("./handler/plugins");
var handleAdmin = require("./handler/admin");
var handleEditor = require("./handler/editor");
var handleUpload = require("./handler/upload");
var handleFileUpload = require("./handler/file-upload");


var PORT = process.env.PORT || 3000;

var dbConnector = new DBConnector("filesystem");
dbConnector.connect();
dbConnector.writeJSON("test","data");

app.disable("x-powered-by");
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());

app.use(function(req,res,next) {
    if(req.originalUrl !== "/" && req.originalUrl.endsWith("/")) {
        res.redirect(req.originalUrl.substring(0,req.originalUrl.length - 1));
        return false;
    } else {
        var users = dbConnector.readJSON("users") || [];
        var sessions = dbConnector.readJSON("cSessions") || {};
        if(req.cookies.auth in sessions) {
            req.user = {
                loggedIn: true
            };
        } else {
            req.user = {
                loggedIn: false
            };
        }
        next();
    }
})

app.get("/",function(req,res) {
    res.send("<h1>Hello</h1>");
})
app.use("/static",express.static(__dirname + "/static"));
app.use("/uploads",express.static(__dirname + "/filesystem/uploads"));
app.use("/admin*",function(req,res,next) {
    console.log(req.path,req.pathname,req.originalUrl,req.user);
    if(req.originalUrl.endsWith("/")) {
        res.redirect(req.originalUrl.substring(0,req.originalUrl.length - 1));
    } else {
        if(req.originalUrl === "/admin") {
            next();
        } else {
            res.send("👌");
        }
    }

})
app.get("/admin",function(req,res) {
    handleAdmin(req,res,this,dbConnector);
})
app.post("/admin",function(req,res) {
    handleAdmin(req,res,this,dbConnector);
})
app.get("/edit",function(req,res) {
    handleEditor(req,res,this,dbConnector);
    /*ejs.renderFile("templates/editor.ejs",function(err,str) {
        res.send(str);
    });*/
})
app.post("/edit",function(req,res) {
    handleEditor(req,res,this,dbConnector);

    /*ejs.renderFile("templates/editor.ejs",function(err,str) {
        res.send(str);
    });*/
})

app.get("/upload",function(req,res) {
    handleUpload(req,res,this,dbConnector);
    /*ejs.renderFile("templates/editor.ejs",function(err,str) {
        res.send(str);
    });*/
})
app.post("/upload",function(req,res) {
    handleFileUpload(req,res,this,dbConnector);

    /*ejs.renderFile("templates/editor.ejs",function(err,str) {
        res.send(str);
    });*/
})

app.get("/file-upload",function(req,res) {
    handleFileUpload(req,res,this,dbConnector);
    //console.log(req);
})

app.post("/file-upload",function(req,res) {
    handleFileUpload(req,res,this,dbConnector);
    //console.log(req);
})

app.all("*",function(req,res){
    res.status(404).send("<style>h1{text-align:center;}body{background-image:url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif');background-size:cover;background-repeat:no-repeat;}</style><h1>Error 404!</h1>")
})

app.listen(PORT,function() {
    console.log("Listening");
    Plugins.loadPlugins(dbConnector);
});