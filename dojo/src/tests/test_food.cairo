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
    use tamagotchi::constants;
    use tamagotchi::tests::utils::{
        utils::{
            PLAYER, cheat_caller_address, create_game_system, create_player_system,
            create_test_world, cheat_block_timestamp,
        },
    };

    #[test]
    #[available_gas(60000000)]
    fn test_add_initial_food() {
        // Initialize test environment]
        let world = create_test_world();
        let player_system = create_player_system(world);

        cheat_caller_address(PLAYER());

        // Initialize player and add initial food
        player_system.spawn_player();
        player_system.add_initial_food();

        // Read foods after initialization using correct IDs (1, 2, 3)
        let apple: Food = world.read_model((PLAYER(), 1));
        let banana: Food = world.read_model((PLAYER(), 2));
        let cherry: Food = world.read_model((PLAYER(), 3));

        // Debug print
        // debug::print_felt252('Food name in storage:');
        // debug::print_felt252(apple.name);
        // debug::print_felt252(banana.name);
        // debug::print_felt252(cherry.name);

        // Verify food types
        assert(apple.id == 1, 'wrong apple type');
        assert(banana.id == 2, 'wrong banana type');
        assert(cherry.id == 3, 'wrong cherry type');

        // Verify initial amounts
        assert(apple.amount == constants::MAX_FOOD_AMOUNT, 'wrong apple amount');
        assert(banana.amount == constants::MAX_FOOD_AMOUNT, 'wrong banana amount');
        assert(cherry.amount == constants::MAX_FOOD_AMOUNT, 'wrong cherry amount');
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
        player_system.add_initial_food();
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
        player_system.add_initial_food();
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
        player_system.add_initial_food();

        // Get initial apple amount
        let initial_apple: Food = world.read_model((PLAYER(), 1)); // 1 is the ID for apple
        let initial_amount = initial_apple.amount;

        // Update food amount (add 5 more apples)
        let additional_amount: u8 = 5;
        game_system.update_food_amount(1, additional_amount);

        // Read updated food amount
        let updated_apple: Food = world.read_model((PLAYER(), 1));

        // Verify amount increased correctly
        assert(
            updated_apple.amount == initial_amount + additional_amount, 'incorrect update amount',
        );

        println!("Initial amount: {}, Updated amount: {}", initial_amount, updated_apple.amount);
    }

    #[test]
    #[available_gas(60000000)]
    fn test_update_multiple_food_types() {
        // Initialize test environment
        let world = create_test_world();
        let player_system = create_player_system(world);
        let game_system = create_game_system(world);

        cheat_caller_address(PLAYER());

        // Initialize player and add initial food
        player_system.spawn_player();
        player_system.add_initial_food();

        // Get initial amounts
        let initial_apple: Food = world.read_model((PLAYER(), 1)); // Apple
        let initial_banana: Food = world.read_model((PLAYER(), 2)); // Banana
        let initial_beef: Food = world.read_model((PLAYER(), 13)); // Beef

        // Update multiple food types
        game_system.update_food_amount(1, 3); // Add 3 apples
        game_system.update_food_amount(2, 7); // Add 7 bananas
        game_system.update_food_amount(13, 2); // Add 2 beefs

        // Read updated amounts
        let updated_apple: Food = world.read_model((PLAYER(), 1));
        let updated_banana: Food = world.read_model((PLAYER(), 2));
        let updated_beef: Food = world.read_model((PLAYER(), 13));

        // Verify all amounts increased correctly
        assert(updated_apple.amount == initial_apple.amount + 3, 'apple update failed');
        assert(updated_banana.amount == initial_banana.amount + 7, 'banana update failed');
        assert(updated_beef.amount == initial_beef.amount + 2, 'beef update failed');

        println!("Apple: {} -> {}", initial_apple.amount, updated_apple.amount);
        println!("Banana: {} -> {}", initial_banana.amount, updated_banana.amount);
        println!("Beef: {} -> {}", initial_beef.amount, updated_beef.amount);
    }


}
