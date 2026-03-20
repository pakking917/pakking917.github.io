// Rect grid demo

let grid = [];
const CELL_SIZE = 200;
let rows;
let cols;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rows = Math.floor(height/CELL_SIZE);
  cols = Math.floor(width/CELL_SIZE);
  grid = generateRandomGrid(cols, rows);
}

function draw() {
  background(220);
  displayGrid();

}

function displayGrid () {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 1) {
        fill(255);
      }

      else if (grid[y][x] === 0) {
        fill(0);
      }
      square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
    }
  }
}

function generateRandomGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      if (Math.random() < 0.5) {
        newGrid[y].push(0);
      }
      else {
        newGrid[y].push(1);
      }
    }
  }
  return newGrid;
}

function generateEmptyGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      newGrid[y].push(1);
    }
  }
  return newGrid;
}

function mousePressed() {
  x = floor(mouseX/CELL_SIZE);
  y = floor(mouseY/CELL_SIZE);
  toggleCell(x, y);
  if (x > 0) {
    toggleCell(x - 1, y);
  }
  if (x < grid[y].length - 1) {
    toggleCell(x + 1, y);
  }
  if (y > 0) {
    toggleCell(x, y - 1);
  }
  if (y < grid.length - 1) {
    toggleCell(x, y + 1);
  }


}

function toggleCell(x, y) {
  if (grid[y][x] === 1) {
    grid[y][x] = 0;
  } 
  else if (grid[y][x] === 0) {
    grid[y][x] = 1;
  } 
}


function keyPressed() {
  if (key === 'r' || key === 'R') {
    grid = generateRandomGrid(cols, rows);
  }
  if (key === 'e' || key === 'E') {
    grid = generateEmptyGrid(cols, rows);
  }
}