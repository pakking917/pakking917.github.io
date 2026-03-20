// Grid demo

// let theGrid = [[0,0,1,0],
//                [1,0,1,0],
//                [0,1,0,0],
//                [0,1,0,1]];


let theGrid;

let maxValue;
const SQUARE_DIMENSION = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  maxValue = min(width, height) / 4;

  theGrid = generateRandomGrid();
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
  let x = floor(mouseX / maxValue);
  let y = floor(mouseY / maxValue);

  if (theGrid[y][x] === 1) {
    theGrid[y][x] = 0; 
  }
  else if (theGrid[y][x] === 0) {
    theGrid[y][x] = 1;
  }
}

function generateRandomGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++){
    newGrid.push([]);
    for (let x = 0; x < cols; x ++) {
      if (Math.random < 0.5) {
        newGrid[y].push(0);
      }
      else {
        newGrid[y].push(1);
      }
    }
  }
}