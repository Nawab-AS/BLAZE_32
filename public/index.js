/*
                            Credits

        Animated Top Down Survivor Player By rileygombart
    https://opengameart.org/content/animated-top-down-survivor-player

                            P5.js
                        https://p5js.org

                          socket.io
                      https://socket.io
*/

const socket = io();
var id;
let ratio;
var animDelay = 0;
let players = {};
var me = { x: 100, y: 100, weapon: "Knife", stance: "idle" };
let animFrames = 0;
var anim = {
    "Knife": {},
    "Pistol": {},
    "Shotgun": {},
    "Rifle": {}
}
let tiles;

function getTile(i){
    return tiles.get((i*128)%512, 128*Math.floor(i/9), 128, 128);
}

function BulkloadImage(prefix, index, fileType) {
    let images = [];
    for (let i = 0; i < index; i++) {
        images.push(loadImage(prefix + i + fileType));

    }
    return images;
}

function preload() {
    // Knife
    anim["Knife"]["idle"] = BulkloadImage("images/knife/idle/survivor-idle_knife_", 20, ".png");
    anim["Knife"]["attack"] = BulkloadImage("images/knife/meleeattack/survivor-meleeattack_knife_", 15, ".png");
    anim["Knife"]["move"] = BulkloadImage("images/knife/move/survivor-move_knife_", 20, ".png");

    anim["Knife"]["reload"] = BulkloadImage("images/knife/idle/survivor-idle_knife_", 20, ".png"); // to stop errors
    tiles = loadImage("images/tilemap.png");
}

function windowResized() {
  // 1280 x 720
  if(windowWidth<windowHeight){
      // width is smaller
      ratio = windowWidth/1280;
  } else {
      // height is smaller
      ratio = windowHeight/720;
      if (ratio*1280>windowWidth){
          ratio = windowWidth/1280;
      }
  }
  resizeCanvas(1280*ratio, 720*ratio);
}

function getTime(){
    let d = new Date();
    return d.setTime( d.getTime() + d.getTimezoneOffset()*60*1000 );
}

function setup() {
    createCanvas(100, 100);
    windowResized();
    id = Math.random().toString(36).slice(2);
    frameRate(30);
    angleMode(DEGREES);
    imageMode(CENTER)

    socket.emit("register_new_player", { id: id });
    socket.on("delay" + id, (data) => { animDelay = data.ticks; });

    socket.on("player_disconnected", disconnect);
    socket.on("player_update", (data) => {
        if (data.id == id) { return; }
        players[data.id] = { x: data.x, y: data.y, id: data.id, weapon: data.weapon, stance: data.stance, tick:getTime() };
    });
}

function disconnect(data) {
    if (data.id in players) {
        console.log(data.id + " has disconnected");
        delete players[data.id];
    }
}

function draw() {
    scale(ratio);
    background(200);
    animFrames++;
    let animFrames1 = (animFrames+animDelay) % anim[me.weapon][me.stance].length;
    image(anim[me.weapon][me.stance][animFrames1], me.x, me.y);
    
    fill(255);
    rect(me.x, me.y, 50, 50);
    push();
    imageMode(CORNER);
    for (let i = 0; i<4;i++){
        for (let j = 0;j<9;j++)
        image(getTile(i*9+j), j*130, i*130);
    }
    pop();
    text("You", me.x, me.y);
    socket.emit("pos", { x: me.x, y: me.y, id: id, weapon: me.weapon, stance: me.stance, tick:getTime()});
    for (let i = 0; i < Object.keys(players).length; i++) {
        let player = players[Object.keys(players)[i]];
        // connection timeout
        if (player.tick + (3*1000)<getTime()){
            delete players[Object.keys(players)[i]];
        }
        // draw player
        let animFrames1 = (animFrames + animDelay) % anim[player.weapon][player.stance].length;
        image(anim[player.weapon][player.stance][animFrames1], player.x, player.y);
        rect(player.x, player.y, 50, 50);
        text(player.id, player.x, player.y);
    }
}

function mouseDragged() {
    me.x = pos(mouseX); me.y = pos(mouseY);
}

function pos(val){
    return 1 / ratio * val;
}
