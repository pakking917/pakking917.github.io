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

    const STEPS = 60;

    let arc = this.getOrthogonalCircle(this.dP1, this.dP2);
    if (!arc) return;

    let { ox, oy, or: oR } = arc;
    let a1 = atan2(this.dP1.y - oy, this.dP1.x - ox);
    let a2 = atan2(this.dP2.y - oy, this.dP2.x - ox);
    let da = a2 - a1;
    if (da >  PI) da -= TAU;
    if (da < -PI) da += TAU;

    beginShape();

    for (let i = 0; i <= STEPS; i++) {
      let a  = a1 + da * (i / STEPS);

      let dx = ox + cos(a) * oR;
      let dy = oy + sin(a) * oR;

      if (dist(dx, dy, 0, 0) <= 1.005) vertex(dx * radius + center.x, dy * radius + center.y);
    }

    endShape();
  }

  getOrthogonalCircle(d1, d2) {
    return this.circumcircle(d1, d2, this.invertPoint(d1));
  }

  invertPoint(p) {
    let lenSq = p.x * p.x + p.y * p.y;
    if (lenSq < 1/10000) return { x: 0, y: 0 };
    return { x: p.x / lenSq, y: p.y / lenSq };
  }

  circumcircle(a, b, c) {
    let D = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
    if (abs(D) < 1/10000) return null;
    let ux = ((a.x*a.x + a.y*a.y) * (b.y - c.y) + (b.x*b.x + b.y*b.y) * (c.y - a.y) + (c.x*c.x + c.y*c.y) * (a.y - b.y)) / D;
    let uy = ((a.x*a.x + a.y*a.y) * (c.x - b.x) + (b.x*b.x + b.y*b.y) * (a.x - c.x) + (c.x*c.x + c.y*c.y) * (b.x - a.x)) / D;
    return { ox: ux, oy: uy, or: dist(ux, uy, a.x, a.y) };
  }
}