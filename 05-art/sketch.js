// Generative art demo

const THE_SIZE = 5;
let theTiles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  let someTile;
  for (let x = THE_SIZE / 2; x < width; x += THE_SIZE) {
    for (let y = THE_SIZE / 2; y < height; y += THE_SIZE) {
      someTile = spawnTile(x, y, THE_SIZE);
      theTiles.push(someTile);
    }
  }
}

function draw() {
  background(220);
  for (let tile of theTiles) {
    line(tile.x1, tile.y1, tile.x2, tile.y2);
  }
}

function spawnTile(x, y, arbitraryLength) {
  let tile;
  if (Math.random() < 0.5) {
    tile = {
      x1: x - arbitraryLength / 2,
      y1: y + arbitraryLength / 2,
      x2: x + arbitraryLength / 2,
      y2: y - arbitraryLength / 2
    };

  }
  else {
    tile = {
      x1: x - arbitraryLength / 2,
      y1: y - arbitraryLength / 2,
      x2: x + arbitraryLength / 2,
      y2: y + arbitraryLength / 2
    };
  }
  return tile;
}