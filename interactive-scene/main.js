// Interactive Scene Assignemnt
// Pak King Lee
// Feb 9, 2026
//
// Extra for Experts:
// - Resizing window
// - Local storage for death count
// - Editted html and extra files to better contain level info


// Game env. setup
let gameState = "intro";
let box = {};
let spiteScale;
let baseSize;
const LEVELS = [level1, level2, level3, level4, level5];
let iframes = 0;


// Player and sans setup
let sansX, sansY;
let heartX, heartY;
let heartVX = 0, heartVY = 0;
let currentLevel = 1;
const playerMaxHP = 92;
let playerHP = playerMaxHP;
let heartSpeed;

// Dialogue
let dialogueLines = [];
let dialogueIndex = 0;
let charIndex     = 0;
let typeTimer     = 0;
const TYPE_SPEED  = 2; // frames per character
let dialogueDone  = false;
let dialoguePhase = "pre"; // pre for pre battle and post for post battle

function setup() {
  calcSizes();
  createCanvas(baseSize * 4, baseSize * 3);
  spiteScale = baseSize / 100 / 2.5;
  resetPlayer();
  box = makeBattleBox();
}

function draw() {
  background(0);
  if (gameState === "intro") drawIntro();
  else if (gameState === "battle") drawBattle();
  else if (gameState === "transition") drawTransition();
  else if (gameState === "win") drawWin();
  else if (gameState === "gameover") drawGameOver();
}


function calcSizes() {
  baseSize   = Math.max(Math.floor(Math.min(windowWidth / 4, windowHeight / 3)), 100);
  heartSpeed = baseSize * 0.03;
}

function windowResized() {
  calcSizes();
  let heartPosX = heartX / width
  let heartPosY = heartY / height
  resizeCanvas(baseSize * 4, baseSize * 3);
  spiteScale = baseSize / 100 / 2.5;
  sansX = width / 2;
  sansY = height / 4;
  box = makeBattleBox();
  if (gameState !== 'title') {
    heartX = constrain(heartPosX * width + heartVX, box.x + 8, box.x + box.w - 8);
    heartY = constrain(heartPosY * height + heartVY, box.y + 16, box.y + box.h);
  }
}

function makeBattleBox() {
  return {
    x: width  * 0.1,
    y: height * 0.5,
    w: width  * 0.8,
    h: height * 0.38
  };
}

function resetPlayer() {
  spiteScale = baseSize / 100 / 2.5;
  sansX = width  / 2;
  sansY = height / 4;
  box = makeBattleBox();
  heartX = box.x + box.w / 2;
  heartY = box.y + box.h / 2;
  iframes = 0;
  activeAttacks = [];
  attackQueue   = [];

}

function getDeaths() { 
  return parseInt(localStorage.getItem('sansDeaths') || '0'); 
}

function addDeath()  { 
  localStorage.setItem('sansDeaths', getDeaths() + 1); 
}




function drawIntro() {
  sansX = width / 2;
  drawSans(sansX, sansY, spiteScale);
  
  stroke("white"); 
  strokeWeight(baseSize / 50);
  fill("black");
  rect(width / 10, height / 2 , width * 4 / 5, height * 4 / 10)
  
  
  console.log(width, height, sansX, sansY, heartX, heartY) //test
  
  drawHeart(heartX, heartY, spiteScale);
  updateHeart();
}


function updateHeart() {
  heartVX = 0; heartVY = 0;
  if (keyIsDown(LEFT_ARROW)  || keyIsDown(65)) {
    heartVX = -heartSpeed;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    heartVX =  heartSpeed;
  }
  if (keyIsDown(UP_ARROW)    || keyIsDown(87)) {
    heartVY = -heartSpeed;
  }
  if (keyIsDown(DOWN_ARROW)  || keyIsDown(83)) {
    heartVY =  heartSpeed;
  }

  // Normalise diagonal speed
  if (heartVX !== 0 && heartVY !== 0) {
    heartVX *= 0.707; heartVY *= 0.707; 
  }

  heartX = constrain(heartX + heartVX, box.x + 8, box.x + box.w - 8);
  heartY = constrain(heartY + heartVY, box.y + 16, box.y + box.h);
}



function drawSans(x, y, size) {
  push();
  translate(x, y);
  scale(size);

  // Style settings
  stroke(0);
  strokeWeight(2);
  rectMode(CENTER);

  // Body
  fill(30, 144, 255);
  rect(0, 40, 80, 60, 10);
  fill(255);
  ellipse(0, 20, 70, 25);

  // Skull
  fill(255);
  ellipse(0, -10, 100, 85);

  // Eyes
  fill(0);
  ellipse(-22, -15, 20, 25);
  ellipse(22, -15, 20, 25);

  // Pupil
  fill(132, 255, 242);
  ellipse(-22, -15, 15, 20);
  ellipse(22, -15, 15, 20);
  fill(0);
  ellipse(-22, -15, 5, 5);
  ellipse(22, -15, 5, 5);

  // Nose
  fill(0);
  triangle(0, -2, -5, 9, 5, 9);

  // Mouth
  noFill();
  arc(0, 15, 60, 30, 0, PI);
  for (let i = -20; i <= 20; i += 10) {
    line(i, 15, i, 30);
  }
  line(-30, 15, 30, 15);

  pop();
}

function drawHeart(x, y, size) {
  push();
  translate(x, y);
  scale(size);

  // Modify "pixels"
  noStroke();
  fill(255, 0, 0);

  let p = 3 // pixel size

  // Draw heart with pixel blocks
  rect(-2 * p, -3 * p, 2 * p, p);
  rect(1 * p, -3 * p, 2 * p, p);

  rect(-3 * p, -2 * p, 7 * p, 3 * p);

  rect(-2 * p, 1 * p, 5 * p, p);
  rect(-1 * p, 2 * p, 3 * p, p);
  rect(0, 3 * p, p, p);

  pop();
}