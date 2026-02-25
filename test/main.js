// ============================================================
//  KNOCKOFF SANS FIGHT  —  main.js
//
//  Extra for Experts:
//   1. Web Audio API: procedural 8-bit sound synthesis (no files)
//   2. Gamepad API: controller support via navigator.getGamepads()
//   3. localStorage: death counter that Sans comments on
//   4. windowResized(): fully responsive at any window size
// ============================================================

// ── Audio (Web Audio API) ────────────────────────────────────
let audioCtx;

function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function beep(freq, dur = 0.06, vol = 0.18, type = 'square', detune = 0) {
  try {
    const ctx = getAudio();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = detune;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  } catch (e) {}
}

function playHurt()    { beep(180, 0.12, 0.3, 'sawtooth'); }
function playType()    { beep(220 + Math.random() * 80, 0.04, 0.08, 'square'); }
function playBlaster() { beep(80, 0.4, 0.35, 'sawtooth'); beep(60, 0.6, 0.2, 'sawtooth', -200); }
function playWin()     { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.2, 0.2, 'square'), i * 180)); }
function playDead()    { [300, 200, 150, 100].forEach((f, i) => setTimeout(() => beep(f, 0.3, 0.3, 'sawtooth'), i * 200)); }
function playLevelUp() { [392, 523, 659, 784].forEach((f, i) => setTimeout(() => beep(f, 0.15, 0.2, 'square'), i * 120)); }

// ── localStorage death counter ───────────────────────────────
function getDeaths() { return parseInt(localStorage.getItem('sansDeaths') || '0'); }
function addDeath()  { localStorage.setItem('sansDeaths', getDeaths() + 1); }

// ── Level registry (defined in level1.js – level5.js) ────────
const LEVELS = [level1, level2, level3, level4, level5];

// ── Game State ───────────────────────────────────────────────
// States: 'title' | 'intro' | 'battle' | 'levelclear' | 'win' | 'gameover'
let gameState = 'title';
let currentLevel = 0;
let levelStartTime = 0;

// Player
let heartX, heartY;
let heartVX = 0, heartVY = 0;
let playerHP = 20;
const playerMaxHP = 20;
let iframes = 0;
let HEART_SPEED;

// Battle box
let box = {};

// Attacks
let activeAttacks = [];
let attackQueue   = [];

// Dialogue
let dialogueLines = [];
let dialogueIndex = 0;
let charIndex     = 0;
let typeTimer     = 0;
const TYPE_SPEED  = 2; // frames per character
let dialogueDone  = false;
let dialoguePhase = 0; // 0 = pre-battle, 1 = post-battle

// Sans animation
let sansPhase = 'idle'; // idle | talking | attacking
let sansLean  = 0;
let sansX, sansY, spiteScale, baseSize;

// Screen shake
let shakeX = 0, shakeY = 0, shakeMag = 0;

// Particles
let particles = [];

// Screen flash
let flashAlpha = 0;
let flashColor = [255, 255, 255];

// Title pulse timer
let titlePulse = 0;

// ── p5 setup ─────────────────────────────────────────────────
function setup() {
  calcSizes();
  createCanvas(baseSize * 4, baseSize * 3);
  textFont('monospace');
  resetPlayer();
}

function calcSizes() {
  baseSize   = Math.floor(Math.min(windowWidth / 4, windowHeight / 3));
  HEART_SPEED = baseSize * 0.03;
}

