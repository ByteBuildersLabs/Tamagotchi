// Starknet import
use starknet::{ContractAddress, contract_address_const};

// Max status values for a Beast
pub const MAX_HUNGER : u8 = 100;
pub const MAX_ENERGY: u8 = 100;
pub const MAX_HAPPINESS: u8 = 100;
pub const MAX_HYGIENE: u8 = 100;
pub const MAX_POINTS: u64 = 100;
pub const HALF_POINTS: u8 = 50;

// Status values to init a Beast
pub const MIN_INITIAL_STATUS: u8 = 70;
pub const MAX_INITIAL_STATUS: u8 = 90;

// Tap counter max value
pub const MAX_TAP_COUNTER: u8 = 10;

// Max food amount per player
pub const MAX_FOOD_AMOUNT: u8 = 5;

// Max level as babybeast
pub const MAX_BABY_LEVEL: u8 = 15;

// Increase or decrease values
pub const XS_UPDATE_POINTS: u8 = 2;
pub const S_UPDATE_POINTS: u8 = 4;
pub const M_UPDATE_POINTS: u8 = 6;
pub const L_UPDATE_POINTS: u8 = 8;
pub const XL_UPDATE_POINTS: u8 = 10;

// Achievements
pub const ACHIEVEMENTS_COUNT: u8 = 54;
pub const PLAY_MINIGAMES_ACHIEVEMENTS_COUNT: u8 = 4;
pub const BYTEBITES_ACHIEVEMENTS_COUNT: u8 = 5;
pub const PET_ACHIEVEMENTS_COUNT: u8 = 5;
pub const SLEEP_ACHIEVEMENTS_COUNT: u8 = 5;
pub const CLEAN_ACHIEVEMENTS_COUNT: u8 = 5;
pub const ECHONETWORK_ACHIEVEMENTS_COUNT: u8 = 5;
pub const NEURALLINK_ACHIEVEMENTS_COUNT: u8 = 5;
// ScoreHunter
pub const PLAY_MINIGAMES_INITIAL_COUNT: u8 = 1;
pub const SCOREHUNTERI_POINTS: u32 = 2000;
pub const SCOREHUNTERII_POINTS: u32 = 5000;
pub const SCOREHUNTERIII_POINTS: u32 = 12000;
pub const SCOREHUNTERIV_POINTS: u32 = 20000;
pub const SCOREHUNTERV_POINTS: u32 = 50000;
// Jumper
pub const JUMPERI_POINTS: u32 = 500;
pub const JUMPERII_POINTS: u32 = 1500;
pub const JUMPERIII_POINTS: u32 = 2500;
pub const JUMPERIV_POINTS: u32 = 3500;
pub const JUMPERV_POINTS: u32 = 4500;
// Tango
pub const TANGOI_POINTS: u32 = 25;
pub const TANGOII_POINTS: u32 = 50;
pub const TANGOIII_POINTS: u32 = 100;
pub const TANGOIV_POINTS: u32 = 200;
pub const TANGOV_POINTS: u32 = 350;
// ArenaRockstar
pub const ARENAROCKSTARI_POINTS: u32 = 500;
pub const ARENAROCKSTARII_POINTS: u32 = 1500;
pub const ARENAROCKSTARIII_POINTS: u32 = 3000;
pub const ARENAROCKSTARIV_POINTS: u32 = 5000;
pub const ARENAROCKSTARV_POINTS: u32 = 9999;
// ByteBites
pub const BYTEBITES_INITIAL_ID: u8 = 35;
// BeastFriend
pub const PET_INITIAL_ID: u8 = 40;
// NapMaster
pub const SLEEP_INITIAL_ID: u8 = 45;
// CleanStreakI
pub const CLEAN_INITIAL_ID: u8 = 50;
// EchoNetwork
pub const ECHONETWORK_INITIAL_ID: u8 = 20;
// NeuralLink
pub const NEURALLINK_INITIAL_ID: u8 = 30;

// Next level experience
pub const NEXT_LEVEL_EXPERIENCE: u8 = 20;

// Zero address
pub fn ZERO_ADDRESS() -> ContractAddress {
    contract_address_const::<0x0>()
}

// Seconds per day
pub const SECONDS_PER_DAY: u64 = 86400;

// Total seconds in 3,6 minutes
pub const SECONDS_IN_3_6_MINUTES: u64 = 220;
// Total seconds in 5 minutes
pub const SECONDS_IN_5_MINUTES: u64 = 300;
// Total seconds in 5 minutes
pub const SECONDS_IN_6_MINUTES: u64 = 360;
// Total seconds in 3 minutes
pub const SECONDS_IN_3_MINUTES: u64 = 180;

// Sleeping mechanics
pub const TOTAL_RECOVER_TIME: u64 = 18000; // Based on 1 point every 3 minutes increase rate | 5 hours to fully recover
