// Starknet import
use starknet::{ContractAddress, contract_address_const};

// Max status values for a Beast
const MAX_HUNGER : u32 = 100;
const MAX_ENERGY: u32 = 100;
const MAX_HAPPINESS: u32 = 100;
const MAX_HYGIENE: u32 = 100;

// Tap counter max value
const MAX_TAP_COUNTER: u32 = 10;

// Max food amount per player
const MAX_FOOD_AMOUNT: u32 = 50;

// Max level as babybeast
const MAX_BABY_LEVEL: u32 = 15;

// Increase or decrease values
const XS_UPDATE_POINTS: u32 = 2;
const S_UPDATE_POINTS: u32 = 5;
const M_UPDATE_POINTS: u32 = 8;
const L_UPDATE_POINTS: u32 = 12;
const XL_UPDATE_POINTS: u32 = 15;

// Next level experience
const NEXT_LEVEL_EXPERIENCE: u32 = 20;

// Zero address
fn ZERO_ADDRESS() -> ContractAddress {
    contract_address_const::<0x0>()
}