// Extra for Experts #4 — windowResized
function windowResized() {
  calcSizes();
  resizeCanvas(baseSize * 4, baseSize * 3);
  spiteScale = baseSize / 100 / 2.2;
  sansX = width / 2;
  sansY = height / 4;
  box = makeBattleBox();
  if (gameState !== 'title') {
    heartX = constrain(heartX, box.x + 8, box.x + box.w - 8);
    heartY = constrain(heartY, box.y + 8, box.y + box.h - 8);
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
  spiteScale = baseSize / 100 / 2.2;
  sansX = width  / 2;
  sansY = height / 4;
  box = makeBattleBox();
  heartX = box.x + box.w / 2;
  heartY = box.y + box.h / 2;
  playerHP = playerMaxHP;
  iframes = 0;
  activeAttacks = [];
  attackQueue   = [];
  particles     = [];
  shakeX = shakeY = shakeMag = 0;
  flashAlpha = 0;
}

// ── Main draw loop ────────────────────────────────────────────
function draw() {
  titlePulse += 0.04;

  if      (gameState === 'title')      drawTitle();
  else if (gameState === 'intro')      drawDialogue(false);
  else if (gameState === 'battle')     drawBattle();
  else if (gameState === 'levelclear') drawDialogue(true);
  else if (gameState === 'win')        drawWinScreen();
  else if (gameState === 'gameover')   drawGameOver();
}

// ── Title screen ──────────────────────────────────────────────
function drawTitle() {
  background(0);

  // Scanline overlay
  for (let y = 0; y < height; y += 4) {
    stroke(10, 10, 10);
    strokeWeight(1);
    line(0, y, width, y);
  }

  drawSans(sansX, sansY + sin(titlePulse) * 4, spiteScale, [30, 144, 255], 'idle', 0);

  noStroke();
  textAlign(CENTER);

  // Title
  let tSize = baseSize * 0.22;
  fill(255);
  textSize(tSize);
  text('* SANS.', width / 2, height * 0.08);

  // Death counter comment from localStorage
  let d = getDeaths();
  if (d > 0) {
    fill(200, 120, 120);
    textSize(baseSize * 0.09);
    let msg = d === 1 ? `* you died once before.`
            : d <  5  ? `* you've died ${d} times.`
            : d < 10  ? `* ${d} deaths. getting better?`
            :            `* ${d} deaths. heh. determination.`;
    text(msg, width / 2, height * 0.88);
  }

  fill(abs(sin(titlePulse)) * 200 + 55);
  textSize(baseSize * 0.1);
  text('press ENTER or Z to start', width / 2, height * 0.93);

  textAlign(LEFT);
}

// ── Dialogue screen ───────────────────────────────────────────
function startDialogue(phase) {
  let lvl       = LEVELS[currentLevel];
  dialogueLines = lvl.dialogues[phase] || [];
  dialogueIndex = 0;
  charIndex     = 0;
  typeTimer     = 0;
  dialogueDone  = false;
  dialoguePhase = phase;
}

function drawDialogue() {
  let lvl = LEVELS[currentLevel];
  background(lvl.bgColor[0], lvl.bgColor[1], lvl.bgColor[2]);

  drawSans(sansX, sansY + sin(frameCount * 0.05) * 3, spiteScale, lvl.sansColor, 'talking', 0);

  // Typewriter advance
  typeTimer++;
  let line = dialogueLines[dialogueIndex] || '';
  if (typeTimer >= TYPE_SPEED && charIndex < line.length) {
    charIndex++;
    typeTimer = 0;
    if (frameCount % 2 === 0) playType();
  }

  drawDialogueBox(line.slice(0, charIndex));

  if (charIndex >= line.length) {
    dialogueDone = true;
    // Blinking continue prompt
    if (sin(frameCount * 0.15) > 0) {
      fill(255); noStroke();
      textSize(baseSize * 0.1);
      textAlign(RIGHT);
      text('▼', width * 0.88, height * 0.88);
      textAlign(LEFT);
    }
  }
}

function drawDialogueBox(txt) {
  let bx = width * 0.05, by = height * 0.72;
  let bw = width * 0.9,  bh = height * 0.2;

  stroke(255);
  strokeWeight(max(2, baseSize * 0.02));
  fill(0);
  rect(bx, by, bw, bh);

  fill(255); noStroke();
  textSize(max(10, baseSize * 0.1));
  textAlign(LEFT);
  text(txt, bx + bw * 0.03, by + bh * 0.38, bw * 0.94, bh * 0.8);
}

// ── Battle ────────────────────────────────────────────────────
function drawBattle() {
  let lvl     = LEVELS[currentLevel];
  let elapsed = millis() - levelStartTime;

  // Spawn queued attacks when their time arrives
  while (attackQueue.length > 0 && attackQueue[0].time <= elapsed) {
    spawnAttack(attackQueue.shift());
  }

  // Screen shake
  if (shakeMag > 0.5) {
    shakeX  = random(-shakeMag, shakeMag);
    shakeY  = random(-shakeMag, shakeMag);
    shakeMag *= 0.85;
  } else {
    shakeX = shakeY = 0;
  }
  translate(shakeX, shakeY);

  background(lvl.bgColor[0], lvl.bgColor[1], lvl.bgColor[2]);

  // Sans lean during attacks
  if (activeAttacks.length > 0) {
    sansPhase = 'attacking';
    sansLean  = lerp(sansLean, 8, 0.08);
  } else {
    sansPhase = 'idle';
    sansLean  = lerp(sansLean, 0, 0.1);
  }

  let bobAmt = sansPhase === 'attacking' ? sin(frameCount * 0.15) * 5 : sin(frameCount * 0.05) * 3;
  drawSans(sansX, sansY + bobAmt, spiteScale, lvl.sansColor, sansPhase, sansLean / 8);

  // Battle box
  stroke(255);
  strokeWeight(max(2, baseSize * 0.025));
  fill(0);
  rect(box.x, box.y, box.w, box.h);

  // Input: keyboard (+ gamepad via Extra for Experts #2)
  // pollGamepad();
  updateHeart();

  // Attacks
  for (let i = activeAttacks.length - 1; i >= 0; i--) {
    activeAttacks[i].update();
    activeAttacks[i].draw();

    if (iframes <= 0 && activeAttacks[i].hits(heartX, heartY)) {
      let dmg = activeAttacks[i].damage || 1;
      playerHP  = max(0, playerHP - dmg);
      iframes   = 45;
      shakeMag  = dmg * 4;
      flashAlpha = 200; flashColor = [255, 0, 0];
      playHurt();
      spawnHurtParticles(heartX, heartY);
      if (playerHP <= 0) { triggerGameOver(); return; }
    }

    if (activeAttacks[i].dead) activeAttacks.splice(i, 1);
  }

  if (iframes > 0) iframes--;

  // Heart (flickers during iframes)
  if (iframes <= 0 || frameCount % 4 < 2) {
    drawHeart(heartX, heartY, spiteScale);
  }

  updateParticles();
  drawHUD();

  // Screen flash
  if (flashAlpha > 0) {
    noStroke();
    fill(flashColor[0], flashColor[1], flashColor[2], flashAlpha);
    rect(0, 0, width, height);
    flashAlpha = max(0, flashAlpha - 12);
  }

  // Level complete when timer ends and all attacks are cleared
  if (elapsed >= lvl.duration && activeAttacks.length === 0) {
    playLevelUp();
    flashAlpha = 180; flashColor = [255, 255, 255];
    gameState = 'levelclear';
    startDialogue(1);
  }
}

// ── Heart movement ────────────────────────────────────────────
function updateHeart() {
  heartVX = 0; heartVY = 0;
  if (keyIsDown(LEFT_ARROW)  || keyIsDown(65)) heartVX = -HEART_SPEED;
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) heartVX =  HEART_SPEED;
  if (keyIsDown(UP_ARROW)    || keyIsDown(87)) heartVY = -HEART_SPEED;
  if (keyIsDown(DOWN_ARROW)  || keyIsDown(83)) heartVY =  HEART_SPEED;

  // Normalise diagonal speed
  if (heartVX !== 0 && heartVY !== 0) { heartVX *= 0.707; heartVY *= 0.707; }

  heartX = constrain(heartX + heartVX, box.x + 6, box.x + box.w - 6);
  heartY = constrain(heartY + heartVY, box.y + 6, box.y + box.h - 6);
}

