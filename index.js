var crypto = require("crypto");
var ejs = require("ejs");
var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var DBConnector = require("./db-connector");
var handleAdmin = require("./handler/admin");
var handleEditor = require("./handler/editor");

var PORT = process.env.PORT || 3000;

var dbConnector = new DBConnector("filesystem");
dbConnector.connect();
dbConnector.writeJSON("test","data");

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res) {
    res.send("<h1>Hello</h1>");
})
app.get("/static",express.static(__dirname + "/static",{
    setHeaders: function(res,path,stat) {
        res.set("X-Content-Type-Options");
    }
}));
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

app.listen(PORT)