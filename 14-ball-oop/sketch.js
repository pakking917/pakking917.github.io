// Ball Collision OOP Demo

let ballArray = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);

  for (let ball of ballArray) {
    ball.move();
    for (let otherBall of ballArray) {
      if (ball !== otherBall) {
        ball.bounceOff(otherBall);
      }
    }
    ball.display();
  }
}

function mousePressed() {
  let someBall = new Ball(mouseX, mouseY);
  ballArray.push(someBall);
}

class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = random(15, 30);
    this.dx = random(-5, 5);
    this.dy = random(-5, 5);
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
  }

  display() {
    noStroke();
    fill(this.r, this.g, this.b);
    circle(this.x, this.y, this.radius * 2);
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.y - this.radius < 0 || this.y + this.radius > height) {
      this.dy *= -1;
    }
    if (this.x - this.radius < 0 || this.x + this.radius > width) {
      this.dx *= -1;
    }
  }

  bounceOff(otherBall) {
    let radiiSum = this.radius + otherBall.radius;
    let distanceApart = dist(this.x, this.y, otherBall.x, otherBall.y);
    if (radiiSum > distanceApart) {
      // this.r = 255;
      // this.g = 0;
      // this.b = 0;

      // this.dx *= -1;
      // this.dy *= -1;

      // this.speed = sqrt(this.dx ** 2, this.dy ** 2)
      // this.angle = atan2(otherBall.y - this.y, otherBall.x - this.x);
      // this.dx = 

      let tempX = this.dx;
      let tempY = this.dy;

      this.dx = otherBall.dx;
      this.dy = otherBall.dy;

      otherBall.dx = tempX;
      otherBall.dy = tempY;

    }
  }
  
}