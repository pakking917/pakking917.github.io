// Grid demo

let theGrid = [[0,0,1,0],
               [1,0,1,0],
               [0,1,0,0],
               [0,1,0,1]];

let maxValue;

function setup() {
  createCanvas(windowWidth, windowHeight);
  maxValue = min(width, height) / 4;
}


function draw() {
  background(220);
  showGrid();
}

function showGrid() {
  for (let y = 0; y < theGrid.length; y++) {
    for (let x = 0; x < theGrid[y].length; x++) {
      if (theGrid[y][x] === 1) {
        fill(0);
      }
      else {
        fill(255);
      }
      square(x * maxValue, y * maxValue, maxValue);
    }
  }
}

function mousePressed() {
  if (theGrid[floor(mouseY / height)* 4][floor(mousex / width) * 4] === 1) {
    theGrid[floor(mouseY / height * 4)][floor(mousex / width * 4)] === 0;
  }
  else {
    theGrid[floor(mouseY / height * 4)][floor(mousex / width * 4)] === 1;
  }
}