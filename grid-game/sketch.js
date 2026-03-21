// 2D Grid Game
// Pak King Lee
// 2026/3/20
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const STATE = {MENU:0, HELP: 1, LEVEL_SELECT: 2, PLAY: 3};
let currentState = STATE.MENU;

let unlockedLevels = 1;

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
}

function draw() {
  background(220);
}
