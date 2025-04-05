#[cfg(test)]
mod tests {
    // Dojo import
    use dojo::model::{ModelStorage};

    // Traits import
    use tamagotchi::systems::game::IGameDispatcherTrait;
    use tamagotchi::systems::player::IPlayerDispatcherTrait;

    // Import models and types
    use tamagotchi::models::food::{Food};
    use tamagotchi::models::beast_status::{BeastStatus};
    use tamagotchi::tests::utils::{
        utils::{
            PLAYER, cheat_caller_address, create_game_system, create_player_system,
            create_test_world, cheat_block_timestamp,
        },
    };

    #[test]
    #[available_gas(60000000)]
    fn test_add_initial_food() {
        // Initialize test environment
        let world = create_test_world();
        let player_system = create_player_system(world);
        let game_system = create_game_system(world);

        cheat_caller_address(PLAYER());

        // Initialize player
        player_system.spawn_player();
        game_system.spawn_beast(1, 1);
        player_system.set_current_beast(1);

        let mut food_count = 0;
        let mut k: u8 = 1;

        while k <= 16 {
            let food: Food = world.read_model((PLAYER(), k));

            if food.amount > 0 {
                food_count += 1;
                println!("Found food with ID {} and amount {}", k, food.amount);
            }

            k += 1;
        };

        assert(food_count == 2, 'Should have exactly 2 foods');
        println!("Initial food test passed: {} foods found", food_count);
    }

    #[test]
    fn test_feed_beast_decreases_status() {
        // Initialize test environment
        let world = create_test_world();
        let game_system = create_game_system(world);
        let player_system = create_player_system(world);

        cheat_caller_address(PLAYER());
        cheat_block_timestamp(7000000);

        // Create player, food, and beast
        player_system.spawn_player();
        game_system.spawn_beast(1, 3); // Spawn beast with specie 1
        player_system.set_current_beast(1);

        // Get initial status
        let initial_status: BeastStatus = game_system.get_timestamp_based_status();
        let initial_hunger = initial_status.hunger;
        let initial_energy = initial_status.energy;

        println!(
            "Initial Status - Energy: {}, Hunger: {}", initial_status.energy, initial_status.hunger,
        );

        cheat_block_timestamp(7005000);

        // Get updated status
        let updated_status: BeastStatus = game_system.get_timestamp_based_status();

        println!(
            "Updated Status - Energy: {}, Hunger: {}", initial_status.energy, initial_status.hunger,
        );

        // Verify hunger and energy decreased
        assert(updated_status.hunger < initial_hunger, 'hunger not decreased');
        assert(updated_status.energy < initial_energy, 'energy not decreased');
    }

    #[test]
    fn test_feed_beast_increase_status() {
        // Initialize test environment
        let world = create_test_world();
        let game_system = create_game_system(world);
        let player_system = create_player_system(world);

        cheat_caller_address(PLAYER());
        cheat_block_timestamp(7000000);

        // Create player, food, and beast
        player_system.spawn_player();
        game_system.spawn_beast(1, 1); // Spawn beast with specie 1
        player_system.set_current_beast(1);

        // We decrease the status to verify that they increase after feeding
        cheat_block_timestamp(7000500);

        // Get initial status
        let initial_status: BeastStatus = game_system.get_timestamp_based_status();
        let initial_hunger = initial_status.hunger;
        let initial_energy = initial_status.energy;

        println!(
            "Initial Status - Energy: {}, Hunger: {}", initial_status.energy, initial_status.hunger,
        );

        // Increase status
        game_system.feed(3);

        // Get updated status
        let updated_status: BeastStatus = game_system.get_timestamp_based_status();

        println!(
            "Updated Status - Energy: {}, Hunger: {}", initial_status.energy, initial_status.hunger,
        );

        // Verify hunger and energy decreased
        assert(updated_status.hunger > initial_hunger, 'hunger not increased');
        assert(updated_status.energy > initial_energy, 'energy not increased');
    }

    #[test]
    #[available_gas(60000000)]
    fn test_update_food_amount() {
        // Initialize test environment
        let world = create_test_world();
        let player_system = create_player_system(world);
        let game_system = create_game_system(world);

        cheat_caller_address(PLAYER());

        // Initialize player and add initial food
        player_system.spawn_player();
        game_system.spawn_beast(1, 1); // Spawn beast with specie 1
        player_system.set_current_beast(1);

        let test_food_id: u8 = 5; // CakeChocolate
        let initial_amount: u8 = 10;

        player_system.add_or_update_food_amount(test_food_id, initial_amount);

        // Verify that the food was created correctly
        let initial_food: Food = world.read_model((PLAYER(), test_food_id));
        assert(initial_food.amount == initial_amount, 'Initial amount incorrect');

        // Update the food amount (add 5 more)
        let additional_amount: u8 = 5;
        player_system.add_or_update_food_amount(test_food_id, additional_amount);

        // Read the updated food amount
        let updated_food: Food = world.read_model((PLAYER(), test_food_id));

        // Verify that the amount increased correctly
        assert(
            updated_food.amount == initial_amount + additional_amount, 'Incorrect update amount',
        );

        println!("Initial amount: {}, Updated amount: {}", initial_amount, updated_food.amount);
    }

