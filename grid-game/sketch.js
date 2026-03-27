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
  loadLevel(0);
}

function draw() {
  background(220);
  drawGame();
}

function loadProgress() {
  let data = localStorage.getItem("skibidiToilet");
  if (data) {
    let parsed = JSON.parse(data);
    unlockedLevels = parsed.unlockedLevels || 1;
    starLevels = parsed.starLevels || [];
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


function attemptMove(x, y) {
  player0 = players[0];
  player1 = players[1];
  
}




function keyPressed() {
  if (key === "r") {
    loadLevel(1);
  } 
}