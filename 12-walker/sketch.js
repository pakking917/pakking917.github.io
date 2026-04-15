// Walker OOP Demo

// let tyler;
// let audrey;

// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   tyler = new Walker(width / 2, height / 2, "red");
//   audrey = new Walker(random(width), random(height), "blue");
// }

// function draw() {
//   tyler.move();
//   audrey.move();
//   tyler.display();
//   audrey.display();
// }

let theWalkers = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  for (let walker of theWalkers) {
    walker.move();
    walker.display();
  }
}

class Walker {
  constructor(x, y, colour) {
    this.x = x;
    this.y = y;
    this.colour = colour;
    this.speed = 10;
    this.diameter = 2;
  }

  display() {
    fill(this.colour);
    stroke(this.colour);
    circle(this.x, this.y, this.diameter);

  }

  move() {
    let choice = random(100);
    if (choice < 25) {
      this.y -= this.speed;
    }
    else if (choice < 50) {
      this.x -= this.speed;

    }
    else if (choice < 75) {
      this.y += this.speed;
      
    }
    else if (choice < 100) {
      this.x += this.speed;
      
    }
  }
}

function mousePressed() {
  let someWalker = new Walker(mouseX, mouseY);
  someWalker.colour = color(random(255), random(255), random(255));
  theWalkers.push(someWalker);
}