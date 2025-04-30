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
    fn emit_player_push_token(ref self: T, token: ByteArray);
}

#[dojo::contract]
pub mod player {
    // Local import
    use super::{IPlayer};

    // Starknet imports
    use starknet::{get_block_timestamp, ContractAddress};

    // Achievements imports
    use achievement::components::achievable::AchievableComponent;
    use achievement::types::task::{Task, TaskTrait}; 
    use achievement::store::{StoreTrait as AchievementStoreTrait};

    // Model imports
    #[allow(unused_imports)]
    use tamagotchi::models::beast::{Beast, BeastTrait};
    use tamagotchi::models::player::{Player, PlayerAssert, PlayerTrait};
    use tamagotchi::models::food::{Food, FoodTrait};
    use tamagotchi::models::highest_score::{HighestScore};

    // Events imports
    use tamagotchi::events::push::{PushToken};

    // Store import
    use tamagotchi::store::{StoreTrait};

    // Dojo Imports
    #[allow(unused_imports)]
    use dojo::model::{ModelStorage};
    #[allow(unused_imports)]
    use dojo::event::EventStorage;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        achievable: AchievableComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        AchievableEvent: AchievableComponent::Event,
    }

    // Constructor
    fn dojo_init(ref self: ContractState) {
        // [Event] Emit all Achievement creation events
        let mut world = self.world(@"tamagotchi");
        let task_id = '1';
        let task_target = 100;
        let task = TaskTrait::new(task_id, task_target, "Reach 100 pts in the minigame");
        let tasks: Span<Task> = array![task].span();

        // Create the achievement
        let store = AchievementStoreTrait::new(world);
        store.create(
            id: '1',
            hidden: false,
            index: 0,
            points: 10,
            start: 0,
            end: 0,
            group: 'Minigame',
            icon: 'fa-trophy',
            title: 'Master of the minigame',
            description: "Has reached 100 pts in the minigame",
            tasks: tasks,
            data: "",
        );
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

            // Emit progress event when the player reaches 100 points in the minigame
            if player.total_points >= 100 {
                let task_id = '1'; // Should be the same as the one in dojo_init
                let count = points; // Quantity of points to add
                let achievement_store = AchievementStoreTrait::new(world); // Achievement store
                let time = starknet::get_block_timestamp(); // Current timestamp
                achievement_store.progress(player.address.into(), task_id, count, time); 
            }
        }

        fn update_player_minigame_highest_score(
            ref self: ContractState, points: u32, minigame_id: u16,
        ) {
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
            } else {
                // If the food already exists, update the amount
                food.update_food_total_amount(amount);
                store.write_food(@food);
            }
        }

        fn emit_player_push_token(ref self: ContractState, token: ByteArray) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);

            let mut player: Player = store.read_player();
            player.assert_exists();

            let player_address: ContractAddress = player.address;

            world.emit_event(@PushToken { player_address, token });
        }
    }
}
