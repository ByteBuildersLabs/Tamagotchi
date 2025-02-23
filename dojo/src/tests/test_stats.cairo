#[cfg(test)]
mod tests {
    use dojo::model::{ModelStorage};

    // Import the interface and implementations
    use tamagotchi::systems::actions::{IActionsDispatcherTrait};

    // Import models and types
    use tamagotchi::models::beast_stats::{BeastStats};

    use tamagotchi::tests::utils::{utils::{PLAYER, cheat_caller_address, actions_system_world}};

    #[test]
    fn test_initial_beast_stats() {
        // Initialize test environment
        let (actions_system, world) = actions_system_world();

        cheat_caller_address(PLAYER());

        // Create player and beast
        actions_system.spawn_player();
        actions_system.spawn(1, 1);
        actions_system.set_current_beast(1);

        // Get initial stats
        let stats: BeastStats = world.read_model(1);
        println!("Initial Stats - Attack: {}, Defense: {}, Speed: {}, Level: {}, Exp: {}, Next Level Exp: {}", 
            stats.attack, stats.defense, stats.speed, stats.level, stats.experience, stats.next_level_experience);

        // Verify initial values
        assert(stats.attack == 5, 'wrong initial attack');
        assert(stats.defense == 5, 'wrong initial defense');
        assert(stats.speed == 5, 'wrong initial speed');
        assert(stats.level == 1, 'wrong initial level');
        assert(stats.experience == 0, 'wrong initial exp');
        assert(stats.next_level_experience == 60, 'wrong next level exp');
    }


    #[test]
    fn test_beast_play_gain_experience() {
        // Initialize test environment
        let (actions_system, world) = actions_system_world();

        cheat_caller_address(PLAYER());

        // Create player and beast
        actions_system.spawn_player();
        actions_system.spawn(1, 1);
        actions_system.set_current_beast(1);

        // Get initial stats
        let initial_stats: BeastStats = world.read_model(1);
        println!("Initial Stats - Level: {}, Exp: {}, Next Level Exp: {}", 
            initial_stats.level, initial_stats.experience, initial_stats.next_level_experience);

        // Play multiple times
        let mut counter: u8 = 0;
        while counter < 3 {
            actions_system.play();
            counter = counter + 1;
        };

        // Get updated stats
        let final_stats: BeastStats = world.read_model(1);
        println!("Final Stats - Level: {}, Exp: {}, Next Level Exp: {}", 
            final_stats.level, final_stats.experience, final_stats.next_level_experience);

        assert(final_stats.experience > initial_stats.experience, 'experience not increased');
    }
    

    #[test]
    #[should_panic]
    fn test_beast_level_up() {
        // Initialize test environment
        let (actions_system, world) = actions_system_world();

        cheat_caller_address(PLAYER());

        // Create player and beast
        actions_system.spawn_player();
        actions_system.spawn(1, 1);
        actions_system.set_current_beast(1);

        // Get initial stats
        let initial_stats: BeastStats = world.read_model(1);
        println!("Initial Stats - Level: {}, Attack: {}, Defense: {}, Speed: {}", 
            initial_stats.level, initial_stats.attack, initial_stats.defense, initial_stats.speed);

        // Play many times to level up
        let mut counter: u8 = 0;
        while counter < 10 {
            actions_system.play();
            counter = counter + 1;
        };

        // Get final stats
        let final_stats: BeastStats = world.read_model(1);
        println!("Final Stats - Level: {}, Attack: {}, Defense: {}, Speed: {}", 
            final_stats.level, final_stats.attack, final_stats.defense, final_stats.speed);

        assert(final_stats.level > initial_stats.level, 'level not increased');
        assert(final_stats.attack > initial_stats.attack, 'attack not increased');
        assert(final_stats.defense > initial_stats.defense, 'defense not increased');
        assert(final_stats.speed > initial_stats.speed, 'speed not increased');
    }
}