// Extra for Experts #2 — Gamepad API
// function pollGamepad() {
//   let gps = navigator.getGamepads ? navigator.getGamepads() : [];
//   for (let gp of gps) {
//     if (!gp) continue;
//     let ax = gp.axes[0] || 0;
//     let ay = gp.axes[1] || 0;
//     if (abs(ax) > 0.15) heartVX = ax * HEART_SPEED;
//     if (abs(ay) > 0.15) heartVY = ay * HEART_SPEED;
//     if (gp.buttons[14] && gp.buttons[14].pressed) heartVX = -HEART_SPEED;
//     if (gp.buttons[15] && gp.buttons[15].pressed) heartVX =  HEART_SPEED;
//     if (gp.buttons[12] && gp.buttons[12].pressed) heartVY = -HEART_SPEED;
//     if (gp.buttons[13] && gp.buttons[13].pressed) heartVY =  HEART_SPEED;
//   }
// }

// ── Spawn attacks ─────────────────────────────────────────────
function spawnAttack(data) {
  if (data.type === 'bone_h') {
    activeAttacks.push(new BoneH(data));
  } else if (data.type === 'bone_v') {
    activeAttacks.push(new BoneV(data));
  } else if (data.type === 'blaster') {
    activeAttacks.push(new Blaster(data));
    playBlaster();
    shakeMag   = 5;
    flashAlpha = 60; flashColor = [100, 200, 255];
  }
}

