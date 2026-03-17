// Perlin Noise demo


let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  fill(0);

  let x = noise(time) * width;
  let y = noise(time +  1000) * height;
  circle(x, y, 50);
  time = millis() / 1000;
}

