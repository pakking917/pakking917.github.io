// 2D Grid Game
// Pak King Lee
// 2026/3/20
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const STATE = {MENU: 0, HELP: 1, LEVEL_SELECT: 2, PLAY: 3};
const TILE_TYPE = {WALL: 0, FLOOR: 1, BOX: 2, GOAL: 3, VOID: 4};
let currentState = STATE.MENU;

let unlockedLevels = 1;

// levels initialization
const LEVELS = [level1, level2];
let currentLevel = 0;
let mapData = [];
let cols;
let rows;
let boxes = [];
let players = [];


let moves = 0;
let tileSize;
let gridOffsetX = 0;
let gridOffsetY = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  loadProgress();
  // loadLevel(0);
  currentState = STATE.HELP;

}

function draw() {
  background(220);
  if (currentState === STATE.MENU) {
    drawMenu();
  }
  else if (currentState === STATE.HELP) {
    drawHelp();
  }
  else if (currentState === STATE.LEVEL_SELECT) {
    drawLevelSelect();
  }
  else if (currentState === STATE.PLAY) {
    drawGame();
  }
}


function loadLevel(levelIndex) {
  currentState = STATE.PLAY;
  currentLevel = levelIndex;
  
  let level = LEVELS[levelIndex];
  boxes = [];
  players = [{ x: level.playerStartingPosition[0][0], y: level.playerStartingPosition[0][1] }, 
  { x: level.playerStartingPosition[1][0], y: level.playerStartingPosition[1][1] }];
  
  rows = level.map.length;
  cols = level.map[0].length;          
  
  mapData = [];
  for (let y = 0; y < rows; y++) {
    let row = [];
    for (let x = 0; x < cols; x++) {
      let tile = level.map[y][x];
      
      if (tile === 2) { // let a floor tile replace a box
        boxes.push({ x: x, y: y });
        row.push(1);
      } 
      else { 
        row.push(tile);
      }
    }
    
    mapData.push(row);
  }
  
  tileSize = Math.min( (width - 100) / cols, (height - 100) / rows);
}

// ------------------------ Rendering ------------------------

function drawButton(txt, x, y, w, h, colour = color(150)) {
  rectMode(CENTER);
  fill(colour);
  stroke(255);
  rect(x, y, w, h);
  fill(0);
  noStroke();
  textSize(20);
  textFont("Courier New");
  text(txt, x, y);
}

function drawMenu() {
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(40);
  text("Unlimited Games but No Games", width / 2, height / 3);

  drawButton("Play", width / 2, height / 2, 300, 50);
  drawButton("Help", width / 2, height / 2 + 70, 300, 50);
  drawButton("Unlock All Levels", width / 2, height / 2 + 140, 300, 50);
}

function drawHelp() {
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(30);
  text("HOW TO PLAY", width / 2, height / 5);

  textSize(16);
  let instructions = "";
  
  text(instructions, width / 2, height / 2);
  drawButton("Back", width / 2, height - 100, 200, 50);
}

function drawGame() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      tile = mapData[y][x];
      let px = gridOffsetX + x * tileSize;
      let py = gridOffsetY + y * tileSize;
      
      stroke(50);
      if (tile === 0) {
        fill(80);
      } // Wall
      else if (tile === 1) {
        fill(200);
      } // Floor
      else if (tile === 3) {
        fill(255, 255, 0);
      } // Goal
      else if (tile === 4) {
        fill(0);
      } // Void
      
      
      rect(px, py, tileSize, tileSize);
      
    }
  }
  
  fill(139, 69, 19);
  for (let b of boxes) {
    rect(gridOffsetX + b.x * tileSize + 2, gridOffsetY + b.y * tileSize + 2, tileSize - 4, tileSize - 4);
  }
  
  // Draw Players
  let colors = [color(0, 255, 255), color(255, 0, 255)];  
  for (let i = 0; i < players.length; i++) {
    fill(colors[i]);
    circle(gridOffsetX + players[i].x * tileSize + tileSize / 2, gridOffsetY + players[i].y * tileSize + tileSize / 2, tileSize * 0.8);
  }
  
}


