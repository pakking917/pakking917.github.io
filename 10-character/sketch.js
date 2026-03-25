// Character In Grid demo

let grid = [];
const CELL_SIZE = 50;
const OPEN_TILE = 0;
const IMPASSIBLE = 1;
const PLAYER = 9;
let rows;
let cols;
let thePlayer = {
  x: 0,
  y: 0,
};
let grass;
let paving;

function preload() {
  grass = loadImage("grass2.png");
  // paving = loadImage("paving1.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rows = Math.floor(height/CELL_SIZE);
  cols = Math.floor(width/CELL_SIZE);
  grid = generateRandomGrid(cols, rows);

  // add player
  grid[thePlayer.y][thePlayer.x] = PLAYER;
}

function draw() {
  background(220);
  displayGrid();

}

function displayGrid () {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === IMPASSIBLE) {
        image(grass, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
      }

      else if (grid[y][x] === OPEN_TILE) {
        // image(paving, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
      }
      else if (grid[y][x] === PLAYER) {
        fill("red");
        square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

function generateRandomGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      if (Math.random() < 0.5) {
        newGrid[y].push(OPEN_TILE);
      }
      else {
        newGrid[y].push(IMPASSIBLE);
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
      newGrid[y].push(OPEN_TILE);
    }
  }
  return newGrid;
}

function mousePressed() {
  x = floor(mouseX/CELL_SIZE);
  y = floor(mouseY/CELL_SIZE);
  toggleCell(x, y);

  // if (x > 0) {
  //   toggleCell(x - 1, y);
  // }
  // if (x < grid[y].length - 1) {
  //   toggleCell(x + 1, y);
  // }
  // if (y > 0) {
  //   toggleCell(x, y - 1);
  // }
  // if (y < grid.length - 1) {
  //   toggleCell(x, y + 1);
  // }


}

function toggleCell(x, y) {
  if (grid[y][x] === IMPASSIBLE) {
    grid[y][x] = OPEN_TILE;
  } 
  else if (grid[y][x] === OPEN_TILE) {
    grid[y][x] = IMPASSIBLE;
  } 
}


function keyPressed() {
  if (key === 'r' || key === 'R') {
    grid = generateRandomGrid(cols, rows);
    grid[thePlayer.y][thePlayer.x] = PLAYER;

  }
  if (key === 'e' || key === 'E') {
    grid = generateEmptyGrid(cols, rows);
    grid[thePlayer.y][thePlayer.x] = PLAYER;
  }

  if (key === 's' || key === 'S') {
    movePlayer(thePlayer.x, thePlayer.y + 1);
  }
  if (key === 'w' || key === 'W') {
    movePlayer(thePlayer.x, thePlayer.y - 1);
  }
  if (key === 'a' || key === 'A') {
    movePlayer(thePlayer.x - 1, thePlayer.y);
  }
  if (key === 'd' || key === 'D') {
    movePlayer(thePlayer.x + 1, thePlayer.y);
  }
}

function movePlayer(x, y) {
  if (x >= 0 && x < cols && y >= 0 && y < rows && grid[y][x] === OPEN_TILE) {
    let oldX = thePlayer.x;
    let oldY = thePlayer.y;
    
    // reset the p
    grid[oldY][oldX] = OPEN_TILE;

    thePlayer.x = x;
    thePlayer.y = y;
  }

  grid[thePlayer.y][thePlayer.x] = PLAYER;

}