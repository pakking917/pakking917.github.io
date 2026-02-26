// Image Demo

let naoyaImg;

function preload() {
  naoyaImg = loadImage('naoya.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  image(naoyaImg, mouseX, mouseY, naoyaImg.width * 8, naoyaImg.height * 0.8);
}
