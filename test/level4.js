const level4 = {
  label: "level 4",
  bgColor: [5, 0, 20],
  sansColor: [0, 60, 180],
  dialogues: [
    [
      "* ...",
      "* you know what?",
      "* i'm a little impressed.",
      "* just a little.",
      "* don't let it go to your head."
    ],
    [
      "* ok.",
      "* NOW i'm impressed.",
      "* but this is the part where i stop going easy."
    ]
  ],
  attacks: [
    { type: 'bone_h', time: 800,  pos: 0.15, speed: 4,   w: 55, damage: 1 },
    { type: 'bone_h', time: 800,  pos: 0.85, speed: 4,   w: 55, damage: 1 },
    { type: 'bone_v', time: 1400, pos: 0.15, speed: 3.5, h: 55, damage: 1 },
    { type: 'bone_v', time: 1400, pos: 0.5,  speed: 3.5, h: 55, damage: 1 },
    { type: 'bone_v', time: 1400, pos: 0.85, speed: 3.5, h: 55, damage: 1 },
    { type: 'blaster',time: 3000, pos: 0.25, damage: 3 },
    { type: 'blaster',time: 3200, pos: 0.75, damage: 3 },
    { type: 'bone_h', time: 4500, pos: 0.3,  speed: 4.5, w: 45, damage: 1 },
    { type: 'bone_h', time: 4700, pos: 0.5,  speed: 4.5, w: 45, damage: 1 },
    { type: 'bone_h', time: 4900, pos: 0.7,  speed: 4.5, w: 45, damage: 1 },
    { type: 'bone_v', time: 6000, pos: 0.2,  speed: 4,   h: 45, damage: 1 },
    { type: 'bone_v', time: 6000, pos: 0.4,  speed: 4,   h: 45, damage: 1 },
    { type: 'bone_v', time: 6000, pos: 0.6,  speed: 4,   h: 45, damage: 1 },
    { type: 'bone_v', time: 6000, pos: 0.8,  speed: 4,   h: 45, damage: 1 },
    { type: 'blaster',time: 7500, pos: 0.5,  damage: 3 },
    { type: 'bone_h', time: 9000, pos: 0.2,  speed: 5,   w: 40, damage: 1 },
    { type: 'bone_h', time: 9000, pos: 0.4,  speed: 5,   w: 40, damage: 1 },
    { type: 'bone_h', time: 9000, pos: 0.6,  speed: 5,   w: 40, damage: 1 },
    { type: 'bone_h', time: 9000, pos: 0.8,  speed: 5,   w: 40, damage: 1 },
  ],
  duration: 13000
};