// ── Attack: Horizontal Bone ───────────────────────────────────
class BoneH {
  constructor(data) {
    this.y      = lerp(box.y + 10, box.y + box.h - 10, data.pos);
    this.w      = data.w || 60;
    this.h      = max(10, baseSize * 0.09);
    this.x      = box.x - this.w - 10;
    this.speed  = data.speed * (baseSize / 120);
    this.damage = data.damage || 1;
    this.dead   = false;
  }

  update() {
    this.x += this.speed;
    if (this.x > box.x + box.w + 20) this.dead = true;
  }

  draw() {
    push();
    fill(255); stroke(0); strokeWeight(max(1.5, baseSize * 0.015));
    let r = this.h / 2 + 2;
    ellipse(this.x + this.h / 2,          this.y, r * 2, r * 2);
    ellipse(this.x + this.w - this.h / 2, this.y, r * 2, r * 2);
    noStroke(); fill(255);
    rect(this.x + this.h / 2, this.y - this.h / 2, this.w - this.h, this.h);
    pop();
  }

  hits(hx, hy) {
    return hx > this.x && hx < this.x + this.w &&
           hy > this.y - this.h / 2 - 3 && hy < this.y + this.h / 2 + 3;
  }
}

// ── Attack: Vertical Bone ─────────────────────────────────────
class BoneV {
  constructor(data) {
    this.x      = lerp(box.x + 10, box.x + box.w - 10, data.pos);
    this.h      = data.h || 60;
    this.w      = max(10, baseSize * 0.09);
    this.y      = box.y - this.h - 10;
    this.speed  = data.speed * (baseSize / 120);
    this.damage = data.damage || 1;
    this.dead   = false;
  }

  update() {
    this.y += this.speed;
    if (this.y > box.y + box.h + 20) this.dead = true;
  }

  draw() {
    push();
    fill(255); stroke(0); strokeWeight(max(1.5, baseSize * 0.015));
    let r = this.w / 2 + 2;
    ellipse(this.x, this.y + this.w / 2,          r * 2, r * 2);
    ellipse(this.x, this.y + this.h - this.w / 2, r * 2, r * 2);
    noStroke(); fill(255);
    rect(this.x - this.w / 2, this.y + this.w / 2, this.w, this.h - this.w);
    pop();
  }

