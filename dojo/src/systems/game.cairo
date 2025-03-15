// Types import
use tamagotchi::models::beast_status::BeastStatus;

// Starknet import
use starknet::ContractAddress;

// Interface definition
#[starknet::interface]
pub trait IGame<T> {
    // ------------------------- Beast methods -------------------------
    fn spawn_beast(ref self: T, specie: u8, beast_type: u8);
    fn update_beast(ref self: T);
    fn feed(ref self: T, food_id: u8);
    fn sleep(ref self: T);
    fn awake(ref self: T);
    fn play(ref self: T);
    fn pet(ref self: T);
    fn clean(ref self: T);
    fn revive(ref self: T);

    // ------------------------- Read Calls -------------------------
    fn get_timestamp_based_status(ref self: T) -> BeastStatus;
    fn get_timestamp_based_status_with_address(ref self: T, address: ContractAddress) -> BeastStatus;
    fn get_beast_age(ref self: T) -> u16;
    fn get_beast_age_with_address(ref self: T, address: ContractAddress) -> u16;
}

#[dojo::contract]
pub mod game {
    // Local import
    use super::{IGame};

    // Starknet imports
    use starknet::{ContractAddress};
    use starknet::get_block_timestamp;
    use starknet::storage::{ 
        StoragePointerWriteAccess, 
        StoragePointerReadAccess, 
    };
    
    // Model imports
    #[allow(unused_imports)]
    use tamagotchi::models::beast::{Beast, BeastTrait};
    use tamagotchi::models::beast_status::{BeastStatus, BeastStatusTrait};
    use tamagotchi::models::player::{Player, PlayerAssert};
    use tamagotchi::models::food::{Food};

    // Constants import
    use tamagotchi::constants;

    // Store import
    use tamagotchi::store::{StoreTrait};

    // Dojo Imports
    #[allow(unused_imports)]
    use dojo::model::{ModelStorage};

     // Storage
     #[storage]
     struct Storage {
         beast_counter: u16,
     }

    // Constructor
    fn dojo_init( ref self: ContractState) {
        self.beast_counter.write(1);
    }

    // Implementation of the interface methods
    #[abi(embed_v0)]
    impl GameImpl of IGame<ContractState> {
        // ------------------------- Beast methods -------------------------
        fn spawn_beast(ref self: ContractState, specie: u8, beast_type: u8) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            
            let current_beast_id = self.beast_counter.read();

            store.new_beast_status(current_beast_id);
            store.new_beast(current_beast_id, specie, beast_type);

            self.beast_counter.write(current_beast_id+1);
        }

         // This method is used to update the beast related data and write it to the world
        fn update_beast(ref self: ContractState) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            let current_timestamp = get_block_timestamp();
            
            let player: Player = store.read_player();
            player.assert_exists();
            
            // Update beast status and write it to the world
            let beast_id = player.current_beast_id;
            let mut beast_status: BeastStatus = store.read_beast_status(beast_id);
            beast_status.calculate_timestamp_based_status(current_timestamp);   
            store.write_beast_status(@beast_status);
            
