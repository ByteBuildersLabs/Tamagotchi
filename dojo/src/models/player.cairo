// Starknet import
use starknet::ContractAddress;

// Model imports
use babybeasts::models::beast::{Beast};

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct Player {
    #[key]
    pub address: ContractAddress, 
    pub current_beast_id: u32
}

#[cfg(test)]
mod tests {
    use super::Player;
    use starknet::{ContractAddress, contract_address_const};

    #[test]
    #[available_gas(1000000)]
    fn test_player_initialization() {
        // Use contract_address_const to create a mock address
        let mock_address: ContractAddress = contract_address_const::<0x123>();
        let initial_beast_id: u32 = 1;

        let player = Player {
            address: mock_address,
            current_beast_id: initial_beast_id,
        };

        assert_eq!(
            player.address, 
            mock_address, 
            "Player address should match the initialized address"
        );
        assert_eq!(
            player.current_beast_id, 
            initial_beast_id, 
            "Current beast ID should be 1"
        );
    }

    #[test]
    #[available_gas(1000000)]
    fn test_player_with_zero_beast() {
        let mock_address: ContractAddress = contract_address_const::<0x456>();
        
        let player = Player {
            address: mock_address,
            current_beast_id: 0,
        };

        assert_eq!(
            player.current_beast_id, 
            0, 
            "Initial beast ID should be 0 for new player"
        );
    }

    #[test]
    #[available_gas(1000000)]
    fn test_player_address_uniqueness() {
        let address1: ContractAddress = contract_address_const::<0x123>();
        let address2: ContractAddress = contract_address_const::<0x456>();

        let player1 = Player {
            address: address1,
            current_beast_id: 1,
        };

        let player2 = Player {
            address: address2,
            current_beast_id: 2,
        };

        assert!(
            player1.address != player2.address, 
            "Players should have unique addresses"
        );
    }
}