import babyWolfIdle from "../assets/beasts/BabyWolf-idle.gif"
import babyWolfEat from "../assets/beasts/BabyWolf-Eat.gif"
import babyWolfPlay from  "../assets/beasts/BabyWolf- jump.gif"
import babyWolfSleep from "../assets/beasts/BabyWolf-sleep.gif"
import babyWolfClean from "../assets/beasts/BabyWolf-shower.gif"
import babyFoxIdle from "../assets/beasts/BabyFox-idle.gif"
import babyFoxEat from "../assets/beasts/BabyFox-Eat.gif"
import babyFoxPlay from "../assets/beasts/BabyFox-idle.gif"
import babyFoxSleep from "../assets/beasts/BabyFox-Sleep.gif"
import babyFoxClean from "../assets/beasts/BabyFox-Shower.gif"
import babyDragonIdle from "../assets/beasts/Dragon-Flame-Idle.gif"
import babyDragonEat from "../assets/beasts/Dragon-Flame-Idle.gif"
import babyDragonPlay from "../assets/beasts/Dragon-Flame-Play.gif"
import babyDragoSleep from "../assets/beasts/Dragon-Flame-Sleep.gif"
import babyDragonClean from "../assets/beasts/Dragon-Flame-Shower.gif"

export interface iBeastDex {
  name: string;
  description: string;
  specie: number;
  idlePicture: string;
  eatPicture: string;
  playPicture: string;
  sleepPicture: string;
  cleanPicture: string;
  cuddlePicture: string;
  BeastsType?: string;
  Height?: string;
  Weight?: string;
  Attack?: string;
  Defense?: string;
  Speed?: string;
  EffectiveAgainst?: string[];
  WeakAgainst?: string[];
  BeastsEvolutions?: string[];
  FavoriteFood?: string[];
  BeastsCharacteristics?: string[];
  Bio?: string[];
}

const beastsDex: iBeastDex[]= [
  { 
    name: "WolfPup",
    description: "The wolf is a social animal that lives in packs",
    specie: 0,
    idlePicture: babyWolfIdle,
    eatPicture: babyWolfEat,
    playPicture: babyWolfPlay,
    sleepPicture: babyWolfSleep,
    cleanPicture: babyWolfClean,
    cuddlePicture: babyWolfPlay,
    BeastsType: "Shadow",
    Height: "0.6m",
    Weight: "3kg",
    Attack: "8",
    Defense: "6",
    Speed: "9",
    EffectiveAgainst: ["Magic", "Light"],
    WeakAgainst: ["Crystal", "Draconic"],
    BeastsEvolutions: ["WolfPup", "AlphaWolf"],
    FavoriteFood: ["Beef", "Blueberry", "Potato"],
    BeastsCharacteristics: [
      "Energetic and social",
      "Strong pack instincts",
      "Protective and playful"
    ],
    Bio: [
      "Born with a protective and playful spirit, BabyWolf is always ready for new adventures and to defend their own."
    ]
  },
  { 
    name: "Foxling",
    description: "The fox is a small carnivorous mammal that is found in many parts of the world",
    specie: 1,
    idlePicture: babyFoxIdle,
    eatPicture: babyFoxEat,
    playPicture: babyFoxPlay,
    sleepPicture: babyFoxSleep,
    cleanPicture: babyFoxClean,
    cuddlePicture: babyFoxPlay,
    BeastsType: "Magic",
    Height: "0.5m",
    Weight: "2kg",
    Attack: "3",
    Defense: "5",
    Speed: "8",
    EffectiveAgainst: ["Crystal", "Light"],
    WeakAgainst: ["Shadow", "Draconic"],
    BeastsEvolutions: ["Foxling", "ShadowFox"],
    FavoriteFood: ["Chicken", "Apple", "Cheese"],
    BeastsCharacteristics: [
      "Clever and witty",
      "Enjoys solving puzzles",
      "Curious and adventurous"
    ],
    Bio: [
      "Born with an adventurous spirit and sharp mind, BabyFox is always ready to explore and discover new things."
    ]
  },
  { 
    name: "Solarius",
    description: "Solarius is a celestial dragon that radiates light and warmth, guiding lost souls through the skies.",
    specie: 2,
    idlePicture: babyDragonIdle,
    eatPicture: babyDragonEat,
    playPicture: babyDragonPlay,
    sleepPicture: babyDragoSleep,
    cleanPicture: babyDragonClean,
    cuddlePicture: babyDragonPlay,
    BeastsType: "Draconic",
    Height: "0.2m",
    Weight: "800g",
    Attack: "5",
    Defense: "3",
    Speed: "6",
    EffectiveAgainst: ["Ice", "Shadow"],
    WeakAgainst: ["Magic"],
    BeastsEvolutions: ["Helionis", "Aetherion"],
    FavoriteFood: ["Fish", "Cherry", "Corn"],
    BeastsCharacteristics: [
      "Radiates warmth and celestial energy",
      "Soars through the skies, leaving a trail of light",
      "A protector of lost souls and guardian of the dawn"
    ],
    Bio: [
      "Born from the first rays of the sun, Solarius carries the essence of light and renewal, guiding those in darkness toward hope and illumination."
    ]
  },
]

export default beastsDex;
