// Interface definition
#[starknet::interface]
trait IActions<T> {
    fn spawn(ref self: T, specie: u32);
    fn decrease_stats(ref self: T);
    fn feed(ref self: T);
    fn sleep(ref self: T);
    fn awake(ref self: T);
    fn play(ref self: T);
    fn clean(ref self: T);
    fn revive(ref self: T);
}

#[dojo::contract]
pub mod actions {
    // Starknet imports
    use starknet::{ContractAddress, get_caller_address};
    
    // Local import
    use super::{IActions};
    
    // Model imports
    use babybeasts::models::beast::{Beast};
    use babybeasts::models::beast::{BeastStats};
    use babybeasts::models::beast::{BeastStatus};

    // Constants import
    use babybeasts::constants;

    // Dojo Imports
    use dojo::model::{ModelStorage, ModelValueStorage};
    use dojo::event::EventStorage;

    // Storage
    #[storage]
    struct Storage {
        beast_counter: u32
    }

    // Constructor
    fn dojo_init( ref self: ContractState) {
        self.beast_counter.write(1);
    }

    // Implementation of the interface methods
    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn spawn(ref self: ContractState, specie: u32) {
            let mut world = self.world(@"babybeasts");
            let player = get_caller_address();

            let current_beast_id = self.beast_counter.read();

            let mut initial_beast_stats = BeastStats {
                beast_id: current_beast_id,
                attack: 5,
                defense: 5,
                speed: 5,
                level: 1,
                experience: 0,
                next_level_experience: 60,
            };

            let mut initial_beast_status = BeastStatus {
                beast_id: current_beast_id,
                is_alive: true,
                is_awake: true,
                hunger: 100,
                energy: 100,
                happiness: 100,
                hygiene: 100,
            };

            let mut new_beast = Beast {
                player: player,
                beast_id: current_beast_id,
                specie: specie,
                status: initial_beast_status,
                stats: initial_beast_stats
            };

            self.beast_counter.write(current_beast_id+1);
            world.write_model(@new_beast);
        }

        fn decrease_stats(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let player = get_caller_address();
            let mut beast: Beast = world.read_model(player);

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

                world.write_model(@beast);
            }
        }

        fn feed(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let player = get_caller_address();
            let mut beast: Beast = world.read_model(player);

            if beast.status.is_alive == true {
                beast.status.hunger = beast.status.hunger + 30;
                if beast.status.hunger > constants::MAX_HUNGER {
                    beast.status.hunger = constants::MAX_HUNGER;
                }
                beast.status.energy = beast.status.energy + 10;
                if beast.status.energy > constants::MAX_ENERGY {
                    beast.status.energy = constants::MAX_ENERGY;
                }
                world.write_model(@beast);
            }
        }

        fn sleep(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let player = get_caller_address();
            let mut beast: Beast = world.read_model(player);

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
                world.write_model(@beast);
            }
        }

        fn awake(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let player = get_caller_address();
            let mut beast: Beast = world.read_model(player);

            if beast.status.is_alive == true {
                beast.status.is_awake = true;
                world.write_model(@beast);
            }
        }

        fn play(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let player = get_caller_address();
            let mut beast: Beast = world.read_model(player);

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
                    beast.stats.experience = 0;
                    beast.stats.next_level_experience = beast.stats.next_level_experience + 20;
                }
                world.write_model(@beast);
            }
        }

        fn clean(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let player = get_caller_address();
            let mut beast: Beast = world.read_model(player);

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
                    beast.stats.experience = 0;
                    beast.stats.next_level_experience = beast.stats.next_level_experience + 20;
                    beast.stats.attack = beast.stats.attack + 1;
                    beast.stats.defense = beast.stats.defense + 1;
                    beast.stats.speed = beast.stats.speed + 1;
                }
                world.write_model(@beast);
            }
        }

        fn revive(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let player = get_caller_address();
            let mut beast: Beast = world.read_model(player);

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
    }
}
