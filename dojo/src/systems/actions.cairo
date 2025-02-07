// Interface definition
#[starknet::interface]
trait IActions<T> {
    // Player methods
    fn get_counter(ref self: T) -> u32;
    fn spawn_player(ref self: T);
    fn set_current_beast(ref self: T, beast_id: u32);
    fn add_initial_food(ref self: T);
    // Beast Methods
    fn spawn(ref self: T, specie: u32);
    fn decrease_stats(ref self: T);
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
    use babybeasts::models::player::{Player};
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

        fn get_counter(ref self: ContractState) -> u32 {
            let counter: u32 = self.beast_counter.read();
            counter
        }

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

            store.new_beast(current_beast_id, specie);

            self.beast_counter.write(current_beast_id+1);
        }

        fn decrease_stats(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            let beast_id = player.current_beast_id;

            let mut beast: Beast = store.read_beast(beast_id);

            if beast.status.is_alive == true {
                if beast.status.happiness == 0 || beast.status.hygiene == 0 {
                    beast.status.energy = beast.status.energy - 2;
                } else {
                    beast.status.energy = beast.status.energy - 1;
                }
                if beast.status.energy < 0 {
                    beast.status.energy = 0;
                }

                beast.status.hunger = beast.status.hunger - 2;
                if beast.status.hunger < 0 {
                    beast.status.hunger = 0;
                }

                beast.status.happiness = beast.status.happiness - 1;
                if beast.status.happiness < 0 {
                    beast.status.happiness = 0;
                }

                beast.status.hygiene = beast.status.hygiene - 1;
                if beast.status.hygiene < 0 {
                    beast.status.hygiene = 0;
                }

                if beast.status.energy == 0 || beast.status.hunger == 0 {
                    beast.status.is_alive = false;
                }
                store.write_beast(@beast);
            }
        }

        fn feed(ref self: ContractState, food_id: u8) {
            let mut world = self.world(@"babybeasts");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            let beast_id = player.current_beast_id;

            let mut beast: Beast = store.read_beast(beast_id);

            let mut food: Food = store.read_food(food_id);

            if beast.status.is_alive == true {
                if food.amount > 0 {
                    food.amount - 1;
                    beast.status.hunger = beast.status.hunger + 30;
                    if beast.status.hunger > constants::MAX_HUNGER {
                        beast.status.hunger = constants::MAX_HUNGER;
                    }
                    beast.status.energy = beast.status.energy + 10;
                    if beast.status.energy > constants::MAX_ENERGY {
                        beast.status.energy = constants::MAX_ENERGY;
                    }
                    store.write_food(@food);
                    store.write_beast(@beast);
                }
            }
        }

        fn sleep(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            let beast_id = player.current_beast_id;

            let mut beast: Beast = store.read_beast(beast_id);

            if beast.status.is_alive == true {
                beast.status.energy = beast.status.energy + 40;
                if beast.status.energy > constants::MAX_ENERGY {
                    beast.status.energy = constants::MAX_ENERGY;
                }
                beast.status.happiness = beast.status.happiness + 10;
                if beast.status.happiness > constants::MAX_HAPPINESS {
                    beast.status.happiness = constants::MAX_HAPPINESS;
                }
                beast.status.is_awake = false;
                store.write_beast(@beast);
            }
        }

        fn awake(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            let beast_id = player.current_beast_id;

            let mut beast: Beast = store.read_beast(beast_id);

            if beast.status.is_alive == true {
                beast.status.is_awake = true;
                store.write_beast(@beast);
            }
        }

        fn play(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            let beast_id = player.current_beast_id;

            let mut beast: Beast = store.read_beast(beast_id);

            if beast.status.is_alive == true {
                beast.status.happiness = beast.status.happiness + 30;
                if beast.status.happiness > constants::MAX_HAPPINESS {
                    beast.status.happiness = constants::MAX_HAPPINESS;
                }
                beast.status.energy = beast.status.energy - 20;
                beast.status.hunger = beast.status.hunger - 10;

                beast.stats.experience = beast.stats.experience + 10;
                if beast.stats.experience >= beast.stats.next_level_experience {
                    beast.stats.level = beast.stats.level + 1;
                    // Evolution level reached
                    if beast.stats.level >= constants::MAX_BABY_LEVEL {
                        beast.evolved = true;
                        beast.vaulted = true;
                    }
                    beast.stats.experience = 0;
                    beast.stats.next_level_experience = beast.stats.next_level_experience + 20;
                }
                store.write_beast(@beast);
            }
        }

        fn clean(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            let beast_id = player.current_beast_id;

            let mut beast: Beast = store.read_beast(beast_id);

            if beast.status.is_alive == true {
                beast.status.hygiene = beast.status.hygiene + 40;
                if beast.status.hygiene > constants::MAX_HYGIENE{
                    beast.status.hygiene = constants::MAX_HYGIENE;
                }
                beast.status.happiness = beast.status.happiness + 10;
                if beast.status.happiness > constants::MAX_HAPPINESS {
                    beast.status.happiness = constants::MAX_HAPPINESS;
                }
                beast.stats.experience = beast.stats.experience + 10;
                if beast.stats.experience >= beast.stats.next_level_experience {
                    beast.stats.level = beast.stats.level + 1;
                    // Evolution level reached
                    if beast.stats.level >= constants::MAX_BABY_LEVEL {
                        beast.evolved = true;
                        beast.vaulted = true;
                    }
                    beast.stats.experience = 0;
                    beast.stats.next_level_experience = beast.stats.next_level_experience + 20;
                    beast.stats.attack = beast.stats.attack + 1;
                    beast.stats.defense = beast.stats.defense + 1;
                    beast.stats.speed = beast.stats.speed + 1;
                }
                store.write_beast(@beast);
            }
        }

        fn revive(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            let beast_id = player.current_beast_id;

            let mut beast: Beast = store.read_beast(beast_id);

            if beast.status.is_alive == false {
                beast.status.is_alive = true;
                beast.status.hunger = 100;
                beast.status.energy = 100;
                beast.status.happiness = 100;
                beast.status.hygiene = 100;
                beast.stats.experience = 0;

                if beast.stats.attack < 0 {
                    beast.stats.attack = 0;
                } else {
                    beast.stats.attack = beast.stats.attack - 1;
                }

                if beast.stats.defense < 0 {
                    beast.stats.defense = 0;
                } else {
                    beast.stats.defense = beast.stats.defense - 1;
                }

                if beast.stats.speed < 0 {
                    beast.stats.speed = 0;
                } else {
                    beast.stats.speed = beast.stats.speed - 1;
                }

                world.write_model(@beast);
            }
        }

        fn init_tap_counter(ref self: ContractState) {
            let player_address = get_caller_address();

            self.tap_counter.write(player_address, 0);
        }


        fn tap(ref self: ContractState, specie: u32) {
            let player_address = get_caller_address();
            let current_tap_counter = self.tap_counter.read(player_address);

            if current_tap_counter == constants::MAX_TAP_COUNTER {
                self.spawn(specie);
                self.init_tap_counter();
            }

            self.tap_counter.write(player_address, current_tap_counter+1);
        }
    }
}
