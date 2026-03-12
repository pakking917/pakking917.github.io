// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


function setup() {
  createCanvas(windowWidth, windowHeight);
  let bgb = 35;
  while (bgb > 25) {
    console.log(bgb);
    bgb--;
  }
}

function draw() {
  background(0);
}

function maxSpan(nums) {
  let maxSkibidi = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = nums.length - 1; j >= 0; j--) {
      if (nums[j] === nums[i]) {
        if (j - i + 1 > maxSkibidi) {
          maxSkibidi = j - i + 1;        
        }
        break;
      }
    }
  }
  return maxSkibidi;
}

