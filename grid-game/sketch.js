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
let starLevels = [];

// levels initialization
const LEVELS = [level1, level2, level3, level4, level5, level6, level7, level8, level9, level10, level11];
let currentLevelIdx = 0;
let mapData = [];
let cols;
let rows;
let boxes = [];
let players = [];


let moves = 0;
let tileSize;
let gridOffsetX = 0;
let gridOffsetY = 0;

let currentPage = 0;
const LEVELS_PER_PAGE = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  loadProgress();
}

function draw() {
  background(30);
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
  currentLevelIdx = levelIndex;
  
  let level = LEVELS[levelIndex];
  moves = 0;
  boxes = [];
  players = [{ x: level.playerStartingPosition[0][0], y: level.playerStartingPosition[0][1] }, 
             { x: level.playerStartingPosition[1][0], y: level.playerStartingPosition[1][1] }];
  
  rows = level.map.length;
  cols = level.map[0].length;
  tileSize = min((windowWidth - 100) / cols, (windowHeight - 100) / rows);
  gridOffsetX = (windowWidth - cols * tileSize) / 2;
  gridOffsetY = (windowHeight - rows * tileSize) / 2;          
  
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

  textSize(22);
  let instructions = 
    "Use WASD or Arrows to move BOTH characters simultaneously.\n\n" +
    "Rules:\n" +
    "- Both characters must reach the yellow goal tiles to win.\n" +
    "- If either character touches a black Void tile, YOU DIE.\n" +
    "- You can push brown boxes onto floors, goals, or into the void to destroy them.\n" +
    "- If one character is blocked by a wall, the other can still move.\n" +
    "- Characters cannot occupy the same tile.\n\n" +
    "Try finishing the level in the optimal number of moves!";
  
  text(instructions, width / 2, height / 2);
  drawButton("Back", width / 2, height - 100, 200, 50);
}

function drawLevelSelect() {
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(30);
  text("SELECT LEVEL", width / 2, 50);

  let startIdx = currentPage * LEVELS_PER_PAGE;
  let endIdx = min(startIdx + LEVELS_PER_PAGE, LEVELS.length);

  for (let i = startIdx; i < endIdx; i++) {
    let x = width / 2 - 150 + (i - startIdx) % 2 * 300;
    let y = 150 + Math.floor((i - startIdx) / 2) * 80;
    
    let isUnlocked = i < unlockedLevels;
    let hasStar = starLevels[i];

    drawButton(
      isUnlocked ? `${LEVELS[i].label} ${hasStar ? '⭐' : ''}` : "Locked", 
      x, y, 250, 60, 
      isUnlocked ? color(100, 200, 100) : color(100)
    );
  }

  // Pagination buttons
  if (currentPage > 0) {
    drawButton("Prev Page", width / 2 - 200, height - 80, 150, 40);
  }
  if (endIdx < LEVELS.length) {
    drawButton("Next Page", width / 2 + 200, height - 80, 150, 40);
  }
  drawButton("Back to Menu", width / 2, height - 80, 150, 40, color(200, 100, 100));
}

