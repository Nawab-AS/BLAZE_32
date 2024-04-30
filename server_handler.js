let express = require("express");
var app = require("express")();
var http = require("http").createServer(app);
let io = require("socket.io")(http);
let fs = require("fs");
let mappedPages = {};
let error404 = "/404.html";


app.use(express.static(__dirname + "/public"));
app.use(function (req, res) {
    url = new URL("http://localhost:80"+req.url);
    if (mappedPages[url.pathname] != null){
        res.sendFile(__dirname + "/public" + mappedPages[url.pathname]);
    } else if (fs.existsSync(__dirname + "/public" + url.pathname)){
        res.sendFile(__dirname + "/public" + url.pathname);
    } else {res.sendFile(__dirname + "/public"+error404);}
});

exports.run = (port) =>{
    http.listen(port, function () {
        console.log("http listening on http://localhost:"+port);
    });
}
