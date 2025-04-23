// Starknet imports
use starknet::{ContractAddress};

//Model
#[derive(Drop, Serde, Copy, IntrospectPacked, Debug)]
#[dojo::model]
pub struct HighestScore {
    #[key]
    pub minigame_id: u16,
    #[key]
    pub player: ContractAddress, 
    pub score: u32,
}
