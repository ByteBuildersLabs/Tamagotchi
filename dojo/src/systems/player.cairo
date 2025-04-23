// Interface definition
#[starknet::interface]
pub trait IPlayer<T> {
    // ------------------------- Player methods -------------------------
    fn spawn_player(ref self: T);
    fn set_current_beast(ref self: T, beast_id: u16);
    fn update_player_daily_streak(ref self: T);
    fn update_player_total_points(ref self: T, points: u32);
    fn update_player_minigame_highest_score(ref self: T, points: u32, minigame_id: u16);
    fn add_or_update_food_amount(ref self: T, food_id: u8, amount: u8);
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
    use tamagotchi::models::food::{Food, FoodTrait};
    use tamagotchi::models::highest_score::{HighestScore};

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

        fn update_player_minigame_highest_score(ref self: ContractState, points: u32, minigame_id: u16) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);

            let mut highest_score: HighestScore = store.read_highest_score(minigame_id);
            
            if points > highest_score.score {
                highest_score.score = points;
                store.write_new_highest_score(@highest_score);
            }
        }

        fn add_or_update_food_amount(ref self: ContractState, food_id: u8, amount: u8) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
        
            // Read the current food model using the provided ID
            let mut food: Food = store.read_food(food_id);

            if food.amount == 0 {
                // If the food does not exist, create a new one
                store.new_food(food_id, amount);
            }
            else {
                // If the food already exists, update the amount
                food.update_food_total_amount(amount);
                store.write_food(@food);
            }
        }

    }
}
