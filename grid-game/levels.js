let level1 = {
  label: "Level 1",
  optimalMoves: 3, 
  playerStartingPosition: [[2, 1], [3, 1]], // [ [x, y], [x, y] ]
  map: [
    [4, 4, 4, 4, 4, 4], // 0 = wall, 1 = floor, 2 = box, 3 = goal, 4 = void
    [4, 4, 1, 1, 4, 4], 
    [4, 0, 1, 1, 1, 4],
    [4, 1, 1, 1, 2, 4],
    [4, 1, 3, 3, 0, 4],
    [4, 4, 4, 4, 4, 4]
  ]
};

let level2 = {
  label: "Level 2",
  optimalMoves: 5,
  playerStartingPosition: [[1, 1], [1, 4]],
  map: [
    [4, 4, 4, 4, 4], // 0 = wall, 1 = floor, 2 = box, 3 = goal, 4 = void
    [4, 1, 4, 4, 4],
    [4, 1, 1, 1, 4],
    [4, 1, 1, 1, 4],
    [4, 1, 1, 3, 4],
    [4, 0, 1, 3, 4],
    [4, 4, 4, 4, 4]
]
};


let level3 = {
  label: "Level 3",
  optimalMoves: 6,
  playerStartingPosition: [[2, 1], [3, 1]],
  map: [
    [0, 0, 0, 0, 0, 0], // 0 = wall, 1 = floor, 2 = box, 3 = goal, 4 = void
    [0, 1, 1, 1, 1, 0],
    [0, 2, 2, 2, 1, 0],
    [0, 3, 1, 1, 1, 0],
    [0, 1, 3, 1, 1, 0],
    [0, 1, 1, 1, 1, 0],
    [0, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0]
  ]
};

let level4 = {
  label: "Level 4",
  optimalMoves: 6,
  playerStartingPosition: [[1, 1], [4, 2]],
  map: [
    [4, 4, 4, 4, 4, 4, 4], // 0 = wall, 1 = floor, 2 = box, 3 = goal, 4 = void
    [4, 1, 1, 1, 4, 4, 4],
    [4, 1, 2, 4, 1, 1, 0],
    [4, 4, 3, 4, 1, 1, 4],
    [4, 4, 1, 4, 1, 4, 4],
    [4, 4, 0, 4, 3, 4, 4],
    [4, 4, 4, 4, 4, 4, 4]
  ]
};

let level5 = {
  label: "Level 1",
  optimalMoves: 3, 
  playerStartingPosition: [[2, 1], [3, 1]], // [ [x, y], [x, y] ]
  map: [
    [4, 4, 4, 4, 4, 4], // 0 = wall, 1 = floor, 2 = box, 3 = goal, 4 = void
    [4, 4, 1, 1, 4, 4], 
    [4, 0, 1, 1, 1, 4],
    [4, 1, 1, 1, 2, 4],
    [4, 1, 3, 3, 0, 4],
    [4, 4, 4, 4, 4, 4]
  ]
};

let level6 = {
  label: "Level 1",
  optimalMoves: 3, 
  playerStartingPosition: [[2, 1], [3, 1]], // [ [x, y], [x, y] ]
  map: [
    [4, 4, 4, 4, 4, 4], // 0 = wall, 1 = floor, 2 = box, 3 = goal, 4 = void
    [4, 4, 1, 1, 4, 4], 
    [4, 0, 1, 1, 1, 4],
    [4, 1, 1, 1, 2, 4],
    [4, 1, 3, 3, 0, 4],
    [4, 4, 4, 4, 4, 4]
  ]
};

let level7 = {
  label: "Level 1",
  optimalMoves: 3, 
  playerStartingPosition: [[2, 1], [3, 1]], // [ [x, y], [x, y] ]
  map: [
    [4, 4, 4, 4, 4, 4], // 0 = wall, 1 = floor, 2 = box, 3 = goal, 4 = void
    [4, 4, 1, 1, 4, 4], 
    [4, 0, 1, 1, 1, 4],
    [4, 1, 1, 1, 2, 4],
    [4, 1, 3, 3, 0, 4],
    [4, 4, 4, 4, 4, 4]
  ]
};

let level8 = {
  label: "Level 1",
  optimalMoves: 3, 
  playerStartingPosition: [[2, 1], [3, 1]], // [ [x, y], [x, y] ]
  map: [
    [4, 4, 4, 4, 4, 4], // 0 = wall, 1 = floor, 2 = box, 3 = goal, 4 = void
    [4, 4, 1, 1, 4, 4], 
    [4, 0, 1, 1, 1, 4],
    [4, 1, 1, 1, 2, 4],
    [4, 1, 3, 3, 0, 4],
    [4, 4, 4, 4, 4, 4]
  ]
};

let level9 = {
  label: "Level 1",
  optimalMoves: 3, 
  playerStartingPosition: [[2, 1], [3, 1]], // [ [x, y], [x, y] ]
  map: [
    [4, 4, 4, 4, 4, 4], // 0 = wall, 1 = floor, 2 = box, 3 = goal, 4 = void
    [4, 4, 1, 1, 4, 4], 
    [4, 0, 1, 1, 1, 4],
    [4, 1, 1, 1, 2, 4],
    [4, 1, 3, 3, 0, 4],
    [4, 4, 4, 4, 4, 4]
  ]
};

let level10 = {
  label: "Level 10",
  optimalMoves: 9,
  playerStartingPosition: [[2, 1], [3, 1]],
  map: [
    [0, 0, 0, 0, 0, 0], // 0 = wall, 1 = floor, 2 = box, 3 = goal, 4 = void
    [0, 1, 1, 1, 1, 0],
    [0, 2, 2, 2, 1, 0],
    [0, 1, 1, 2, 1, 0],
    [0, 1, 0, 1, 1, 0],
    [0, 1, 3, 3, 1, 0],
    [0, 0, 0, 0, 0, 0]
  ]
};

let level11 = {
  label: "Level 11",
  optimalMoves: 100, 
  playerStartingPosition: [[4, 2], [5, 2]], // [ [x, y], [x, y] ]
  map: [
    [4, 4, 4, 4, 4, 4, 4, 4, 4], // 0 = wall, 1 = floor, 2 = box, 3 = goal, 4 = void
    [4, 1, 1, 1, 1, 3, 4, 4, 4],
    [4, 1, 1, 1, 1, 1, 1, 1, 4],
    [4, 1, 2, 1, 1, 1, 3, 1, 4],
    [4, 4, 1, 1, 1, 0, 1, 1, 4],
    [4, 4, 1, 1, 1, 1, 1, 1, 4],
    [4, 4, 4, 4, 4, 4, 4, 4, 4],
  ]
};
