// Ball Array

let ballArray = [];


function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);

  for (let ball of ballArray) {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x - ball.radius < 0)      {ball.x = width + ball.radius;}
    if (ball.x + ball.radius > width)  {ball.x = width - ball.radius;}
    if (ball.y - ball.radius < 0)      {ball.y = height + ball.radius;}
    if (ball.y + ball.radius > height) {ball.y = height - ball.radius;}
    

    fill(ball.r, ball.g, ball.b);
    circle(ball.x, ball.y, ball.radius * 2);
  }
}

function mousePressed() {
  spawnBall(mouseX, mouseY);
}

function spawnBall(_x, _y) {
  let someBall = {
    x: _x,
    y: _y,
    dx: random(-5, 5),
    dy: random(-5, 5),
    radius: random(10, 30),
    r: random(255),
    g: random(255),
    b: random(255)
  }

  ballArray.push(someBall);
}