function attemptMove(dx, dy) {
  player0 = players[0];
  player1 = players[1];
  
  let c0 = getPushChain(player0.x, player0.y, dx, dy);
  let c1 = getPushChain(player1.x, player1.y, dx, dy);
  
  let tile0 = c0.blocked ? { x: player0.x, y: player0.y } : { x: player0.x + dx, y: player0.y + dy };
  let tile1 = c1.blocked ? { x: player1.x, y: player1.y } : { x: player1.x + dx, y: player1.y + dy };
  
  // Rule: Players cannot attempt to occupy the same tile
  if (tile0.x === tile1.x && tile0.y === tile1.y) {
    return;
  }
  
  // Handle cross-blocking (One player blocked, other moves into them)
  if (tile0.x === player1.x && tile0.y === player1.y && c1.blocked) {
    tile0 = { x: player0.x, y: player0.y };
  }
  if (tile1.x === player0.x && tile1.y === player0.y && c0.blocked) {
    tile1 = { x: player1.x, y: player1.y };
  }
  
  let moved = false;
  if (tile0.x !== player0.x || tile0.y !== player0.y) {
    player0.x = tile0.x; player0.y = tile0.y;
    moved = true;
    for (let box of c0.boxes) { 
      box.x += dx; box.y += dy; 
    }
  }
  if (tile1.x !== player1.x || tile1.y !== player1.y) {
    player1.x = tile1.x; player1.y = tile1.y;
    moved = true;
    for (let box of c1.boxes) { 
      box.x += dx; box.y += dy; 
    }
  }
  
  if (moved) {
    moves++;
  }
}

function getPushChain (oldX, oldY, dX, dY) {
  let chain = { blocked: false, boxes: [] };
  let newX = oldX + dX;
  let newY = oldY + dY;
  
  if (isOutOfBounds(newX, newY)) {
    chain.blocked = true;
    return chain;
  }
  
  let box = getBoxAt(newX, newY);
  while (box) {
    chain.boxes.push(box);
    newX += dX;
    newY += dY;
    if (isOutOfBounds(newX, newY)) {
      chain.blocked = true;
      return chain;
    }
    box = getBoxAt(newX, newY);
  }
  
  // The tile after the final box (or the player if no boxes)
  if (mapData[newY][newX] === TILE_TYPE.WALL) {
    chain.blocked = true; // Blocked by wall
  }
  return chain;
}

function ifBlocked(objectiveX, objectiveY) {
  return mapData[objectiveY][objectiveX] === TILE_TYPE.WALL;
}

function ifVoid(objectiveX, objectiveY) {
  return mapData[objectiveY][objectiveX] === TILE_TYPE.VOID;
}

function getBoxAt(x, y) { 
  return boxes.find(box => box.x === x && box.y === y);
}

function isOutOfBounds(x, y) {
  return y < 0 || y >= rows || x < 0 || x >= cols;
}

function keyPressed() {
  if (key === "r" || key === "R") {
    loadLevel(1);
  }
  if (key === "w" || key === "W" || keyCode === UP_ARROW) {
    attemptMove(0, -1);
  }
  if (key === "a" || key === "A" || keyCode === LEFT_ARROW) {
    attemptMove(-1, 0);
  }
  if (key === "s" || key === "S" || keyCode === DOWN_ARROW) {
    attemptMove(0, 1);
  }
  if (key === "d" || key === "D" || keyCode === RIGHT_ARROW) {
    attemptMove(1, 0);
  }
  if (keyCode === ESCAPE) {
    currentState === STATE.MENU;
  }
}


// Local Storage

function loadProgress() {
  let data = localStorage.getItem("girdGameProgress");
  if (data) {
    let parsed = JSON.parse(data);
    unlockedLevels = Math.max(parsed.unlockedLevels, unlockedLevels);
    starLevels = parsed.starLevels || [];
  }
}

function saveProgress() {
  localStorage.setItem("girdGameProgress", JSON.stringify({
    unlockedLevels: unlockedLevels,
    starLevels: starLevels
  }));
}

function resetProgress() {
  // Removes only the save data specific to this game
  localStorage.removeItem("girdGameProgress");
  unlockedLevels = 1;
  starLevels = [];
  
  // Send a confirmation to the console
  console.log("Progress reset.");
}
