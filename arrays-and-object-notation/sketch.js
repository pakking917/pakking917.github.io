// Arrays and Object Notation
// Pak King Lee
// 2026/3/5
//
/* Extra for Experts:
- Using a class to represent geodesic lines to bbundle data and functions together
- Implemented geometry using the Poincare disk model, which required deriving coding formulas that compute arcs orthogonal to the circle
- I used parametric equations instead of standard functions to draw curved geodesics by sampling points
- I added a beep sound whenever user successfully creates new point or clear all points, using the p5.sound library
 */


// Poincare Disk setup
let radius;
let center;

let points = []; // arrays of point objects
let geodesics = []; // arrays of geodesics, lines that connect the dots

let beep; // For sound effect when creating a new point

function setup() {
  baseSize = Math.max(Math.floor(Math.min(windowWidth, windowHeight)), 100);
  createCanvas(baseSize, baseSize);
  center = createVector(width / 2, height / 2);
  radius = baseSize * 0.45;

  beep = new p5.Oscillator('sine'); // create sound oscillator
  beep.start();
  beep.amp(0);
}

function draw() {
  background(0);
  drawDisk();
  drawGeodesics();
  drawPoints();
}

// Draw outer boundary of the disk
function drawDisk() {
  noFill();
  stroke(255);
  circle(center.x, center.y, radius * 2);
}

// Adds up to 3 points inside disk upon mouse click
function mousePressed() {
  let vector = {
    x: mouseX,
    y: mouseY
  };
  
  if (points.length >= 3) {
    return;
  }
  if (!insideDisk(vector)) {
    return;
  }
  
  points.push(vector);
  
  userStartAudio();
  beep.freq(600);
  beep.amp(0.5, 0.05);
  beep.amp(0, 0.15);
  //67
  for (let i = 0; i < points.length - 1; i++) {
    geodesics.push(new Geodesic(points[i], vector));
  }

  console.log(vector);
 
}

function keyPressed() {
  if (key === 'c' || key === 'C') {
    beep.freq(200); // a hum
    beep.amp(0.5, 0.05);
    beep.amp(0, 0.2);

    points = []; // clear all points and lines
    geodesics = [];
  }
}

// Draw all geodesic curves and selected points
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

function insideDisk(vector) { // Check if a point is inside the disk
  return dist(vector.x, vector.y, center.x, center.y) < radius;
}

// Convert both ways from disk to unit disk
function toDiskCoords(p) {
  return { 
    x: (p.x - center.x) / radius, 
    y: (p.y - center.y) / radius 
  };
}
function toCanvas(d) {
  return { 
    x: d.x * radius + center.x, 
    y: d.y * radius + center.y 
  };
}

// ---Geodesic class--------------------------------

class Geodesic {
  constructor(point1, point2) {
    this.p1 = point1;
    this.p2 = point2;
    // Convert to normalized disk coordinates (-1 to 1)
    this.diskP1 = toDiskCoords(point1); // diskP is diskPoint
    this.diskP2 = toDiskCoords(point2);

  }

  draw() {
    stroke(100, 200, 255);
    strokeWeight(2);
    noFill();

    const STEPS = 60;

    // Calculate the circle's property that meets the disk boundary at 90 degrees
    let arc = this.getOrthogonalCircle(this.diskP1, this.diskP2);
    if (!arc) {
      return;
    }

    let { 
      originX, 
      originY, 
      or: arcRadius 
    } = arc;

    // Determine the start and end angles of the arc relative to the arc's center
    let a1 = atan2(this.diskP1.y - originY, this.diskP1.x - originX);
    let a2 = atan2(this.diskP2.y - originY, this.diskP2.x - originX);
    
    // Calculate shorteste angular distance
    let deltaAngle = a2 - a1;
    if (deltaAngle >  PI) {
      deltaAngle -= TAU;
    }
    if (deltaAngle < -PI) {
      deltaAngle += TAU;
    }

    beginShape();

    for (let i = 0; i <= STEPS; i++) {
      let a  = a1 + deltaAngle * (i / STEPS);
      // Convert polar coordinates (angle/radius) back to Cartesian (x/y)
      let dx = originX + cos(a) * arcRadius;
      let dy = originY + sin(a) * arcRadius;
      
      // Only draw if the point is within disk
      if (dist(dx, dy, 0, 0) <= 1.005) {
        vertex(dx * radius + center.x, dy * radius + center.y);
      }
    }

    endShape();
  }

  // Find circle that passes all three points
  getOrthogonalCircle(d1, d2) {
    return this.circumcircle(d1, d2, this.invertPoint(d1));
  }

  // Reflects a point across the disk boundary
  invertPoint(p) {
    let lenSq = p.x * p.x + p.y * p.y;
    if (lenSq < 1/10000) {
      return { x: 0, y: 0 };
    }
    return { 
      x: p.x / lenSq, 
      y: p.y / lenSq 
    };
  }

  circumcircle(a, b, c) { // Find property of circle that intersects all three points
    // if determinant is zero, points are collinear
    let determinant = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
    if (abs(determinant) < 1/10000) {
      return null;
    }
    // Calculate the circumcenter
    let ux = ((a.x*a.x + a.y*a.y) * (b.y - c.y) + (b.x*b.x + b.y*b.y) * (c.y - a.y) + (c.x*c.x + c.y*c.y) * (a.y - b.y)) / determinant;
    let uy = ((a.x*a.x + a.y*a.y) * (c.x - b.x) + (b.x*b.x + b.y*b.y) * (a.x - c.x) + (c.x*c.x + c.y*c.y) * (b.x - a.x)) / determinant;
    return { 
      originX: ux, 
      originY: uy, 
      or: dist(ux, uy, a.x, a.y) 
    };
  }
}