            // Update beast and write it to the world
            let mut beast: Beast = store.read_beast(beast_id);
            beast.calculate_age(current_timestamp);
            store.write_beast(@beast);
        }

        fn feed(ref self: ContractState, food_id: u8) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();
            let beast_id = player.current_beast_id;
            let mut beast: Beast = store.read_beast(beast_id);
            let mut food: Food = store.read_food(food_id);
           
            // Status retrieved by calculation
            let mut beast_status = self.get_timestamp_based_status();

            if beast_status.is_alive == true {
                // Validate food is not negative
                if food.amount > 0 {
                    food.amount = food.amount - 1;
                    // Get status accordingly to the beast favorite meals
                    let (hunger, happiness, energy) = beast.feed(food_id);
                    beast_status.hunger = beast_status.hunger + hunger;
                    beast_status.happiness = beast_status.happiness + happiness;
                    beast_status.energy = beast_status.energy + energy;

                    if beast_status.hunger > constants::MAX_HUNGER {
                        beast_status.hunger = constants::MAX_HUNGER;
                    }
                    if beast_status.energy > constants::MAX_ENERGY {
                        beast_status.energy = constants::MAX_ENERGY;
                    }
                    if beast_status.happiness > constants::MAX_HAPPINESS {
                        beast_status.happiness = constants::MAX_HAPPINESS;
                    }
                    store.write_food(@food);
                    store.write_beast_status(@beast_status);
                }
            }
        }

        fn sleep(ref self: ContractState) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();

            // Status retrieved by calculation
            let mut beast_status = self.get_timestamp_based_status();

            if beast_status.is_alive == true {
                beast_status.energy = beast_status.energy + constants::XL_UPDATE_POINTS;
                if beast_status.energy > constants::MAX_ENERGY {
                    beast_status.energy = constants::MAX_ENERGY;
                }
                beast_status.happiness = beast_status.happiness + constants::M_UPDATE_POINTS;
                if beast_status.happiness > constants::MAX_HAPPINESS {
                    beast_status.happiness = constants::MAX_HAPPINESS;
                }
                beast_status.is_awake = false;
                store.write_beast_status(@beast_status);
            }
        }

        fn awake(ref self: ContractState) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();

           // Status retrieved by calculation
            let mut beast_status = self.get_timestamp_based_status();

            if beast_status.is_alive == true {
                beast_status.is_awake = true;
                store.write_beast_status(@beast_status);
            }
        }

        fn play(ref self: ContractState) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();

            // Status retrieved by calculation
            let mut beast_status = self.get_timestamp_based_status();

            if beast_status.is_alive == true {
                // Increase happiness
                beast_status.happiness = beast_status.happiness + constants::XL_UPDATE_POINTS;
                if beast_status.happiness > constants::MAX_HAPPINESS {
                    beast_status.happiness = constants::MAX_HAPPINESS;
                }

                // Decrease energy safety avoiding overflow
                beast_status.energy = if beast_status.energy >= constants::L_UPDATE_POINTS {
                    beast_status.energy - constants::L_UPDATE_POINTS
                } else {
                    0
                };

                // Decrease hunger safety avoiding overflow
                beast_status.hunger = if beast_status.hunger >= constants::M_UPDATE_POINTS {
                    beast_status.hunger - constants::M_UPDATE_POINTS
                } else {
                    0
                };
                store.write_beast_status(@beast_status);
            }
        }

        fn pet(ref self: ContractState) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();

            // Status retrieved by calculation
            let mut beast_status = self.get_timestamp_based_status();

            if beast_status.is_alive == true {
                beast_status.energy = beast_status.energy + constants::S_UPDATE_POINTS;
                if beast_status.energy > constants::MAX_ENERGY {
                    beast_status.energy = constants::MAX_ENERGY;
                }
                beast_status.happiness = beast_status.happiness + constants::S_UPDATE_POINTS;
                if beast_status.happiness > constants::MAX_HAPPINESS {
                    beast_status.happiness = constants::MAX_HAPPINESS;
                }
                store.write_beast_status(@beast_status);
            }
        }

        fn clean(ref self: ContractState) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();

            // Status retrieved by calculation
            let mut beast_status = self.get_timestamp_based_status();


            if beast_status.is_alive == true {
                beast_status.hygiene = beast_status.hygiene + constants::XL_UPDATE_POINTS;
                if beast_status.hygiene > constants::MAX_HYGIENE{
                    beast_status.hygiene = constants::MAX_HYGIENE;
                }
                beast_status.happiness = beast_status.happiness + constants::L_UPDATE_POINTS;
                if beast_status.happiness > constants::MAX_HAPPINESS {
                    beast_status.happiness = constants::MAX_HAPPINESS;
                }
                // update beast clean status
                beast_status.update_clean_status(beast_status.hygiene);

                store.write_beast_status(@beast_status);
            }
        }

        fn revive(ref self: ContractState) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();

            // Status retrieved by calculation
            let mut beast_status = self.get_timestamp_based_status();

            if beast_status.is_alive == false {
                beast_status.is_alive = true;
                beast_status.hunger = 100;
                beast_status.energy = 100;
                beast_status.happiness = 100;
                beast_status.hygiene = 100;

                store.write_beast_status(@beast_status);
            }
        }

        // ------------------------- Read Calls -------------------------
        fn get_timestamp_based_status(ref self: ContractState) -> BeastStatus {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();

            let beast_id = player.current_beast_id;
            let mut beast_status = store.read_beast_status(beast_id);
            
            let current_timestampt = get_block_timestamp();
            beast_status.calculate_timestamp_based_status(current_timestampt);

            beast_status
        }

        fn get_timestamp_based_status_with_address(ref self: ContractState, address: ContractAddress) -> BeastStatus {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player_from_address(address);
            player.assert_exists();

            let beast_id = player.current_beast_id;
            let mut beast_status = store.read_beast_status(beast_id);
            
            let current_timestampt = get_block_timestamp();
            beast_status.calculate_timestamp_based_status(current_timestampt);

            beast_status
        }

        fn get_beast_age(ref self: ContractState) -> u16 {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();
            
            let beast_id = player.current_beast_id;
            let mut beast: Beast = store.read_beast(beast_id);
            
            let current_timestampt = get_block_timestamp();
            beast.calculate_age(current_timestampt);
            
            beast.age
        }

        fn get_beast_age_with_address(ref self: ContractState, address: ContractAddress) -> u16 {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player_from_address(address);
            player.assert_exists();

            let beast_id = player.current_beast_id;
            let mut beast: Beast = store.read_beast(beast_id);

            let current_timestampt = get_block_timestamp();
            beast.calculate_age(current_timestampt);
            
            beast.age
        }
    }
}
