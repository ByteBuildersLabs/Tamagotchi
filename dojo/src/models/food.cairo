// Starknet import
use starknet::ContractAddress;

// Model
#[derive(Drop, Serde, IntrospectPacked, Debug)]
#[dojo::model]
pub struct Food {
    #[key]
    pub player: ContractAddress, 
    #[key]
    pub id: u8,
    pub amount: u8,
}

// Tests
#[cfg(test)]
mod tests {
    use super::Food;
    use starknet::{ContractAddress, contract_address_const};

    #[test]
    #[available_gas(300000)]
    fn test_food_initialization() {
        let player_address: ContractAddress = contract_address_const::<0x123>();
        
        let food = Food {
            player: player_address,
            id: 1,
            amount: 5,
        };

        assert_eq!(food.player, player_address, "Player address should match");
        assert_eq!(food.id, 1, "Food ID should be 1");
        assert_eq!(food.amount, 5, "Food amount should be 5");
    }

    #[test]
    #[available_gas(300000)]
    fn test_multiple_food_items() {
        let player_address: ContractAddress = contract_address_const::<0x123>();
        
        let apple = Food {
            player: player_address,
            id: 1,
            amount: 5,
        };

        let banana = Food {
            player: player_address,
            id: 2,
            amount: 3,
        };

        assert_eq!(apple.player, banana.player, "Both foods should belong to same player");
        assert!(apple.id != banana.id, "Food items should have different IDs");
    }

    #[test]
    #[available_gas(300000)]
    fn test_food_for_different_players() {
        let player1_address: ContractAddress = contract_address_const::<0x123>();
        let player2_address: ContractAddress = contract_address_const::<0x456>();

        let player1_food = Food {
            player: player1_address,
            id: 1,
            amount: 5,
        };

        let player2_food = Food {
            player: player2_address,
            id: 1,
            amount: 3,
        };

        assert!(player1_food.player != player2_food.player, "Foods should belong to different players");
        assert_eq!(player1_food.id, player2_food.id, "Foods can have same ID for different players");
    }

    #[test]
    #[available_gas(300000)]
    fn test_food_with_zero_amount() {
        let player_address: ContractAddress = contract_address_const::<0x123>();
        
        let food = Food {
            player: player_address,
            id: 1,
            amount: 0,
        };

        assert_eq!(food.amount, 0, "Food amount should be 0");
    }
}