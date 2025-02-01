use babybeasts::models::Beast;
use starknet::ContractAddress;

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
    fn submit_score(ref self: T, player_id: ContractAddress, tamagotchi_id: ContractAddress, score: u32);
}

#[dojo::contract]
pub mod actions {
    use super::{IActions};
    use starknet::{ContractAddress, get_caller_address};
    use babybeasts::models::{Beast};

    use dojo::model::{ModelStorage, ModelValueStorage};
    use dojo::event::EventStorage;

    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn spawn(ref self: ContractState, specie: u32) {
            let mut world = self.world(@"babybeasts");
            let player = get_caller_address();

            let initial_stats = Beast {
                player: player,
                specie: specie,
                is_alive: true,
                is_awake: true,
                hunger: 100,
                max_hunger: 100,
                energy: 100,
                max_energy: 100,
                happiness: 100,
                max_happiness: 100,
                hygiene: 100,
                max_hygiene: 100,
                attack: 5,
                defense: 5,
                speed: 5,
                level: 1,
                experience: 0,
                next_level_experience: 60,
            };

            world.write_model(@initial_stats);
        }

        fn decrease_stats(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let player = get_caller_address();
            let mut beast: Beast = world.read_model(player);

            if beast.is_alive == true {
                if beast.happiness == 0 || beast.hygiene == 0 {
                    beast.energy = beast.energy - 2;
                } else {
                    beast.energy = beast.energy - 1;
                }
                if beast.energy < 0 {
                    beast.energy = 0;
                }

                beast.hunger = beast.hunger - 2;
                if beast.hunger < 0 {
                    beast.hunger = 0;
                }

                beast.happiness = beast.happiness - 1;
                if beast.happiness < 0 {
                    beast.happiness = 0;
                }

                beast.hygiene = beast.hygiene - 1;
                if beast.hygiene < 0 {
                    beast.hygiene = 0;
                }

                if beast.energy == 0 || beast.hunger == 0 {
                    beast.is_alive = false;
                }

                world.write_model(@beast);
            }
        }

        fn feed(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let player = get_caller_address();
            let mut beast: Beast = world.read_model(player);

            if beast.is_alive == true {
                beast.hunger = beast.hunger + 30;
                if beast.hunger > beast.max_hunger {
                    beast.hunger = beast.max_hunger;
                }
                beast.energy = beast.energy + 10;
                if beast.energy > beast.max_energy {
                    beast.energy = beast.max_energy;
                }
                world.write_model(@beast);
            }
        }

        fn sleep(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let player = get_caller_address();
            let mut beast: Beast = world.read_model(player);

            if beast.is_alive == true {
                beast.energy = beast.energy + 40;
                if beast.energy > beast.max_energy {
                    beast.energy = beast.max_energy;
                }
                beast.happiness = beast.happiness + 10;
                if beast.happiness > beast.max_happiness {
                    beast.happiness = beast.max_happiness;
                }
                beast.is_awake = false;
                world.write_model(@beast);
            }
        }

        fn awake(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let player = get_caller_address();
            let mut beast: Beast = world.read_model(player);

            if beast.is_alive == true {
                beast.is_awake = true;
                world.write_model(@beast);
            }
        }

        fn play(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let player = get_caller_address();
            let mut beast: Beast = world.read_model(player);

            if beast.is_alive == true {
                beast.happiness = beast.happiness + 30;
                if beast.happiness > beast.max_happiness {
                    beast.happiness = beast.max_happiness;
                }
                beast.energy = beast.energy - 20;
                beast.hunger = beast.hunger - 10;

                beast.experience = beast.experience + 10;
                if beast.experience >= beast.next_level_experience {
                    beast.level = beast.level + 1;
                    beast.experience = 0;
                    beast.next_level_experience = beast.next_level_experience + 20;
                }
                world.write_model(@beast);
            }
        }

        fn clean(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let player = get_caller_address();
            let mut beast: Beast = world.read_model(player);

            if beast.is_alive == true {
                beast.hygiene = beast.hygiene + 40;
                if beast.hygiene > beast.max_hygiene {
                    beast.hygiene = beast.max_hygiene;
                }
                beast.happiness = beast.happiness + 10;
                if beast.happiness > beast.max_happiness {
                    beast.happiness = beast.max_happiness;
                }
                beast.experience = beast.experience + 10;
                if beast.experience >= beast.next_level_experience {
                    beast.level = beast.level + 1;
                    beast.experience = 0;
                    beast.next_level_experience = beast.next_level_experience + 20;
                    beast.attack = beast.attack + 1;
                    beast.defense = beast.defense + 1;
                    beast.speed = beast.speed + 1;
                }
                world.write_model(@beast);
            }
        }

        fn revive(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let player = get_caller_address();
            let mut beast: Beast = world.read_model(player);

            if beast.is_alive == false {
                beast.is_alive = true;
                beast.hunger = 100;
                beast.energy = 100;
                beast.happiness = 100;
                beast.hygiene = 100;
                beast.experience = 0;

                if beast.attack < 0 {
                    beast.attack = 0;
                } else {
                    beast.attack = beast.attack - 1;
                }

                if beast.defense < 0 {
                    beast.defense = 0;
                } else {
                    beast.defense = beast.defense - 1;
                }

                if beast.speed < 0 {
                    beast.speed = 0;
                } else {
                    beast.speed = beast.speed - 1;
                }

                world.write_model(@beast);
            }
        }

        fn submit_score(ref self: ContractState, player_id: ContractAddress, tamagotchi_id: ContractAddress, score: u32) {
            let mut world = self.world(@"babybeasts");
            let _ = get_caller_address();  

            assert(score >= 0, "Score must be non-negative");
            let mut beast: Beast = world.read_model(tamagotchi_id);
            assert(beast.player == player_id, "Tamagotchi is not linked to the player");
            assert(beast.is_alive == true, "Tamagotchi must be alive to submit a score");

            if score >= 100 {
                beast.happiness += 15;
                beast.energy += 10;
                beast.experience += 20;
            }

            if score >= 200 {
                beast.level += 2;
                beast.attack += 5;
                beast.defense += 5;
                beast.happiness += 20;
            }

            if score >= 500 {
                beast.speed += 3;
                beast.agility += 5;
                beast.energy += 15;
                beast.happiness += 30;
                beast.level += 3;
            }


            // Just as an idea, for u to implement it in the future for rewarding streaks. @maintainers
            // if streak >= 5 {
            //     beast.speed += 1;
            // }

            // if streak >= 10 {
            //     beast.agility += 2;
            // }

            world.write_model(@beast);
        }
    }
}
