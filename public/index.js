/*                          Credits

        Animated Top Down Survivor Player By rileygombart
    https://opengameart.org/content/animated-top-down-survivor-player

                            P5.js
                        https://p5js.org

                           socket.io
                       https://socket.io                                 */


const socket = io();
var id;
let ratio;
let keys = {};
var player = { x: 100, y: 100, weapon: "Knife", stance: "idle" };
var anim = {
    "Knife": {},
    "Pistol": {},
    "Shotgun": {},
    "Rifle": {}
}
let tilemap;
let map;

function getPlayerFrame(weapon, stance) {
    let animFrames1 = (frameCount) % anim[weapon][stance].length;
    let img = anim[weapon][stance][animFrames1];
    img.resize(150, 150);
    return img;
}

function getTile(Block) {
    /* 
    ▉
    ▖ ▘ ▗  ▝
    ▙ ▛ ▜ ▟
    ▌ ▐ ▁ ▔
    */
    let i;
    switch (Block) {
        case "▉":
            i = 16;
            break;
        case " ":
            i = -1;
            break;
        case "▗":
            i = 0;
            break;
        case "▁":
            i = 1;
            break;
        case "▖":
            i = 3;
            break;
        case "▐":
            i = 4;
            break;
        case "▛":
            i = 5;
            break;
        case "▜":
            i = 6;
            break;
        case "▌":
            i = 7;
            break;
        case "▙":
            i = 9;
            break;
        case "▟":
            i = 10;
            break;
        case "▝":
            i = 12;
            break;
        case "▔":
            i = 13;
            break;
        case "▘":
            i = 15;
            break;
        default:
            i = Block;
    }

    if (i != -1 && i < 17) {
        return tilemap.get((i * 128) % 512, 128 * Math.floor((i) / 4), 128, 128);
    } else {
        return createImage(128, 128);
    }
}

function BulkloadImage(prefix, index) {
    let images = [];
    for (let i = 0; i < index; i++) {
        images.push(loadImage("images/"+prefix + i + ".png"));

    }
    return images;
}

function preload() {
    // Knife
    anim["Knife"]["idle"] = BulkloadImage("knife/idle/survivor-idle_knife_", 20);
    anim["Knife"]["attack"] = BulkloadImage("knife/meleeattack/survivor-meleeattack_knife_", 15);
    anim["Knife"]["move"] = BulkloadImage("knife/move/survivor-move_knife_", 20);
    tilemap = loadImage("images/tilemap.png");
}

function windowResized() {
    // 1280 x 720
    if (windowWidth < windowHeight) {
        // width is smaller
        ratio = windowWidth / 1280;
    } else {
        // height is smaller
        ratio = windowHeight / 720;
        if (ratio * 1280 > windowWidth) {
            ratio = windowWidth / 1280;
        }
    }
    resizeCanvas(1280 * ratio, 720 * ratio);
}

function getTime() {
    let d = new Date();
    return d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);
}

function setup() {
    createCanvas(100, 100);
    windowResized();
    id = Math.random().toString(36).slice(2);
    frameRate(30);
    angleMode(DEGREES);
    imageMode(CENTER);

    // connecting to server
    socket.emit("register_new_player", { id: id });

    /*
    ▉
    ▖ ▘ ▗  ▝
    ▙ ▛ ▜ ▟
    ▌ ▐ ▁ ▔
    */

    map = [
        ["▗","▁","▁","▁","▖"],
        ["▐", "▛","▔","▜","▌"],
        ["▐", "▌"," " , "▐","▌"],
        ["▐", "▌","▗","▟" ,"▌"],
        ["▐", "▙","▟","▉","▌"],
        ["▝", "▔","▔","▔","▘"]
    ];
}

function draw() {
    update = getTime();
    scale(ratio);
    background(200);
    image(getPlayerFrame(player.weapon, player.stance), player.x, player.y);

    // tilemap
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j<map[i].length;j++){
            image(getTile(map[i][j]), j * 128+2, i * 128+20);
            text(i+","+j, j * 128, i * 128);
        }
    }
}

function mouseDragged() {
    player.x = pos(mouseX); player.y = pos(mouseY);
}

function pos(val) {
    return 1 / ratio * val;
}

function keyPressed(){
    console.log(keyCode);
    keys[keyCode] = true;
}

function keyReleased(){
    keys[keyCode] = false;
}