  hits(hx, hy) {
    return hx > this.x - this.w / 2 - 3 && hx < this.x + this.w / 2 + 3 &&
           hy > this.y && hy < this.y + this.h;
  }
}

// ── Attack: Gaster Blaster ────────────────────────────────────
class Blaster {
  constructor(data) {
    this.x         = lerp(box.x + 20, box.x + box.w - 20, data.pos);
    this.y         = box.y - baseSize * 0.3;
    this.damage    = data.damage || 3;
    this.dead      = false;
    this.phase     = 'charge'; // charge → fire → fade
    this.timer     = 0;
    this.chargeDur = 60;
    this.fireDur   = 30;
    this.fadeDur   = 20;
    this.beamW     = max(14, baseSize * 0.12);
    this.beamH     = box.h + baseSize * 0.4;
    this.fireY     = box.y - baseSize * 0.05;
    this.alpha     = 0;
  }

  update() {
    this.timer++;
    if (this.phase === 'charge') {
      this.alpha = map(this.timer, 0, this.chargeDur, 0, 255);
      if (this.timer >= this.chargeDur) { this.phase = 'fire'; this.timer = 0; }
    } else if (this.phase === 'fire') {
      this.alpha = 255;
      if (this.timer >= this.fireDur)   { this.phase = 'fade'; this.timer = 0; }
    } else if (this.phase === 'fade') {
      this.alpha = map(this.timer, 0, this.fadeDur, 255, 0);
      if (this.timer >= this.fadeDur)   this.dead = true;
    }
  }

  draw() {
    push();
    if (this.phase === 'charge') {
      let sc = sin(this.timer * 0.3) * 0.2 + 1;
      this._drawSkull(this.x, this.y, sc, this.alpha);
      // Charging particles
      if (random() < 0.5) {
        particles.push({
          x: this.x + random(-20, 20), y: this.y + random(-10, 10),
          vx: random(-1, 1), vy: random(1, 3),
          life: 20, maxLife: 20,
          r: 100, g: 200, b: 255, size: random(3, 7)
        });
      }
    } else {
      this._drawSkull(this.x, this.y, 1, this.alpha);
      let a = this.alpha;
      noStroke();
      fill(100, 220, 255, a * 0.3);
      rect(this.x - this.beamW * 1.8, this.fireY, this.beamW * 3.6, this.beamH);
      fill(200, 240, 255, a * 0.6);
      rect(this.x - this.beamW,       this.fireY, this.beamW * 2,   this.beamH);
      fill(255, 255, 255, a);
      rect(this.x - this.beamW * 0.4, this.fireY, this.beamW * 0.8, this.beamH);
    }
    pop();
  }

  _drawSkull(x, y, sc, al) {
    push();
    translate(x, y);
    scale(sc * spiteScale * 0.7);
    stroke(0, al); strokeWeight(2); fill(255, al);
    ellipse(0, 0, 90, 70);
    fill(0, al);
    ellipse(-20, -5, 18, 22); ellipse(20, -5, 18, 22);
    fill(100, 220, 255, al);
    ellipse(-20, -5, 12, 16); ellipse(20, -5, 12, 16);
    fill(0, al);
    ellipse(-20, -5, 4, 4);   ellipse(20, -5, 4, 4);
    fill(255, al); noStroke();
    for (let i = -20; i <= 20; i += 10) rect(i - 4, 15, 8, 10, 2);
    pop();
  }

  hits(hx, hy) {
    if (this.phase !== 'fire') return false;
    return hx > this.x - this.beamW && hx < this.x + this.beamW &&
           hy > this.fireY && hy < this.fireY + this.beamH;
  }
}

