// Starknet import
use starknet::{ContractAddress, contract_address_const};

// Max status values for a Beast
const MAX_HUNGER : u8 = 100;
const MAX_ENERGY: u8 = 100;
const MAX_HAPPINESS: u8 = 100;
const MAX_HYGIENE: u8 = 100;

// Tap counter max value
const MAX_TAP_COUNTER: u8 = 10;

// Max food amount per player
const MAX_FOOD_AMOUNT: u8 = 50;

// Max level as babybeast
const MAX_BABY_LEVEL: u8 = 15;

// Increase or decrease values
const XS_UPDATE_POINTS: u8 = 2;
const S_UPDATE_POINTS: u8 = 5;
const M_UPDATE_POINTS: u8 = 8;
const L_UPDATE_POINTS: u8 = 12;
const XL_UPDATE_POINTS: u8 = 15;

// Next level experience
const NEXT_LEVEL_EXPERIENCE: u8 = 20;

// Zero address
fn ZERO_ADDRESS() -> ContractAddress {
    contract_address_const::<0x0>()
}
