// Starknet import
use starknet::ContractAddress;

// Types imports
use tamagotchi::types::beast::{BeastType};
use tamagotchi::types::food::{FoodType};

// Constants import
use tamagotchi::constants;

#[derive(Drop, Serde, IntrospectPacked,  Debug)]
#[dojo::model]
pub struct Beast {
    #[key]
    pub player: ContractAddress, 
    #[key]
    pub beast_id: u16,
    pub specie: u8,
    pub beast_type: u8,
    pub evolved: bool,
    pub vaulted: bool
}

#[generate_trait]
pub impl BeastImpl of BeastTrait {
    #[inline(always)]
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

    #[inline(always)]
    fn feed(ref self: Beast, food_id: u8) -> (u8, u8, u8) {
        if self.is_favorite_meal(food_id){
            // (hunger, happiness, energy)
            (constants::XL_UPDATE_POINTS, constants::XL_UPDATE_POINTS, constants::XL_UPDATE_POINTS)
        }
        else{
            // (hunger, happiness, energy)
            (constants::S_UPDATE_POINTS, constants::S_UPDATE_POINTS, constants::S_UPDATE_POINTS)
        }
    }
}

#[cfg(test)]
mod tests {
    use super::Beast;
    use starknet::contract_address_const;

    #[test]
    #[available_gas(300000)]
    fn test_beast_initialization() {
        let player_address = contract_address_const::<0x123>();

        let beast = Beast {
            player: player_address,
            beast_id: 1,
            specie: 1,
            beast_type: 1,
            evolved: false,
            vaulted: false,
        };

        assert_eq!(beast.player, player_address, "Player address should match");
        assert_eq!(beast.beast_id, 1, "Beast ID should be 1");
        assert_eq!(beast.specie, 1, "Specie should be 1");
        assert!(!beast.evolved, "Beast should not be evolved initially");
        assert!(!beast.vaulted, "Beast should not be vaulted initially");
    }

    #[test]
    #[available_gas(300000)]
    fn test_multiple_beasts_per_player() {
        let player_address = contract_address_const::<0x123>();
        
        let beast1 = Beast {
            player: player_address,
            beast_id: 1,
            specie: 1,
            beast_type: 1,
            evolved: false,
            vaulted: false,
        };

        let beast2 = Beast {
            player: player_address,
            beast_id: 2,
            specie: 2,
            beast_type: 2,
            evolved: false,
            vaulted: false,
        };

        assert_eq!(beast1.player, beast2.player, "Beasts should belong to same player");
        assert!(beast1.beast_id != beast2.beast_id, "Beasts should have different IDs");
        assert!(beast1.specie != beast2.specie, "Beasts should be different species");
    }

    #[test]
    #[available_gas(300000)]
    fn test_evolved_beast() {
        let player_address = contract_address_const::<0x123>();
        
        let evolved_beast = Beast {
            player: player_address,
            beast_id: 1,
            specie: 1,
            beast_type: 1,
            evolved: true,
            vaulted: false,
        };

        assert!(evolved_beast.evolved, "Beast should be evolved");
    }

    #[test]
    #[available_gas(300000)]
    fn test_vaulted_beast() {
        let player_address = contract_address_const::<0x123>();
        
        let vaulted_beast = Beast {
            player: player_address,
            beast_id: 1,
            specie: 1,
            beast_type: 1,
            evolved: false,
            vaulted: true,
        };

        assert!(vaulted_beast.vaulted, "Beast should be vaulted");
    }

    #[test]
    #[available_gas(300000)]
    fn test_beast_id_consistency() {
        let player_address = contract_address_const::<0x123>();
        
        let beast = Beast {
            player: player_address,
            beast_id: 1,
            specie: 1,
            beast_type: 1,
            evolved: false,
            vaulted: false,
        };

        assert_eq!(beast.beast_id, 1, "Beast ID should be 1");
    }
}