function drawGame() {
  // Draw UI Header
  fill(255);
  textAlign(LEFT, TOP);
  textSize(20);
  text(`${LEVELS[currentLevelIdx].label} | Moves: ${moves} / ${LEVELS[currentLevelIdx].optimalMoves}`, 20, 20);
  
  textAlign(RIGHT, TOP);
  text("Press 'R' to Restart | 'ESC' to Exit", width - 20, 20);
  rectMode(CORNER);

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

// ------------------------ Game Logic ------------------------

function attemptMove(dx, dy) {
  player0 = players[0];
  player1 = players[1];
  
  let chain0 = getPushChain(player0.x, player0.y, dx, dy);
  let chain1 = getPushChain(player1.x, player1.y, dx, dy);
  
  let target0 = chain0.blocked ? { x: player0.x, y: player0.y } : { x: player0.x + dx, y: player0.y + dy };
  let target1 = chain1.blocked ? { x: player1.x, y: player1.y } : { x: player1.x + dx, y: player1.y + dy };
  
  // Rule: Players cannot attempt to occupy the same tile
  if (target0.x === target1.x && target0.y === target1.y) {
    return;
  }
  
  // Handle cross-blocking (One player blocked, other moves into them)
  if (target0.x === player1.x && target0.y === player1.y && chain1.blocked) {
    target0 = { x: player0.x, y: player0.y };
    chain0.boxes = [];
  }
  if (target1.x === player0.x && target1.y === player0.y && chain0.blocked) {
    target1 = { x: player1.x, y: player1.y };
    chain1.boxes = [];
  }

  for (let box of chain0.boxes) {
    if (box.x + dx === target1.x && box.y + dy === target1.y) {
      return;
    }
  }
  for (let box of chain1.boxes) {
    if (box.x + dx === target0.x && box.y + dy === target0.y) {
      return;
    }
  }
  
  let moved = false;
  if (target0.x !== player0.x || target0.y !== player0.y) {
    player0.x = target0.x; player0.y = target0.y;
    moved = true;
    for (let box of chain0.boxes) { 
      box.x += dx; box.y += dy; 
    }
  }
  if (target1.x !== player1.x || target1.y !== player1.y) {
    player1.x = target1.x; player1.y = target1.y;
    moved = true;
    for (let box of chain1.boxes) { 
      box.x += dx; box.y += dy; 
    }
  }
  
  if (moved) {
    moves++;
    checkPostMove();
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

function checkPostMove() {
  // Destroy boxes in the void
  boxes = boxes.filter(b => mapData[b.y][b.x] !== TILE_TYPE.VOID);

  // Check if players fell in the void
  if (mapData[players[0].y][players[0].x] === TILE_TYPE.VOID || mapData[players[1].y][players[1].x] === TILE_TYPE.VOID) {
    setTimeout(() => {
      alert("You fell into the void!");
      loadLevel(currentLevelIdx);
    }, 50);
    return;
  }

  // Check Win Condition (both on goals)
  if (mapData[players[0].y][players[0].x] === TILE_TYPE.GOAL && mapData[players[1].y][players[1].x] === TILE_TYPE.GOAL) {
    let isOptimal = moves <= LEVELS[currentLevelIdx].optimalMoves;
    
    // Unlock next level
    if (currentLevelIdx + 1 >= unlockedLevels) {
      unlockedLevels = min(currentLevelIdx + 2, LEVELS.length);
    }
    
    // Update star if optimal
    if (isOptimal) {
      starLevels[currentLevelIdx] = true;
    }
    saveProgress();
    setTimeout(() => {
      alert(`Level Cleared!\n${isOptimal ? '⭐ Optimal Solution Achieved!' : ''}`);
      currentState = STATE.LEVEL_SELECT;
    }, 50);
  }
}

// ------------------------ Utilities ------------------------

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
function isClicked(x, y, w, h) {
  return mouseX > x - w/2 && mouseX < x + w/2 &&
         mouseY > y - h/2 && mouseY < y + h/2;
}

// ------------------------ Player Inputs ------------------------

function keyPressed() {
  if (key === "r" || key === "R") {
    loadLevel(currentLevelIdx);
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
    currentState = STATE.MENU;
  }
}

function mousePressed() {
  if (currentState === STATE.MENU) {
    if (isClicked(width / 2, height / 2, 200, 50)) {
      currentState = STATE.LEVEL_SELECT;
    }
    if (isClicked(width / 2, height / 2 + 70, 200, 50)) {
      currentState = STATE.HELP;
    }
    if (isClicked(width / 2, height / 2 + 140, 200, 50)) {
      unlockedLevels = LEVELS.length;
      saveProgress();
      alert("All levels unlocked (no stars awarded)!");
    }
  } 
  else if (currentState === STATE.HELP) {
    if (isClicked(width / 2, height - 100, 200, 50)) {
      currentState = STATE.MENU;
    }
  } 
  else if (currentState === STATE.LEVEL_SELECT) {
    let startIdx = currentPage * LEVELS_PER_PAGE;
    let endIdx = min(startIdx + LEVELS_PER_PAGE, LEVELS.length);

    // Check level clicks
    for (let i = startIdx; i < endIdx; i++) {
      let x = width / 2 - 150 + (i - startIdx) % 2 * 300;
      let y = 150 + Math.floor((i - startIdx) / 2) * 80;
      if (i < unlockedLevels && isClicked(x, y, 250, 60)) {
        loadLevel(i);
      }
    }

    // Pagination/Back logic
    if (currentPage > 0 && isClicked(width / 2 - 150, height - 80, 150, 40)) {
      currentPage--;
    }
    if (endIdx < LEVELS.length && isClicked(width / 2 + 150, height - 80, 150, 40)) {
      currentPage++;
    }
    if (isClicked(width / 2, height - 80, 150, 40)) {
      currentState = STATE.MENU;
    }
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

function resetProgress() { // debugging only
  // Removes only the save data specific to this game
  localStorage.removeItem("girdGameProgress");
  unlockedLevels = 1;
  starLevels = [];
  
  // Send a confirmation to the console
  console.log("Progress reset.");
}
