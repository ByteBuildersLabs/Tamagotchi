#[cfg(test)]
mod tests {
    use dojo::model::{ModelStorage};
  
    // Import the interface and implementations
    use tamagotchi::systems::actions::{IActionsDispatcherTrait};

    // Import models and types
    use tamagotchi::models::food::{Food};
    use tamagotchi::models::beast_status::{BeastStatus};
    use tamagotchi::constants;
    use tamagotchi::tests::utils::{utils::{PLAYER, cheat_caller_address, actions_system_world, cheat_block_timestamp}};

    #[test]
    #[available_gas(60000000)]
    fn test_add_initial_food() {
        // Initialize test environment
        let (actions_system, world) = actions_system_world();

        cheat_caller_address(PLAYER());

        // Initialize player and add initial food
        actions_system.spawn_player();
        actions_system.add_initial_food();

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
        let (actions_system, _) = actions_system_world();
        
        cheat_caller_address(PLAYER());
        cheat_block_timestamp(7000000);

        // Create player, food, and beast
        actions_system.spawn_player();
        actions_system.add_initial_food();
        actions_system.spawn_beast(1, 3); // Spawn beast with specie 1
        actions_system.set_current_beast(1);

        // Get initial status
        let initial_status: BeastStatus = actions_system.get_timestamp_based_status();
        let initial_hunger = initial_status.hunger;
        let initial_energy = initial_status.energy;

        println!("Initial Status - Energy: {}, Hunger: {}", 
        initial_status.energy, initial_status.hunger);

        cheat_block_timestamp(7005000);

        // Get updated status
        let updated_status: BeastStatus = actions_system.get_timestamp_based_status();

        println!("Updated Status - Energy: {}, Hunger: {}", 
        initial_status.energy, initial_status.hunger);

        // Verify hunger and energy decreased
        assert(updated_status.hunger < initial_hunger, 'hunger not decreased');
        assert(updated_status.energy < initial_energy, 'energy not decreased');
    }

    #[test]
    fn test_feed_dead_beast() {
        // Initialize test environment
        let (actions_system, world) = actions_system_world();

        cheat_caller_address(PLAYER());

        // Create player, food, and beast
        actions_system.spawn_player();
        actions_system.add_initial_food();
        actions_system.spawn_beast(1, 2);
        actions_system.set_current_beast(1);

        // Kill beast by decreasing status
        let mut counter: u8 = 0;
        loop {
            let status: BeastStatus = world.read_model(1);
            if !status.is_alive {
                break;
            }
            actions_system.decrease_status();
            counter = counter + 1;
            if counter > 100 { // Safety check
                break;
            }
        };

        // Get food amount before trying to feed dead beast
        let initial_food: Food = world.read_model((PLAYER(), 0));

        // Try to feed dead beast
        actions_system.feed(0);

        // Verify food wasn't consumed
        let final_food: Food = world.read_model((PLAYER(), 0));
        assert(final_food.amount == initial_food.amount, 'food was consumed');
    } 


    #[test]
    fn test_feed_beast_increase_status() {
        // Initialize test environment
        let (actions_system, _) = actions_system_world();

        cheat_caller_address(PLAYER());
        cheat_block_timestamp(7000000);

        // Create player, food, and beast
        actions_system.spawn_player();
        actions_system.add_initial_food();
        actions_system.spawn_beast(1 ,1); // Spawn beast with specie 1
        actions_system.set_current_beast(1);

        // We decrease the status to verify that they increase after feeding
        cheat_block_timestamp(7005000);

        // Get initial status
        let initial_status: BeastStatus = actions_system.get_timestamp_based_status();
        let initial_hunger = initial_status.hunger;
        let initial_energy = initial_status.energy;

        println!("Initial Status - Energy: {}, Hunger: {}", 
        initial_status.energy, initial_status.hunger);

        // Increase status
        actions_system.feed(3);

        // Get updated status
        let updated_status: BeastStatus = actions_system.get_timestamp_based_status();

        println!("Updated Status - Energy: {}, Hunger: {}", 
        initial_status.energy, initial_status.hunger);

        // Verify hunger and energy decreased
        assert(updated_status.hunger > initial_hunger, 'hunger not increased');
        assert(updated_status.energy > initial_energy, 'energy not increased');
    }
}
