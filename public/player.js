function BulkloadImage(prefix, index) {
    let images = [];
    for (let i = 0; i < index; i++) {
        images.push(loadImage("images/" + prefix + i + ".png"));

    }
    return images;
}

function Player() {
    const socket = io();
    this.x = 100;
    this.y = 100;
    this.angle = 0;
    this.speed = 5;
    let id = Math.random().toString(36).slice(2);
    this.weapon = "Knife";
    this.stance = "idle";
    this.keys = { w: 87, a: 65, s: 83, d: 68 };
    this.anim = {
        "Knife": {},
        "Pistol": {},
        "Shotgun": {},
        "Rifle": {}
    }

    this.connectToServer = () => {
        socket.emit("register_new_player", { id: id });
        connect();
    }

    this.loadImages = () => {
        // Knife
        this.anim["Knife"]["idle"] = BulkloadImage("knife/idle/survivor-idle_knife_", 20);
        this.anim["Knife"]["attack"] = BulkloadImage("knife/meleeattack/survivor-meleeattack_knife_", 15);
        this.anim["Knife"]["move"] = BulkloadImage("knife/move/survivor-move_knife_", 20);
    }

    this.move = (mouseX, mouseY) => {
        // translate
        if (keyIsDown(this.keys.w)) {
            this.y -= this.speed;
        } if (keyIsDown(this.keys.a)) {
            this.x -= this.speed;
        } if (keyIsDown(this.keys.s)) {
            this.y += this.speed;
        } if (keyIsDown(this.keys.d)) {
            this.x += this.speed;
        }

        // rotate
        this.angle = atan((mouseY-this.y)/(mouseX-this.x)) +30;
        if (mouseX<this.x){
            this.angle+=180;
        }
        this.angle = (this.angle+360)%360;
    }

    this.draw = () => {
        const animFrames = (frameCount) % this.anim[this.weapon][this.stance].length;
        let img = this.anim[this.weapon][this.stance][animFrames];
        img.resize(150, 150);
        push();
        translate(this.x,this.y);
        rotate(this.angle);
        image(img, 0, 0);
        pop();
    }
}

connect = ()=>{io = () => { location.pathname = "/YouLittleAmateurHacker.jpeg" }}
