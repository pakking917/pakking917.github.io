// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


function setup() {
  createCanvas(windowWidth, windowHeight);
  let bgb;
  console.log(bgb);
  console.log(maxSpan([1,2,3,4,5,6,7,7]));
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

