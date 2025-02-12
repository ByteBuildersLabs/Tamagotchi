// Interface definition
#[starknet::interface]
trait IActions<T> {
    // Player methods
    fn spawn_player(ref self: T);
    fn set_current_beast(ref self: T, beast_id: u32);
    fn add_initial_food(ref self: T);
    // Beast Methods
    fn spawn(ref self: T, specie: u32);
    fn decrease_status(ref self: T);
    fn feed(ref self: T, food_id: u8);
    fn sleep(ref self: T);
    fn awake(ref self: T);
    fn play(ref self: T);
    fn clean(ref self: T);
    fn revive(ref self: T);
    // Other methods
    fn init_tap_counter(ref self: T);
    fn tap(ref self: T, specie: u32);
}

#[dojo::contract]
pub mod actions {
    // Starknet imports
    use starknet::{ContractAddress, get_caller_address};
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess};
    
    // Local import
    use super::{IActions};
    
    // Model imports
    use babybeasts::models::beast::{Beast};
    use babybeasts::models::beast_stats::{BeastStats};
    use babybeasts::models::beast_status::{BeastStatus};
    use babybeasts::models::player::{Player, PlayerAssert};
    use babybeasts::models::food::{Food};
    
    // types import
    use babybeasts::types::food::{FoodType};

    // Constants import
    use babybeasts::constants;

    // Store import
    use babybeasts::store::{Store, StoreTrait};

    // Dojo Imports
    use dojo::model::{ModelStorage, ModelValueStorage};
    use dojo::event::EventStorage;

    // Storage
    #[storage]
    struct Storage {
        beast_counter: u32,
        tap_counter: Map<ContractAddress, u32>
    }

    // Constructor
    fn dojo_init( ref self: ContractState) {
        self.beast_counter.write(1);
    }

    // Implementation of the interface methods
    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn spawn_player(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let store = StoreTrait::new(world);

            store.new_player();

            self.init_tap_counter();
        }

        fn set_current_beast(ref self: ContractState, beast_id: u32) {
            let mut world = self.world(@"babybeasts");
            let store = StoreTrait::new(world);

            let mut player: Player = store.read_player();
            player.assert_exists();
            player.current_beast_id = beast_id;

            store.write_player(@player);
        }

        fn add_initial_food(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let store = StoreTrait::new(world);

            store.new_apples();
            store.new_bananas();
            store.new_cherries();
        }

        fn spawn(ref self: ContractState, specie: u32) {
            let mut world = self.world(@"babybeasts");
            let store = StoreTrait::new(world);
            
            let current_beast_id = self.beast_counter.read();

            store.new_beast_stats(current_beast_id);
            store.new_beast_status(current_beast_id);
            store.new_beast(current_beast_id, specie);

            self.beast_counter.write(current_beast_id+1);
        }

        fn decrease_status(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();
            let beast_id = player.current_beast_id;
            let mut beast: Beast = store.read_beast(beast_id);
            let mut beast_status = store.read_beast_status(beast_id);

            if beast_status.is_alive == true {
                // Decrease energy based on conditions
                if beast_status.happiness == 0 || beast_status.hygiene == 0 {
                    beast_status.energy = if beast_status.energy >= 2 {
                        beast_status.energy - 2
                    } else {
                        0
                    };
                } else {
                    beast_status.energy = if beast_status.energy >= 1 {
                        beast_status.energy - 1
                    } else {
                        0
                    };
                }

                // Decrease hunger safely
                beast_status.hunger = if beast_status.hunger >= 2 {
                    beast_status.hunger - 2
                } else {
                    0
                };

                // Decrease happiness safely 
                beast_status.happiness = if beast_status.happiness >= 1 {
                    beast_status.happiness - 1
                } else {
                    0
                };

                // Decrease hygiene safely
                beast_status.hygiene = if beast_status.hygiene >= 1 {
                    beast_status.hygiene - 1
                } else {
                    0
                };

                // Check if beast dies
                if beast_status.energy == 0 || beast_status.hunger == 0 {
                    beast_status.is_alive = false;
                }

                store.write_beast(@beast);
                store.write_beast_status(@beast_status);
            }
        }

        fn feed(ref self: ContractState, food_id: u8) {
            let mut world = self.world(@"babybeasts");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();
            let beast_id = player.current_beast_id;
            let mut beast: Beast = store.read_beast(beast_id);
            let mut food: Food = store.read_food(food_id);
            let mut beast_status = store.read_beast_status(beast_id);

            if beast_status.is_alive == true {
                // Validate food is not negative
                if food.amount > 0 {
                    food.amount = food.amount - 1;
                    beast_status.hunger = beast_status.hunger + constants::XL_UPDATE_POINTS;
                    if beast_status.hunger > constants::MAX_HUNGER {
                        beast_status.hunger = constants::MAX_HUNGER;
                    }
                    beast_status.energy = beast_status.energy + constants::M_UPDATE_POINTS;
                    if beast_status.energy > constants::MAX_ENERGY {
                        beast_status.energy = constants::MAX_ENERGY;
                    }
                    store.write_food(@food);
                    store.write_beast(@beast);
                    store.write_beast_status(@beast_status);
                }
            }
        }

        fn sleep(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();
            let beast_id = player.current_beast_id;
            let mut beast: Beast = store.read_beast(beast_id);
            let mut beast_status = store.read_beast_status(beast_id);

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
                store.write_beast(@beast);
                store.write_beast_status(@beast_status);
            }
        }

        fn awake(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();
            let beast_id = player.current_beast_id;
            let mut beast: Beast = store.read_beast(beast_id);
            let mut beast_status = store.read_beast_status(beast_id);

            if beast_status.is_alive == true {
                beast_status.is_awake = true;
                store.write_beast(@beast);
                store.write_beast_status(@beast_status);
            }
        }

        fn play(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();
            let beast_id = player.current_beast_id;
            let mut beast: Beast = store.read_beast(beast_id);
            let mut beast_status = store.read_beast_status(beast_id);
            let mut beast_stats = store.read_beast_stats(beast_id);

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

                beast_stats.experience = beast_stats.experience + constants::S_UPDATE_POINTS;
                if beast_stats.experience >= beast_stats.next_level_experience {
                    beast_stats.level = beast_stats.level + 1;
                    // Evolution level reached
                    if beast_stats.level >= constants::MAX_BABY_LEVEL {
                        beast.evolved = true;
                        beast.vaulted = true;
                    }
                    beast_stats.experience = 0;
                    beast_stats.next_level_experience = beast_stats.next_level_experience + constants::NEXT_LEVEL_EXPERIENCE;
                }
                store.write_beast(@beast);
                store.write_beast_status(@beast_status);
                store.write_beast_stats(@beast_stats);
            }
        }

        fn clean(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();
            let beast_id = player.current_beast_id;
            let mut beast: Beast = store.read_beast(beast_id);
            let mut beast_status = store.read_beast_status(beast_id);
            let mut beast_stats = store.read_beast_stats(beast_id);

            if beast_status.is_alive == true {
                beast_status.hygiene = beast_status.hygiene + constants::XL_UPDATE_POINTS;
                if beast_status.hygiene > constants::MAX_HYGIENE{
                    beast_status.hygiene = constants::MAX_HYGIENE;
                }
                beast_status.happiness = beast_status.happiness + constants::L_UPDATE_POINTS;
                if beast_status.happiness > constants::MAX_HAPPINESS {
                    beast_status.happiness = constants::MAX_HAPPINESS;
                }
                beast_stats.experience = beast_stats.experience + constants::L_UPDATE_POINTS;
                if beast_stats.experience >= beast_stats.next_level_experience {
                    beast_stats.level = beast_stats.level + 1;
                    // Evolution level reached
                    if beast_stats.level >= constants::MAX_BABY_LEVEL {
                        beast.evolved = true;
                        beast.vaulted = true;
                    }
                    beast_stats.experience = 0;
                    beast_stats.next_level_experience = beast_stats.next_level_experience + constants::NEXT_LEVEL_EXPERIENCE;
                    beast_stats.attack = beast_stats.attack + 1;
                    beast_stats.defense = beast_stats.defense + 1;
                    beast_stats.speed = beast_stats.speed + 1;
                }
                store.write_beast(@beast);
                store.write_beast_status(@beast_status);
                store.write_beast_stats(@beast_stats);
            }
        }

        fn revive(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();
            let beast_id = player.current_beast_id;
            let mut beast: Beast = store.read_beast(beast_id);
            let mut beast_status = store.read_beast_status(beast_id);
            let mut beast_stats = store.read_beast_stats(beast_id);

            if beast_status.is_alive == false {
                beast_status.is_alive = true;
                beast_status.hunger = 100;
                beast_status.energy = 100;
                beast_status.happiness = 100;
                beast_status.hygiene = 100;
                beast_stats.experience = 0;

                // Reduce attack safety avoiding overflow
                beast_stats.attack = if beast_stats.attack >= 1 {
                    beast_stats.attack - 1
                } else {
                    0
                };

                // Reduce defense safety avoiding overflow
                beast_stats.defense = if beast_stats.defense >= 1 {
                    beast_stats.defense - 1
                } else {
                    0
                };

                // Reduce speed safety avoiding overflow
                beast_stats.speed = if beast_stats.speed >= 1 {
                    beast_stats.speed - 1
                } else {
                    0
                };

                store.write_beast(@beast);
                store.write_beast_status(@beast_status);
                store.write_beast_stats(@beast_stats);
            }
        }

        fn init_tap_counter(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();

            self.tap_counter.write(player.address, 0);
        }


        fn tap(ref self: ContractState, specie: u32) {
            let mut world = self.world(@"babybeasts");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();

            let current_tap_counter = self.tap_counter.read(player.address);

            if current_tap_counter == constants::MAX_TAP_COUNTER {
                self.spawn(specie);
                self.init_tap_counter();
            }

            self.tap_counter.write(player.address, current_tap_counter+1);
        }
    }
}
