// Interactive Scene Assignemnt
// Pak King Lee
// Feb 9, 2026
//
// Extra for Experts:
// - Resizing window
// - Local storage for death count
// - Editted html and added extra files to better contain level info

// Variables setup
// Game env. setup
let gameState = "intro";
let box = {};
let spiteScale;
let baseSize;
const LEVELS = [level1, level2]; //, level2, level3, level4, level5];
let iframes = 0; // invincibility frames


// Player and sans setup
let sansX, sansY;
let heartX, heartY;
let heartVX = 0, heartVY = 0;
let currentLevel = 0;
const playerMaxHP = 92;
let playerHP = playerMaxHP;
let heartSpeed;

// Attacks
let activeAttacks = [];
let attackQueue   = [];
let levelStartTime = 0;

// Dialogue
let dialogueLines = [];
let dialogueIndex = 0;
let dialogueDone  = false;

function setup() {
  calcSizes();
  createCanvas(baseSize * 4, baseSize * 3);
  spiteScale = baseSize / 100 / 2.5;
  textFont('monospace');
  resetPlayer();
  startDialogue(0);
  // box = makeBattleBox();
}

function draw() {
  background(0);
  if (gameState === "intro") drawIntro();
  else if (gameState === "battle") drawBattle();
  else if (gameState === "levelclear") drawLevelClear();
  else if (gameState === "win") drawWin();
  else if (gameState === "gameover") drawGameOver();
}

// Sizing
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
  if (gameState !== "intro") {
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
  playerHP = playerMaxHP;
  iframes = 0;
  activeAttacks = [];
  attackQueue   = [];

}


// Local Storage for death counts
function getDeaths() { 
  return parseInt(localStorage.getItem('sansDeaths') || '0'); 
}

function addDeath()  { 
  localStorage.setItem('sansDeaths', getDeaths() + 1); 
}

// Dialogue helpers
function startDialogue(phase) {
  dialogueLines = LEVELS[currentLevel].dialogues[phase] || [];
  dialogueIndex = 0;
  dialogueDone  = false;
}

// Draws the dialogue box
function drawDialogueBox() {
  let bx = width  * 0.05;
  let by = height * 0.72;
  let bw = width  * 0.9;
  let bh = height * 0.2;

  stroke(255);
  strokeWeight(baseSize / 50);
  fill(0);
  rect(bx, by, bw, bh);

  // Show the full current line immediately
  fill(255); noStroke();
  textSize(max(10, baseSize * 0.1));
  textAlign(LEFT);
  text(dialogueLines[dialogueIndex] || '', bx + bw * 0.03, by + bh * 0.4, bw * 0.94, bh * 0.8);

  // Blinking arrow to prompt the player to click
  dialogueDone = true;
  if (frameCount % 40 < 20) {
    text('▼', bx + bw * 0.97, by + bh * 0.75);
  }

  textAlign(LEFT);

}


// Intro (Before battle)
function drawIntro() {
  sansX = width / 2;
  drawSans(sansX, sansY, spiteScale);
  
  stroke(255); 
  strokeWeight(baseSize / 50);
  fill(0);
  rect(width / 10, height / 2 , width * 4 / 5, height * 4 / 10)
  
  drawDialogueBox();
  drawHUD();
  
  drawHeart(heartX, heartY, spiteScale);
  updateHeart();
}

// Battle
function drawBattle() {
  let elapsedTime = millis() - levelStartTime;

  // Spawn attacks from the queue when their time arrives
  while (attackQueue.length > 0 && attackQueue[0].time <= elapsedTime) {
    spawnAttack(attackQueue.shift());
  }

  drawSans(sansX, sansY, spiteScale);

  // Battle box
  stroke(255);
  strokeWeight(baseSize / 50);
  fill(0);
  rect(box.x, box.y, box.w, box.h);

  // Update and draw each active attack, check collision with heart
  for (let i = activeAttacks.length - 1; i >= 0; i--) {
    activeAttacks[i].update();
    activeAttacks[i].draw();

    if (iframes <= 0 && activeAttacks[i].hits(heartX, heartY)) {
      playerHP -= activeAttacks[i].damage;
      iframes   = 45; // 0.75s of invincibility
      if (playerHP <= 0) {
        playerHP = 0;
        addDeath();
        gameState = "gameover";
        return;
      }
    }

    if (activeAttacks[i].dead) activeAttacks.splice(i, 1);
  }

  if (iframes > 0) iframes--;

  updateHeart();
  drawHeart(heartX, heartY, spiteScale);
  drawHUD();

  // Level ends when the timer runs out and all attacks are gone
  if (elapsedTime >= LEVELS[currentLevel].duration && activeAttacks.length === 0) {
    gameState = "levelclear";
    startDialogue(1);
  }
}

// Level clear
function drawLevelClear() {
  drawSans(sansX, sansY, spiteScale);

  stroke(255);
  strokeWeight(baseSize / 50);
  fill(0);
  rect(width / 10, height / 2, width * 4 / 5, height * 4 / 10);

  drawDialogueBox();
  drawHUD();
}


// Win screen
function drawWin() {
  fill(255); noStroke(); textAlign(CENTER);
  textSize(baseSize * 0.25);
  text('* you win.', width / 2, height * 0.4);
  textSize(baseSize * 0.1);
  text('* not bad.', width / 2, height * 0.55);
  text('deaths: ' + getDeaths(), width / 2, height * 0.65);
  textSize(baseSize * 0.09);
  text('click to play again', width / 2, height * 0.8);
  textAlign(LEFT);
}


