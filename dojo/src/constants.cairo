// Starknet import
use starknet::{ContractAddress, contract_address_const};

// Max status values for a Beast
pub const MAX_HUNGER : u8 = 100;
pub const MAX_ENERGY: u8 = 100;
pub const MAX_HAPPINESS: u8 = 100;
pub const MAX_HYGIENE: u8 = 100;

// Tap counter max value
pub const MAX_TAP_COUNTER: u8 = 10;

// Max food amount per player
pub const MAX_FOOD_AMOUNT: u8 = 50;

// Max level as babybeast
pub const MAX_BABY_LEVEL: u8 = 15;

// Increase or decrease values
pub const XS_UPDATE_POINTS: u8 = 2;
pub const S_UPDATE_POINTS: u8 = 5;
pub const M_UPDATE_POINTS: u8 = 8;
pub const L_UPDATE_POINTS: u8 = 12;
pub const XL_UPDATE_POINTS: u8 = 15;

// Next level experience
pub const NEXT_LEVEL_EXPERIENCE: u8 = 20;

// Zero address
pub fn ZERO_ADDRESS() -> ContractAddress {
    contract_address_const::<0x0>()
}

// Seconds per day
pub const SECONDS_PER_DAY: u64 = 86400;
