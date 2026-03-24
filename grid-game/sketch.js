// 2D Grid Game
// Pak King Lee
// 2026/3/20
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const STATE = {MENU: 0, HELP: 1, LEVEL_SELECT: 2, PLAY: 3};
let currentState = STATE.MENU;

let unlockedLevels = 1;

// levels initialization
const LEVELS = [level1, level2];
let currentLevel = 0;
let mapData = [];
let boxes = [];
let players = [];
let moves = 0;
let tileSize;
let gridOffsetX = 0;
let gridOffsetY = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  loadProgress();
}

function draw() {
  background(220);
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

  let level = LEVELS[levelIndex - 1];
  players = [{ x: lvl.playerStartingPosition[0][0], y: lvl.playerStartingPosition[0][1] }, 
             { x: lvl.playerStartingPosition[1][0], y: lvl.playerStartingPosition[1][1] }];

  let rows = level.map.length;
  let cols = level.map[0].length;          

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

  tileSize = Math.min( (width - 100) / cols);
}

