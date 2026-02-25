const level2 = {
  label: "level 2",
  bgColor: [0, 0, 10],
  sansColor: [20, 120, 220],
  dialogues: [
    [
      "* heh.",
      "* so you're still here.",
      "* guess i'll have to try a little harder."
    ],
    [
      "* wow.",
      "* you're pretty determined.",
      "* ...or just stubborn."
    ]
  ],
  attacks: [
    { type: 'bone_h', time: 1500, pos: 0.25, speed: 2.5, w: 70, damage: 1 },
    { type: 'bone_h', time: 1500, pos: 0.75, speed: 2.5, w: 70, damage: 1 },
    { type: 'bone_v', time: 2500, pos: 0.25, speed: 2,   h: 70, damage: 1 },
    { type: 'bone_v', time: 2500, pos: 0.75, speed: 2,   h: 70, damage: 1 },
    { type: 'bone_h', time: 3800, pos: 0.5,  speed: 3,   w: 50, damage: 1 },
    { type: 'bone_h', time: 4200, pos: 0.35, speed: 3,   w: 50, damage: 1 },
    { type: 'bone_h', time: 4600, pos: 0.65, speed: 3,   w: 50, damage: 1 },
    { type: 'blaster',time: 6000, pos: 0.5,  damage: 3 },
    { type: 'bone_h', time: 7000, pos: 0.4,  speed: 3,   w: 55, damage: 1 },
    { type: 'bone_h', time: 7000, pos: 0.6,  speed: 3,   w: 55, damage: 1 },
  ],
  duration: 9500
};
