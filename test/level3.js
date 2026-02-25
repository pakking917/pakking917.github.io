const level3 = {
  label: "level 3",
  bgColor: [0, 0, 20],
  sansColor: [10, 90, 200],
  dialogues: [
    [
      "* ok.",
      "* i'll be real with you.",
      "* i've been holding back.",
      "* not anymore."
    ],
    [
      "* heh heh heh.",
      "* you're actually pretty good.",
      "* this is getting fun."
    ]
  ],
  attacks: [
    { type: 'bone_h', time: 1000, pos: 0.2,  speed: 3,   w: 65, damage: 1 },
    { type: 'bone_h', time: 1000, pos: 0.8,  speed: 3,   w: 65, damage: 1 },
    { type: 'bone_v', time: 1800, pos: 0.2,  speed: 2.5, h: 65, damage: 1 },
    { type: 'bone_v', time: 1800, pos: 0.5,  speed: 2.5, h: 65, damage: 1 },
    { type: 'bone_v', time: 1800, pos: 0.8,  speed: 2.5, h: 65, damage: 1 },
    { type: 'bone_h', time: 3000, pos: 0.3,  speed: 3.5, w: 55, damage: 1 },
    { type: 'bone_h', time: 3200, pos: 0.5,  speed: 3.5, w: 55, damage: 1 },
    { type: 'bone_h', time: 3400, pos: 0.7,  speed: 3.5, w: 55, damage: 1 },
    { type: 'blaster',time: 5000, pos: 0.3,  damage: 3 },
    { type: 'blaster',time: 5500, pos: 0.7,  damage: 3 },
    { type: 'bone_h', time: 7000, pos: 0.25, speed: 4,   w: 50, damage: 1 },
    { type: 'bone_h', time: 7200, pos: 0.5,  speed: 4,   w: 50, damage: 1 },
    { type: 'bone_h', time: 7400, pos: 0.75, speed: 4,   w: 50, damage: 1 },
    { type: 'bone_v', time: 8500, pos: 0.4,  speed: 3,   h: 50, damage: 1 },
    { type: 'bone_v', time: 8500, pos: 0.6,  speed: 3,   h: 50, damage: 1 },
  ],
  duration: 11000
};
