let express = require("express");
var app = require("express")();
var http = require("http").createServer(app);
let io = require("socket.io")(http);
let fs = require("fs");
let ids = [];
let tick = 0;

app.use(express.static(__dirname + "/public"));
app.use(function (req, res) {
    if (fs.existsSync(__dirname + "/public" + req.url)){
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
        io.emit("player_disconnected", { id: id });
    });

    socket.on("register_new_player", (data) => {
        id = data.id;
        console.log(id + " has registered as a new player");
        ids.push(data.id);
        socket.emit("delay" + id, { ticks: tick });
    });

    socket.on("pos", (data) => {
        io.emit("player_update", data);
    });

});

http.listen(80, function () {
    console.log("http listening on *:80");
});

setInterval(() => { tick=(tick+1)%30; }, 1000 / 30);