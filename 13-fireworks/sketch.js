// Fireworks OOP

let theFireworks = [];
const PARTICLE_PER_FIREWORK = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
}

function draw() {
  background(0);
  
  for (let firework of theFireworks) {
    if (firework.isDead()) {
      let index = theFireworks.indexOf(firework);
      theFireworks.splice(index, 1)
    }
    else {
      firework.update();
      firework.display();
    }
  }
  console.log(theFireworks.length);
}


class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx = random(-5, 5);
    this.dy = random(-5, 5);
    this.radius = 3;
    this.r = 255;
    this.g = 0;
    this.b = 0;
    this.opacity = 255;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.opacity -=2;
  }

  display() {
    fill(this.r, this.g, this.b, this.opacity);
    circle(this.x, this.y, this.radius * 2);
  }

  isDead() {
    return this.opacity <= 0;
  }
}

function mousePressed() {

  for (let i = 0; i < PARTICLE_PER_FIREWORK; i++) {
    let someFirework = new Particle(mouseX, mouseY);
    theFireworks.push(someFirework);
  }
}