// ── HUD ───────────────────────────────────────────────────────
function drawHUD() {
  let bby = box.y + box.h;
  let pad = baseSize * 0.04;

  fill(255); noStroke();
  textSize(max(9, baseSize * 0.09));
  textAlign(LEFT);
  text('HP', box.x, bby + pad + baseSize * 0.11);

  let barX = box.x + baseSize * 0.25;
  let barY = bby + pad;
  let barW = box.w - baseSize * 0.28;
  let barH = max(10, baseSize * 0.12);

  fill(60); noStroke();
  rect(barX, barY, barW, barH);

  let pct      = playerHP / playerMaxHP;
  let hpColor  = pct > 0.5 ? color(255, 220, 0)
               : pct > 0.25 ? color(255, 140, 0)
               :               color(255, 50, 50);
  fill(hpColor);
  rect(barX, barY, barW * pct, barH);

  stroke(255); strokeWeight(max(1.5, baseSize * 0.015)); noFill();
  rect(barX, barY, barW, barH);

  fill(255); noStroke();
  textSize(max(8, baseSize * 0.085));
  textAlign(RIGHT);
  text(`${playerHP} / ${playerMaxHP}`, barX + barW, barY - baseSize * 0.01);

  // Level label
  textAlign(CENTER);
  textSize(max(8, baseSize * 0.08));
  fill(150);
  text(LEVELS[currentLevel].label, width / 2, box.y - pad * 0.5);

  textAlign(LEFT);
}

// ── Particles ─────────────────────────────────────────────────
function spawnHurtParticles(x, y) {
  for (let i = 0; i < 12; i++) {
    let a = random(TWO_PI);
    particles.push({
      x, y,
      vx: cos(a) * random(1, 4),
      vy: sin(a) * random(1, 4),
      life: 25, maxLife: 25,
      r: 255, g: 30, b: 30, size: random(3, 7)
    });
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life--;
    let al = map(p.life, 0, p.maxLife, 0, 255);
    noStroke(); fill(p.r, p.g, p.b, al);
    rect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    if (p.life <= 0) particles.splice(i, 1);
  }
}

// ── Win / Game Over screens ───────────────────────────────────
function drawWinScreen() {
  background(0);
  drawSans(sansX, sansY + sin(titlePulse) * 3, spiteScale, [30, 144, 255], 'idle', 0);

  fill(255); noStroke(); textAlign(CENTER);
  textSize(baseSize * 0.25);
  text('* you win.', width / 2, height * 0.06);

  fill(200);
  textSize(baseSize * 0.1);
  text('* heh. not bad, kid.', width / 2, height * 0.17);
  text(`* deaths: ${getDeaths()}`,         width / 2, height * 0.24);

  fill(abs(sin(titlePulse)) * 200 + 55);
  textSize(baseSize * 0.1);
  text('press ENTER to play again', width / 2, height * 0.93);
  textAlign(LEFT);
}

function drawGameOver() {
  background(0);

  fill(255, 50, 50); noStroke(); textAlign(CENTER);
  textSize(baseSize * 0.28);
  if (sin(titlePulse * 3) > -0.3) {
    text('GAME OVER', width / 2, height * 0.45);
  }

  fill(180);
  textSize(baseSize * 0.1);
  text(`HP ran out on ${LEVELS[currentLevel].label}`, width / 2, height * 0.58);
  text(`total deaths: ${getDeaths()}`,                width / 2, height * 0.66);

  fill(abs(sin(titlePulse)) * 200 + 55);
  textSize(baseSize * 0.1);
  text('press ENTER to try again', width / 2, height * 0.82);
  textAlign(LEFT);
}

function triggerGameOver() {
  addDeath();
  playDead();
  gameState = 'gameover';
}

