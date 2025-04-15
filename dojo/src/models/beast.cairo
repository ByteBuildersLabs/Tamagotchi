// Starknet import
use starknet::ContractAddress;

// Types imports
use tamagotchi::types::beast::{BeastType};
use tamagotchi::types::food::{FoodType};

// Constants import
use tamagotchi::constants;

// Helpers
use tamagotchi::helpers::pseudo_random::PseudoRandom;

//Model
#[derive(Drop, Serde, Copy, IntrospectPacked, Debug)]
#[dojo::model]
pub struct Beast {
    #[key]
    pub player: ContractAddress, 
    #[key]
    pub beast_id: u16,
    pub age: u16,
    pub birth_date: u64,
    pub specie: u8,
    pub beast_type: u8
}

// Traits implementation
#[generate_trait]
pub impl BeastImpl of BeastTrait {
    // Function to calculate the age of a beast
    fn calculate_age(ref self: Beast, current_timestamp: u64) {
        let total_seconds: u64 =  current_timestamp - self.birth_date;
        
        let total_days: u64 = total_seconds / 3600; // 86400: total seconds in a day
        
        self.age = total_days.try_into().unwrap();
    }

    fn get_favorite_foods(self: Beast) -> Array<u8> {
        let beast_type: BeastType = self.beast_type.into();
        
        match beast_type {
            BeastType::Light => {
                // Cherry (3), Fish (10), Corn (15)
                array![3, 10, 15]
            },
            BeastType::Magic => {
                // Chicken (8), Apple (1), Cheese (7)
                array![8, 1, 7]
            },
            BeastType::Shadow => {
                // Beef (13), BlueBerry (12), Potato (16)
                array![13, 12, 16]
            },
            _ => {
                // By default, use Apple
                array![1]
            }
        }
    }

    fn is_favorite_meal(ref self: Beast, food_id: u8) -> bool {
        let beast_type: BeastType = self.beast_type.into();
        match beast_type {
            BeastType::Light => {
                let food_id: FoodType = food_id.into();
                match food_id {
                    FoodType::Cherry => true,
                    FoodType::Fish => true,
                    FoodType::Corn => true,
                    _ => false,
                }
            },
            BeastType::Magic => {
                let food_id: FoodType = food_id.into();
                match food_id {
                    FoodType::Chicken => true,
                    FoodType::Apple => true,
                    FoodType::Cheese => true,
                    _ => false,
                }
            },
            BeastType::Shadow => {
                let food_id: FoodType = food_id.into();
                match food_id {
                    FoodType::Beef => true,
                    FoodType::BlueBerry => true,
                    FoodType::Potato => true,
                    _ => false,
                }
            },
            _ => false,
        }
    }

    fn get_random_favorite_food(self: Beast, beast_id: u16) -> u8 {
        let favorites = self.get_favorite_foods();
        let count: u32 = favorites.len();
    
        // Convert count to u8 and subtract 1
        let max_index: u8 = (count - 1).try_into().unwrap();
        
        // Choose a random index
        let random_index = PseudoRandom::generate_random_u8(beast_id, 1, 0, max_index);
        
        // Return the selected favorite food
        *favorites.at(random_index.into())
    }

    fn get_random_common_food(self: Beast, beast_id: u16) -> u8 {
        // Common foods that are not favorites for any type
        let common_food_ids = array![4, 5, 6, 11, 14]; 
        
        // Choose a random index (between 0 and 4)
        let random_index = PseudoRandom::generate_random_u8(beast_id, 2, 0, 4);
        
        // Return the selected common food
        *common_food_ids.at(random_index.into())
    }

    fn feed(ref self: Beast, food_id: u8) -> (u8, u8, u8) {
        if self.is_favorite_meal(food_id){
            // (hunger, happiness, energy)
            (constants::L_UPDATE_POINTS, constants::S_UPDATE_POINTS, constants::XS_UPDATE_POINTS)
        }
        else{
            // (hunger, happiness, energy)
            (constants::S_UPDATE_POINTS, constants::S_UPDATE_POINTS, constants::XS_UPDATE_POINTS)
        }
    }
}

// Tests
#[cfg(test)]
mod tests {
    use super::Beast;
    use super::BeastTrait;
    use starknet::contract_address_const;

    #[test]
    #[available_gas(300000)]
    fn test_beast_initialization() {
        let player_address = contract_address_const::<0x123>();

        let beast = Beast {
            player: player_address,
            beast_id: 1,
            birth_date: 5000,
            age: 1,
            specie: 1,
            beast_type: 1,
        };

        assert_eq!(beast.player, player_address, "Player address should match");
        assert_eq!(beast.beast_id, 1, "Beast ID should be 1");
        assert_eq!(beast.specie, 1, "Specie should be 1");
    }

