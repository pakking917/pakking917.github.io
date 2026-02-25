const level1 = {
  label: "level 1",
  bgColor: [0, 0, 0],
  sansColor: [30, 144, 255],
  dialogues: [
    [
      "* hey.",
      "* you're new around here, huh?",
      "* well...",
      "* let me show you around."
    ],
    [
      "* not bad.",
      "* you've got some moves.",
      "* but we're just getting started."
    ]
  ],
  attacks: [
    { type: 'bone_h', time: 2000, pos: 0.3, speed: 1.5, w: 60, damage: 20 },
    { type: 'bone_h', time: 2800, pos: 0.6, speed: 1.5, w: 60, damage: 1 },
    { type: 'bone_h', time: 3600, pos: 0.5, speed: 2,   w: 60, damage: 1 },
    { type: 'bone_v', time: 4800, pos: 0.3, speed: 1.5, h: 60, damage: 1 },
    { type: 'bone_v', time: 5200, pos: 0.6, speed: 1.5, h: 60, damage: 1 },
    { type: 'bone_h', time: 6000, pos: 0.2, speed: 2,   w: 80, damage: 1 },
    { type: 'bone_h', time: 6000, pos: 0.8, speed: 2,   w: 80, damage: 1 },
  ],
  duration: 8000
};