// Game over screen
function drawGameOver() {
  fill(255, 50, 50); noStroke(); textAlign(CENTER);
  textSize(baseSize * 0.28);
  text('GAME OVER', width / 2, height * 0.4);
  fill(200);
  textSize(baseSize * 0.1);
  text('deaths: ' + getDeaths(), width / 2, height * 0.58);
  textSize(baseSize * 0.09);
  fill(255);
  text('click to try again', width / 2, height * 0.75);
  textAlign(LEFT);
}

// HP Bar
function drawHUD() {
  let barX = box.x;
  let barY = box.y + box.h + baseSize * 0.08;
  let barW = box.w;
  let barH = max(10, baseSize * 0.1);

  // Label
  fill(255); noStroke();
  textSize(max(9, baseSize * 0.09));
  textAlign(LEFT);
  text('HP', barX, barY + barH * 0.85);

  // Background
  let labelW = baseSize * 0.22;
  fill(60); noStroke();
  rect(barX + labelW, barY, barW - labelW, barH);

  // Fill — colour shifts yellow → orange → red as HP drops
  let pct = playerHP / playerMaxHP;
  if      (pct > 0.5)  fill(255, 220,   0);
  else if (pct > 0.25) fill(255, 140,   0);
  else                  fill(255,  50,  50);
  rect(barX + labelW, barY, (barW - labelW) * pct, barH);

  // Border
  stroke(255); strokeWeight(max(1.5, baseSize * 0.015)); noFill();
  rect(barX + labelW, barY, barW - labelW, barH);

  // Numbers
  fill(255); noStroke();
  textSize(max(8, baseSize * 0.085));
  textAlign(RIGHT);
  text(playerHP + ' / ' + playerMaxHP, barX + barW, barY - 2);

  // Level label
  textAlign(CENTER);
  textSize(max(8, baseSize * 0.08));
  fill(150);
  text(LEVELS[currentLevel].label, width / 2, box.y - baseSize * 0.04);

  textAlign(LEFT);
}

// Spawn attacks
function spawnAttack(levelData) {
  if (levelData.type === 'bone_h')  {
    activeAttacks.push(new BoneH(levelData));
  }
  else if (levelData.type === 'bone_v')  {
    activeAttacks.push(new BoneV(levelData));
  }

}


// ── Attack: Horizontal Bone ───────────────────────────────────
// Moves left → right across the battle box at a fixed y position
class BoneH {
  constructor(data) {
    this.w      = data.w || 60;              // bone length
    this.bh     = max(10, baseSize * 0.09);  // bone thickness
    this.y      = lerp(box.y + this.bh / 2, box.y + box.h - this.bh / 2, data.pos); // 0=top, 1=bottom
    this.x      = box.x - this.w - 10;      // start just off the left edge
    this.speed  = data.speed * (baseSize / 120);
    this.damage = data.damage || 1;
    this.dead   = false;
  }

  update() {
    this.x += this.speed;
    if (this.x > box.x + box.w + 20) {
      this.dead = true; // off the bottom edge
    }
  }

  draw() {
    push();
    fill(255); 
    stroke(0); 
    strokeWeight(max(1.5, baseSize * 0.015));
    rect(this.x, this.y - this.bh / 2, this.w, this.bh);
    pop();
  }

  // rectangle collision check (AABB)
  hits(hX, hY) {
    return hX > this.x &&
           hX < this.x + this.w &&
           hY > this.y - this.bh / 2 - 3 &&
           hY < this.y + this.bh / 2 + 3;
  }
}


// ── Attack: Vertical Bone ─────────────────────────────────────
// Moves top → bottom across the battle box at a fixed x position
class BoneV {
  constructor(data) {
    this.h      = data.h || 60;
    this.bw     = max(10, baseSize * 0.09);  // bone thickness
    this.x      = lerp(box.x, box.x + box.w, data.pos); // 0=left, 1=right
    this.y      = box.y - this.h - 10;      // start just above the top edge
    this.speed  = data.speed * (baseSize / 120);
    this.damage = data.damage || 1;
    this.dead   = false;
  }

  update() {
    this.y += this.speed;
    if (this.y > box.y + box.h + 20) {
      this.dead = true; // off the bottom edge
    }
  }

  draw() {
    push();
    fill(255); 
    stroke(0); 
    strokeWeight(max(1.5, baseSize * 0.015));
    rect(this.x - this.bw / 2, this.y, this.bw, this.h);
    pop();
  }

  // rectangle collision check (AABB)
  hits(hX, hY) {
    return hX > this.x - this.bw / 2 - 3 &&
           hX < this.x + this.bw / 2 + 3 &&
           hY > this.y &&
           hY < this.y + this.h;
  }
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
    heartVX *= 1/Math.sqrt(2); heartVY *= 1/Math.sqrt(2); 
  }

  heartX = constrain(heartX + heartVX, box.x + 8, box.x + box.w - 8);
  heartY = constrain(heartY + heartVY, box.y + 16, box.y + box.h);
}


function mousePressed() {
  if (gameState === 'intro' || gameState === 'levelclear') {
    dialogueIndex++

    if (dialogueIndex < dialogueLines.length) {
      dialogueDone = false
    }
    else {
      if (gameState === 'intro') {
          // Start the battle
          box = makeBattleBox();
          heartX = box.x + box.w / 2;
          heartY = box.y + box.h / 2;
          activeAttacks  = [];
          attackQueue    = [...LEVELS[currentLevel].attacks];
          levelStartTime = millis();
          gameState      = 'battle';
          sansPhase      = 'idle';
      } 

      else {
        // Level clear, move to next level or win
        currentLevel++;
      if (currentLevel >= LEVELS.length) {
            gameState = 'win';
        } 
      else {
            gameState = 'intro';
            startDialogue(0);
        }
      }

    } 
  } 
  
  else if (gameState === 'win' || gameState === 'gameover') {
    resetPlayer();
    currentLevel = 0;
    gameState = "intro";
    startDialogue(0);
  }
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