// ── Sans sprite ───────────────────────────────────────────────
function drawSans(x, y, size, col, phase, lean) {
  push();
  translate(x, y);
  scale(size);
  rotate(lean * 0.08);

  stroke(0); strokeWeight(2); rectMode(CENTER);

  // Body
  fill(col[0], col[1], col[2]);
  rect(0, 40, 80, 60, 10);

  // Collar
  fill(255);
  ellipse(0, 12, 72, 26);

  // Head
  fill(255);
  ellipse(0, -10, 100, 85);

  // Eye sockets
  fill(0);
  ellipse(-22, -15, 20, 25);
  ellipse( 22, -15, 20, 25);

  // Pupils
  fill(132, 255, 242);
  ellipse(-22, -15, 15, 20);
  ellipse( 22, -15, 15, 20);
  fill(0);
  ellipse(-22, -15, 5, 5);
  ellipse( 22, -15, 5, 5);

  // Pupil glow when attacking
  if (phase === 'attacking') {
    noStroke(); fill(132, 255, 242, 80);
    ellipse(-22, -15, 28, 34);
    ellipse( 22, -15, 28, 34);
  }

  // Nose
  fill(0); stroke(0);
  triangle(0, -2, -5, 9, 5, 9);

  // Mouth — open while talking
  noFill(); stroke(0); strokeWeight(2);
  if (phase === 'talking' && sin(frameCount * 0.2) > 0) {
    arc(0, 15, 55, 35, 0, PI);
    for (let i = -20; i <= 20; i += 10) line(i, 15, i, 30);
    line(-27, 15, 27, 15);
  } else {
    arc(0, 15, 55, 28, 0, PI);
    for (let i = -20; i <= 20; i += 10) line(i, 15, i, 27);
    line(-27, 15, 27, 15);
  }

  pop();
}

// ── Heart sprite ──────────────────────────────────────────────
function drawHeart(x, y, size) {
  push();
  translate(x, y);
  scale(size * 1.2);
  noStroke(); fill(255, 0, 0);
  let p = 3;
  rect(-2 * p, -3 * p, 2 * p, p);
  rect( 1 * p, -3 * p, 2 * p, p);
  rect(-3 * p, -2 * p, 7 * p, 3 * p);
  rect(-2 * p,  1 * p, 5 * p, p);
  rect(-1 * p,  2 * p, 3 * p, p);
  rect(     0,  3 * p, p,     p);
  pop();
}

// ── Input ─────────────────────────────────────────────────────
function keyPressed() {
  if (keyCode === ENTER || key === 'z' || key === 'Z') {
    handleAdvance();
  }
}

function mousePressed() {
  handleAdvance();
}

function handleAdvance() {
  if (gameState === 'title') {
    gameState = 'intro';
    currentLevel = 0;
    playerHP = playerMaxHP;
    startDialogue(0);

  } else if (gameState === 'intro' || gameState === 'levelclear') {
    if (!dialogueDone) {
      // Skip to end of current line
      charIndex = (dialogueLines[dialogueIndex] || '').length;
    } else {
      dialogueIndex++;
      if (dialogueIndex >= dialogueLines.length) {
        if (gameState === 'intro') {
          // Start the battle
          box = makeBattleBox();
          heartX = box.x + box.w / 2;
          heartY = box.y + box.h / 2;
          activeAttacks  = [];
          attackQueue    = [...LEVELS[currentLevel].attacks];
          levelStartTime = millis();
          particles      = [];
          gameState      = 'battle';
          sansPhase      = 'idle';
        } else {
          // Level clear — move to next level or win
          currentLevel++;
          if (currentLevel >= LEVELS.length) {
            playWin();
            gameState = 'win';
          } else {
            playerHP  = min(playerMaxHP, playerHP + 4); // small heal between levels
            gameState = 'intro';
            startDialogue(0);
          }
        }
      } else {
        // Next dialogue line
        charIndex    = 0;
        typeTimer    = 0;
        dialogueDone = false;
      }
    }

  } else if (gameState === 'win' || gameState === 'gameover') {
    resetPlayer();
    currentLevel = 0;
    playerHP     = playerMaxHP;
    gameState    = 'title';
  }
}
