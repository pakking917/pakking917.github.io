// Rect grid demo

let grid = [];
const CELL_SIZE = 50;
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
  grid = updateGrid();
  displayGrid();

}

function displayGrid () {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 0) {
        fill(255);
      }

      else if (grid[y][x] === 1) {
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
  if (grid[y][x] === 1) {
    grid[y][x] = 0;
  } 
  else if (grid[y][x] === 0) {
    grid[y][x] = 1;
  } 
}

function updateGrid() {
  let nextTurn = generateEmptyGrid(cols, rows);

  //look at every cell
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let neighbours = 0;

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          //don't fall off edge of grid when counting neighbours
          if (x+j >= 0 && x+j < cols && y+i >= 0 && y+i < rows) {
            neighbours += grid[y+i][x+j];
          }
        }
      }

      //don't count self as neighbour
      neighbours -= grid[y][x];

      //apply the rules
      if (grid[y][x] === 1) {
        //currently alive
        if (neighbours === 2 || neighbours === 3) {
          nextTurn[y][x] = 1;
        }
        else {
          nextTurn[y][x] = 0;
        }
      }

      if (grid[y][x] === 0) {
        //currently dead
        if (neighbours === 3) {
          nextTurn[y][x] = 1;
        }
        else {
          nextTurn[y][x] = 0;
        }
      }
    }
  }
  return nextTurn;
}
  



function keyPressed() {
  if (key === 'r' || key === 'R') {
    grid = generateRandomGrid(cols, rows);
  }
  if (key === 'e' || key === 'E') {
    grid = generateEmptyGrid(cols, rows);
  }
}