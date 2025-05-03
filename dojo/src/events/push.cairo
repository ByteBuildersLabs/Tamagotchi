// Starknet import
use starknet::ContractAddress;

// Event
#[derive(Drop, Serde)]
#[dojo::event]
pub struct PushToken {
    #[key]
    pub player_address: ContractAddress, 
    pub token: ByteArray,
}
