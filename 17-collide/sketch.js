// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


function setup() {
  createCanvas(windowWidth, windowHeight);
}

var hit = false;

function draw() {
    background(255);
    ellipse(200, 200, 50, 150);
    point(mouseX, mouseY);

    hit = collidePointEllipse(mouseX, mouseY, 200, 200, 50, 150);

    // Use vectors as input:
    // const mouse         = createVector(mouseX, mouseY);
    // const ellipse_start = createVector(200, 200);
    // const ellipse_size  = createVector(50, 150);
    // hit = collidePointEllipseVector(mouse, ellipse_start, ellipse_size);

    stroke(hit ? color('red') : 0);
    print('colliding?', hit);
}