// Starknet import
use starknet::ContractAddress;

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct Food {
    #[key]
    pub player: ContractAddress, 
    #[key]
    pub id: u8,
    pub name: felt252,
    pub amount: u32,
}


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
            id: 1_u8,
            name: 'Apple',
            amount: 5_u32,
        };

        assert_eq!(food.player, player_address, "Player address should match");
        assert_eq!(food.id, 1_u8, "Food ID should be 1");
        assert_eq!(food.name, 'Apple', "Food name should be 'Apple'");
        assert_eq!(food.amount, 5_u32, "Food amount should be 5");
    }

    #[test]
    #[available_gas(300000)]
    fn test_multiple_food_items() {
        let player_address: ContractAddress = contract_address_const::<0x123>();
        
        let apple = Food {
            player: player_address,
            id: 1_u8,
            name: 'Apple',
            amount: 5_u32,
        };

        let banana = Food {
            player: player_address,
            id: 2_u8,
            name: 'Banana',
            amount: 3_u32,
        };

        assert_eq!(apple.player, banana.player, "Both foods should belong to same player");
        assert!(apple.id != banana.id, "Food items should have different IDs");
        assert!(apple.name != banana.name, "Food items should have different names");
    }

    #[test]
    #[available_gas(300000)]
    fn test_food_for_different_players() {
        let player1_address: ContractAddress = contract_address_const::<0x123>();
        let player2_address: ContractAddress = contract_address_const::<0x456>();

        let player1_food = Food {
            player: player1_address,
            id: 1_u8,
            name: 'Apple',
            amount: 5_u32,
        };

        let player2_food = Food {
            player: player2_address,
            id: 1_u8,
            name: 'Apple',
            amount: 3_u32,
        };

        assert!(player1_food.player != player2_food.player, "Foods should belong to different players");
        assert_eq!(player1_food.id, player2_food.id, "Foods can have same ID for different players");
        assert_eq!(player1_food.name, player2_food.name, "Foods should have same name");
    }

    #[test]
    #[available_gas(300000)]
    fn test_food_with_zero_amount() {
        let player_address: ContractAddress = contract_address_const::<0x123>();
        
        let food = Food {
            player: player_address,
            id: 1_u8,
            name: 'Apple',
            amount: 0_u32,
        };

        assert_eq!(food.amount, 0_u32, "Food amount should be 0");
    }
}