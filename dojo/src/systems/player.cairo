// Interface definition
#[starknet::interface]
pub trait IPlayer<T> {
    // ------------------------- Player methods -------------------------
    fn spawn_player(ref self: T);
    fn add_initial_food(ref self: T);
    fn set_current_beast(ref self: T, beast_id: u16);
    fn update_player_daily_streak(ref self: T);
    fn update_player_total_points(ref self: T, points: u32);
}

#[dojo::contract]
pub mod player {
    // Local import
    use super::{IPlayer};
    
    // Starknet imports
    use starknet::get_block_timestamp;
    
    // Model imports
    #[allow(unused_imports)]
    use tamagotchi::models::beast::{Beast, BeastTrait};
    use tamagotchi::models::player::{Player, PlayerAssert, PlayerTrait};

    // Store import
    use tamagotchi::store::{StoreTrait};

    // Dojo Imports
    #[allow(unused_imports)]
    use dojo::model::{ModelStorage};

    // Constructor
    fn dojo_init( ref self: ContractState) {
    }

    // Implementation of the interface methods
    #[abi(embed_v0)]
    impl PlayerImpl of IPlayer<ContractState> {
        // ------------------------- Player methods -------------------------
        fn spawn_player(ref self: ContractState) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);

            store.new_player();

            self.add_initial_food();
        }

        fn add_initial_food(ref self: ContractState) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);

            store.init_player_food();
        }
        
        fn set_current_beast(ref self: ContractState, beast_id: u16) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);

            let mut player: Player = store.read_player();
            player.assert_exists();
            player.current_beast_id = beast_id;

            store.write_player(@player);
        }

        fn update_player_daily_streak(ref self: ContractState) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);

            let current_timestamp = get_block_timestamp();

            let mut player: Player = store.read_player();
            player.assert_exists();

            player.update_daily_streak(current_timestamp);

            store.write_player(@player);
        }

        fn update_player_total_points(ref self: ContractState, points: u32) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);

            let mut player: Player = store.read_player();
            player.assert_exists();

            player.update_total_points(points);

            store.write_player(@player);
        }

    }
}
