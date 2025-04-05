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

// Next level experience
pub const NEXT_LEVEL_EXPERIENCE: u8 = 20;

// Zero address
pub fn ZERO_ADDRESS() -> ContractAddress {
    contract_address_const::<0x0>()
}

// Seconds per day
pub const SECONDS_PER_DAY: u64 = 86400;

// Total seconds in 3,6 minutes
pub const SECONDS_IN_3_MINUTES: u64 = 220;
// total seconds in 5 minutes
pub const SECONDS_IN_5_MINUTES: u64 = 300;


// Sleeping mechanics
pub const POINTS_PER_SECOND: u8 = 80; 
pub const MAX_RECOVER_TIME: u32 = 8000;