    #[test]
    #[available_gas(300000)]
    fn test_beast_id_consistency() {
        let player_address = contract_address_const::<0x123>();
        
        let beast = Beast {
            player: player_address,
            beast_id: 1,
            age: 1,
            birth_date: 5000,
            specie: 1,
            beast_type: 1,
        };

        assert_eq!(beast.beast_id, 1, "Beast ID should be 1");
    }

    #[test]
    #[available_gas(300000)]
    fn test_get_random_favorite_food() {
        // Create beast instances for each type
        let player_address = contract_address_const::<0x123>();
        
        // Beast Light (beast_type = 1)
        let light_beast = Beast {
            player: player_address,
            beast_id: 1,
            age: 1,
            birth_date: 5000,
            specie: 1,
            beast_type: 1, // Light
        };
        
        // Beast Magic (beast_type = 2)
        let magic_beast = Beast {
            player: player_address,
            beast_id: 2,
            age: 1,
            birth_date: 5000,
            specie: 1,
            beast_type: 2, // Magic
        };
        
        // Beast Shadow (beast_type = 3)
        let shadow_beast = Beast {
            player: player_address,
            beast_id: 3,
            age: 1,
            birth_date: 5000,
            specie: 1,
            beast_type: 3, // Shadow
        };
        
        // Light beast - should be one of: Cherry (3), Fish (10), Corn (15)
        let light_food = light_beast.get_random_favorite_food(1);
        let is_valid_light_favorite = 
            light_food == 3 || light_food == 10 || light_food == 15;
        assert(is_valid_light_favorite, 'Invalid Light favorite food');
        
        // magic beast - should be one of: Chicken (8), Apple (1), Cheese (7)
        let magic_food = magic_beast.get_random_favorite_food(2);
        let is_valid_magic_favorite = 
            magic_food == 8 || magic_food == 1 || magic_food == 7;
        assert(is_valid_magic_favorite, 'Invalid Magic favorite food');
        
        // Shadow beast - should be one of: Beef (13), BlueBerry (12), Potato (16)
        let shadow_food = shadow_beast.get_random_favorite_food(3);
        let is_valid_shadow_favorite = 
            shadow_food == 13 || shadow_food == 12 || shadow_food == 16;
        assert(is_valid_shadow_favorite, 'Invalid Shadow favorite food');
    }

    #[test]
    #[available_gas(300000)]
    fn test_get_random_common_food() {
        let player_address = contract_address_const::<0x123>();
        let mut beast = Beast {
            player: player_address,
            beast_id: 1,
            age: 1,
            birth_date: 5000,
            specie: 1,
            beast_type: 1, // Light
        };
        
        // Get common food
        let common_food = beast.get_random_common_food(1);
        
        // Verify that common food is not favorite
        let is_favorite = beast.is_favorite_meal(common_food);
        assert(!is_favorite, 'Food should not be favorite');
        
        // Verify that common food is in the predefined list of common foods
        let is_valid_common = 
            common_food == 4 || common_food == 5 || common_food == 6 || 
            common_food == 11 || common_food == 14;
        assert(is_valid_common, 'Invalid common food');
    }

    #[test]
    #[available_gas(300000)]
    fn test_different_beasts_different_foods() {
        let player_address = contract_address_const::<0x123>();
        
        let beast1 = Beast {
            player: player_address,
            beast_id: 1,
            age: 1,
            birth_date: 5000,
            specie: 1,
            beast_type: 1, 
        };
        
        let beast2 = Beast {
            player: player_address,
            beast_id: 2, 
            age: 1,
            birth_date: 5000,
            specie: 1,
            beast_type: 1, 
        };
        
        // The beast_id are different, so they should get different foods
        let favorite_food1 = beast1.get_random_favorite_food(1);
        let favorite_food2 = beast2.get_random_favorite_food(2);
        
        let common_food1 = beast1.get_random_common_food(1);
        let common_food2 = beast2.get_random_common_food(2);
        
        // Verify that they are valid foods for their type
        let is_valid_favorite1 = 
            favorite_food1 == 3 || favorite_food1 == 10 || favorite_food1 == 15;
        assert(is_valid_favorite1, 'Invalid favorite food 1');
        
        let is_valid_favorite2 = 
            favorite_food2 == 3 || favorite_food2 == 10 || favorite_food2 == 15;
        assert(is_valid_favorite2, 'Invalid favorite food 2');
        
        let is_valid_common1 = 
            common_food1 == 4 || common_food1 == 5 || common_food1 == 6 || 
            common_food1 == 11 || common_food1 == 14;
        assert(is_valid_common1, 'Invalid common food 1');
        
        let is_valid_common2 = 
            common_food2 == 4 || common_food2 == 5 || common_food2 == 6 || 
            common_food2 == 11 || common_food2 == 14;
        assert(is_valid_common2, 'Invalid common food 2');
    }

}
