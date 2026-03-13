// Arrays and Object Notation
// Pak King Lee
// 2026/3/5
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"



let radius;
let center;

let points = [];
let geodesics = [];

function setup() {
  baseSize = Math.max(Math.floor(Math.min(windowWidth, windowHeight)), 100);
  createCanvas(baseSize, baseSize);
  center = createVector(width / 2, height / 2);
  radius = baseSize * 0.45;
}

function draw() {
  background(0);
  drawDisk();
  drawGeodesics();
  drawPoints();
}

function drawDisk() {
  circle(center.x, center.y, radius * 2);
}

function mousePressed() {
  let v = createVector(mouseX, mouseY);

  if (insideDisk(v)) {
    let p = new Point(v.x, v.y);
    points.push(p);

    if (points.length >= 2) {
      let a = points[points.length - 2];
      let b = points[points.length - 1];

      geodesics.push(new Geodesic(a, b));
    }
  }
  console.log(v);
 
}

function keyPressed() {
  if (key === 'c' || key === 'C') {
    points = [];
    geodesics = [];
  }
}

function drawGeodesics() {
  for (let geodesic of geodesics) {
    geodesic.draw();
  }
}


function drawPoints() {
  for (let point of points) {
    point.draw();
  }
}

function insideDisk(vector) {
  return p5.Vector.dist(vector, center) < radius;
}

class Point {

  constructor(x, y) {
    this.pos = createVector(x,y);
  }


  draw() {
    fill(255, 200, 120);
    noStroke();
    circle(this.pos.x, this.pos.y, 8);
  }
}

class Geodesic {
  constructor(point1, point2) {
    this.p1 = point1;
    this.p2 = point2;
  }

  draw() {
    fill(50);
    stroke(255);
    line(this.p1.x, this.p1.y);
  }
}