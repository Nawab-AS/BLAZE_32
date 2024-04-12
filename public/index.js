/*                          Credits

        Animated Top Down Survivor Player By rileygombart
    https://opengameart.org/content/animated-top-down-survivor-player

                            P5.js
                        https://p5js.org

                           socket.io
                       https://socket.io                                 */

let ratio;
player = new Player();
let tilemap;
let map;

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

function preload() {
    player.loadImages();
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
    frameRate(30);
    angleMode(DEGREES);
    imageMode(CENTER);
    player.connectToServer();

    /*
    ▉
    ▖ ▘ ▗  ▝
    ▙ ▛ ▜ ▟
    ▌ ▐ ▁ ▔
    */
    map = [
        ["▗", "▁", "▁", "▁", "▖"],
        ["▐", "▛", "▔", "▜", "▌"],
        ["▐", "▌", " ", "▐", "▌"],
        ["▐", "▌", "▗", "▟", "▌"],
        ["▐", "▙", "▟", "▉", "▌"],
        ["▝", "▔", "▔", "▔", "▘"]
    ];
}

function draw() {
    // set size
    scale(ratio);
    background(200);
    player.move(mouseX, mouseY);
    player.draw();

    // tilemap
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            image(getTile(map[i][j]), j * 128 + 2, i * 128 + 20);
            text(i + "," + j, j * 128, i * 128);
        }
    }
}

function keyPressed() {
    console.log(keyCode, key);
}

function pos(val) {
    return 1 / ratio * val;
}
