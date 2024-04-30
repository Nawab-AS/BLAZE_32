let express = require("express");
var app = require("express")();
var http = require("http").createServer(app);
let io = require("socket.io")(http);
let fs = require("fs");
let ids = [];

app.use(express.static(__dirname + "/public"));
app.use(function (req, res) {
    url = new URL("http://localhost:80"+req.url)
    if (fs.existsSync(__dirname + "/public" + url.pathname)){
    res.sendFile(__dirname + "/public" + req.url);
    } else {
        res.sendFile(__dirname + "/public/404.html");
    }
});

io.on("connection", (socket) => {
    console.log("User connected");
    let id = null;
    socket.on("disconnect", (data) => {
        console.log(id + " has disconnected");
    });

    socket.on("register_new_player", (data) => {
        id = data.id;
        console.log(id + " has registered as a new player");
        ids.push(data.id);
    });

});

http.listen(80, function () {
    console.log("http listening on *:80");
});
