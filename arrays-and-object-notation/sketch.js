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
  noFill();
  stroke(255);
  circle(center.x, center.y, radius * 2);
}

function mousePressed() {
  let vector = {
    x: mouseX,
    y: mouseY
  };

  if (points.length >= 3) return;
  if (!insideDisk(vector)) return;

  points.push(vector);

  for (let i = 0; i < points.length - 1; i++) {
    geodesics.push(new Geodesic(points[i], vector));
  }

  console.log(vector);
 
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
    fill(255, 200, 120);
    circle(point.x, point.y, 8);
  }
}

function insideDisk(vector) {
  return dist(vector.x, vector.y, center.x, center.y) < radius;
}

// Convert both ways from disk to unit disk

function toDiskCoords(p) {
  return { x: (p.x - center.x) / radius, y: (p.y - center.y) / radius };
}

function toCanvas(d) {
  return { x: d.x * radius + center.x, y: d.y * radius + center.y };
}

// Geodesic class

class Geodesic {
  constructor(point1, point2) {
    this.p1 = point1;
    this.p2 = point2;
    this.dP1 = toDiskCoords(point1); // dP is diskPoint
    this.dP2 = toDiskCoords(point2);

  }

  draw() {
    stroke(100, 200, 255);
    strokeWeight(2);
    noFill();


    let arc = this.getOrthogonalCircle(this.dP1, this.dP2);
    if (!arc) return;

    let { ox, oy, or: oR } = arc;
    let a1 = atan2(this.dP1.y - oy, this.dP1.x - ox);
    let a2 = atan2(this.dP2.y - oy, this.dP2.x - ox);
    let da = a2 - a1;
    if (da >  PI) da -= TAU;
    if (da < -PI) da += TAU;

    beginShape();

      let warped = this.hyperbolicWarp(x, y);
    for (let i = 0; i <= STEPS; i++) {


      if (dist(dx, dy, 0, 0) <= 1.005) vertex(dx * radius + center.x, dy * radius + center.y);
    }

    endShape();
  }

  hyperbolicWarp(x, y) {
    let r2 = x * x + y * y;

    let factor = 1 / (1 - r2 * 0.8);

    return createVector(x * factor, y * factor);
  }
}