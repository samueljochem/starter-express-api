var crypto = require("crypto");
var ejs = require("ejs");
var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var fileUpload = require("express-fileupload");
var DBConnector = require("./db-connector");
var handleAdmin = require("./handler/admin");
var handleEditor = require("./handler/editor");
var handleUpload = require("./handler/upload");
var handleFileUpload = require("./handler/file-upload");

var PORT = process.env.PORT || 3000;

var dbConnector = new DBConnector("filesystem");
dbConnector.connect();
dbConnector.writeJSON("test","data");

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());

app.get("/",function(req,res) {
    res.send("<h1>Hello</h1>");
})
app.use("/static",express.static(__dirname+"/static"/*,{
    setHeaders: function(res,path,stat) {
        console.log(req);
        res.set("X-Content-Type-Options","sniff");
    }
}*/));

app.use("/uploads",express.static(__dirname+"/filesystem/uploads"));
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

app.listen(PORT,function(){
    console.log("Listening");
});