    #[test]
    #[available_gas(60000000)]
    fn test_food_initialization_flow() {
        // Initialize test environment
        let world = create_test_world();
        let player_system = create_player_system(world);
        let game_system = create_game_system(world);

        cheat_caller_address(PLAYER());

        // Initialize player
        player_system.spawn_player();

        // Verify no food exists before beast creation
        let mut initial_food_count = 0;
        let mut k: u8 = 1;
        while k <= 16 {
            let food: Food = world.read_model((PLAYER(), k));
            // println!("Debug: Before beast - Food ID {}, Amount: {}", k, food.amount);
            if food.amount > 0 {
                initial_food_count += 1;
            }
            k += 1;
        };
        assert(initial_food_count == 0, 'Food exists before beast');

        // Create beast (which should trigger food initialization internally)
        game_system.spawn_beast(1, 1); // Spawn beast with specie 1
        player_system.set_current_beast(1);

        // Verify that food was created after beast creation
        let mut post_beast_food_count = 0;
        let mut j: u8 = 1;
        while j <= 16 {
            let food: Food = world.read_model((PLAYER(), j));
            println!("Debug: After beast - Food ID {}, Amount: {}", j, food.amount);
            if food.amount > 0 {
                post_beast_food_count += 1;
            }
            j += 1;
        };

        // We should have exactly 2 foods (one favorite and one common)
        assert(post_beast_food_count == 2, 'Food not created in beast');
    }

    #[test]
    #[available_gas(60000000)]
    fn test_food_amount_edge_cases() {
        // Initialize test environment
        let world = create_test_world();
        let player_system = create_player_system(world);
        let game_system = create_game_system(world);

        cheat_caller_address(PLAYER());

        // Initialize player and add initial food
        player_system.spawn_player();
        game_system.spawn_beast(1, 1); // Spawn beast with specie 1
        player_system.set_current_beast(1);

        let test_food_id: u8 = 1; // Apple
        let initial_amount: u8 = 1;

        player_system.add_or_update_food_amount(test_food_id, initial_amount);

        // Verify that the food was created correctly
        let initial_food: Food = world.read_model((PLAYER(), test_food_id));
        assert(initial_food.amount == initial_amount, 'Initial amount incorrect');

        // Case 1: Reduce the amount to exactly 0 using feed
        game_system.feed(test_food_id);

        // Read the food after reducing to 0
        let zero_food: Food = world.read_model((PLAYER(), test_food_id));
        assert(zero_food.amount == 0, 'Amount should be zero');

        println!("INITIAL FOOD: {}, UPDATED FOOD: {}", initial_amount, zero_food.amount);

        // Case 2: Try to add more food after reaching 0
        let new_amount: u8 = 3;
        player_system.add_or_update_food_amount(test_food_id, new_amount);

        // // Verify that the amount was updated correctly
        let updated_food: Food = world.read_model((PLAYER(), test_food_id));

        // // If the logic works correctly with amount 0:
        assert(updated_food.amount == new_amount, 'Should update from zero');

        // // Case 3: Create a different food and verify that both exist
        let another_food_id: u8 = 7; // Cheese
        player_system.add_or_update_food_amount(another_food_id, 8);

        // // Verify that both foods exist with correct amounts
        let final_first_food: Food = world.read_model((PLAYER(), test_food_id));
        let second_food: Food = world.read_model((PLAYER(), another_food_id));

        assert(final_first_food.amount == new_amount, 'First food amount changed');
        assert(second_food.amount == 8, 'Second food amount incorrect');

        println!("Edge case test passed: Food with zero amount handled correctly");
    }


    #[test]
    #[available_gas(60000000)]
    fn test_update_multiple_food_types() {
        // Initialize test environment
        let world = create_test_world();
        let player_system = create_player_system(world);
        let game_system = create_game_system(world);

        cheat_caller_address(PLAYER());

        // Initialize player
        player_system.spawn_player();
        game_system.spawn_beast(1, 1); // Spawn beast with specie 1 (Light)
        player_system.set_current_beast(1);

        // Create different food types
        let apple_id: u8 = 1; // Apple
        let banana_id: u8 = 2; // Banana
        let beef_id: u8 = 13; // Beef

        // Initial amount for each food
        let apple_initial: u8 = 5;
        let banana_initial: u8 = 8;
        let beef_initial: u8 = 3;

        // Create the foods
        player_system.add_or_update_food_amount(apple_id, apple_initial);
        player_system.add_or_update_food_amount(banana_id, banana_initial);
        player_system.add_or_update_food_amount(beef_id, beef_initial);

        // Verify initial amounts
        let initial_apple: Food = world.read_model((PLAYER(), apple_id));
        let initial_banana: Food = world.read_model((PLAYER(), banana_id));
        let initial_beef: Food = world.read_model((PLAYER(), beef_id));

        assert(initial_apple.amount == apple_initial, 'Apple init failed');
        assert(initial_banana.amount == banana_initial, 'Banana init failed');
        assert(initial_beef.amount == beef_initial, 'Beef init failed');

        // Update the amounts
        let apple_add: u8 = 3;
        let banana_add: u8 = 7;
        let beef_add: u8 = 2;

        player_system.add_or_update_food_amount(apple_id, apple_add); // Add apples
        player_system.add_or_update_food_amount(banana_id, banana_add); // Add bananas
        player_system.add_or_update_food_amount(beef_id, beef_add); // Add beefs

        // Read updated amounts
        let updated_apple: Food = world.read_model((PLAYER(), apple_id));
        let updated_banana: Food = world.read_model((PLAYER(), banana_id));
        let updated_beef: Food = world.read_model((PLAYER(), beef_id));

        // Verify that all amounts increased correctly
        assert(updated_apple.amount == apple_initial + apple_add, 'apple update failed');
        assert(updated_banana.amount == banana_initial + banana_add, 'banana update failed');
        assert(updated_beef.amount == beef_initial + beef_add, 'beef update failed');

        println!("Apple: {} -> {}", initial_apple.amount, updated_apple.amount);
        println!("Banana: {} -> {}", initial_banana.amount, updated_banana.amount);
        println!("Beef: {} -> {}", initial_beef.amount, updated_beef.amount);
    }
}
