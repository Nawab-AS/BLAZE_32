function setup(){
    createCanvas(800,800);
}

class polygon {
    constructor(points){
        this.points = points;
        this.lines = [];
        
        for (let i = 0; i<points.length-1; i++){
            let p1 = points[i];
            let p2 = points[i+1];
            let m = (p2.y-p1.y)/(p2.x-p1.x);
            //let b = 
        }
    }

    draw(){
        beginShape();
        for(let i = 0; i<this.points.length; i++){
            vertex(this.points[i].x, this.points[i].y);
        }
        endShape(CLOSE);
    }

    checkCollision(x, y){

    }
}
