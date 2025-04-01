#[cfg(test)]
mod tests {
    use dojo::model::{ModelStorage};

    // Traits import
    use tamagotchi::systems::game::IGameDispatcherTrait;
    use tamagotchi::systems::player::IPlayerDispatcherTrait;

    // Import models and types
    use tamagotchi::models::beast_status::{BeastStatus};
    use tamagotchi::tests::utils::{utils::{PLAYER, cheat_caller_address, create_game_system, create_player_system, create_test_world, cheat_block_timestamp}};

    #[test]
    fn test_beast_sleep() {
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

        // Add initial food after we have a player, a beast and the beast associated with the player
        game_system.add_initial_food(1);

        // Get new timestamp calculated status
        cheat_block_timestamp(7005000);
        let decreased_status: BeastStatus = game_system.get_timestamp_based_status();
        println!("Initial Status SLEEP TEST - Happiness: {}, Energy: {}, Is Awake: {}, Is Alive {}", 
        decreased_status.happiness, decreased_status.energy,decreased_status.is_awake, decreased_status.is_alive);

        // Make beast sleep
        game_system.sleep();
        
        cheat_block_timestamp(7005500);

        // Get final status
        let final_status: BeastStatus = game_system.get_timestamp_based_status();

        println!("Final Status SLEEP TEST - Happiness: {}, Energy: {}, Is Awake: {}, Is Alive {}", 
        final_status.happiness, final_status.energy,final_status.is_awake, final_status.is_alive);

        assert(final_status.energy > decreased_status.energy, 'energy not increased');
        assert(final_status.happiness > decreased_status.happiness, 'happiness not increased');
        assert(final_status.hunger < decreased_status.hunger, 'hunger not decreased');
        assert(final_status.hygiene < decreased_status.hygiene, 'hygiene not decreased');
        assert(!final_status.is_awake, 'beast should be sleeping');
    }

    #[test]
    fn test_beast_awake() {
        // Initialize test environment
        let world = create_test_world();
        let game_system = create_game_system(world);
        let player_system = create_player_system(world);

        cheat_caller_address(PLAYER());

        // Create player and beast
        player_system.spawn_player();
        game_system.spawn_beast(1, 1);
        player_system.set_current_beast(1);

        // Make beast sleep first
        game_system.sleep();

        // Get status while sleeping
        let sleeping_status: BeastStatus = world.read_model(1);
        println!("Status While Sleeping - Energy: {}, Is Awake: {}, Is Alive: {}", 
            sleeping_status.energy, sleeping_status.is_awake, sleeping_status.is_alive);

        // Wake up beast
        game_system.awake();

        // Get final status
        let awake_status: BeastStatus = world.read_model(1);
        println!("Status After Waking - Energy: {}, Is Awake: {}, Is Alive: {}", 
            awake_status.energy, awake_status.is_awake, awake_status.is_alive);

        assert(awake_status.is_awake, 'beast should be awake');
    }

    #[test]
    fn test_beast_play() {
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

        // Add initial food after we have a player, a beast and the beast associated with the player
        game_system.add_initial_food(1);

        // Get new timestamp calculated status
        cheat_block_timestamp(7005000);
        let decreased_status: BeastStatus = game_system.get_timestamp_based_status();
        println!("Initial Status - Happiness: {}, Energy: {}, Is Awake: {}, Is Alive {}", 
        decreased_status.happiness, decreased_status.energy,decreased_status.is_awake, decreased_status.is_alive);

        game_system.play();

        // Get final status
        let final_status: BeastStatus = world.read_model(1);
        println!("Status After Playing - Happiness: {}, Energy: {}, Hunger: {}, Is Alive: {}", 
            final_status.happiness, final_status.energy, final_status.hunger, final_status.is_alive);

        assert(final_status.happiness > decreased_status.happiness, 'happiness not increased');
        assert(final_status.energy < decreased_status.energy, 'energy not decreased');
        assert(final_status.hunger < decreased_status.hunger, 'hunger not decreased');
    }

    #[test]
    fn test_beast_pet() {
        // Initialize test environment
        let world = create_test_world();
        let game_system = create_game_system(world);
        let player_system = create_player_system(world);

        cheat_caller_address(PLAYER());
        cheat_block_timestamp(7000000);

        // Create player and beast
        player_system.spawn_player();
        game_system.spawn_beast(1, 1);
        player_system.set_current_beast(1);

        // Get status after decrease
        cheat_block_timestamp(7005000);
        let decreased_status: BeastStatus = game_system.get_timestamp_based_status();
        println!("Status After Decrease - Happiness: {}, Energy: {}", 
            decreased_status.happiness, decreased_status.energy);

        // Pet beast
        game_system.pet();

        // Get final status
        let final_status: BeastStatus = world.read_model(1);
        println!("Status After Playing - Happiness: {}, Energy: {}", 
            final_status.happiness, final_status.energy);

        assert(final_status.happiness > decreased_status.happiness, 'happiness not increased');
        assert(final_status.energy > decreased_status.energy, 'energy not increased');
    }

    #[test]
    fn test_beast_clean() {
        // Initialize test environment
        let world = create_test_world();
        let game_system = create_game_system(world);
        let player_system = create_player_system(world);

        cheat_caller_address(PLAYER());
        cheat_block_timestamp(7000000);

        // Create player and beast
        player_system.spawn_player();
        game_system.spawn_beast(1, 1);
        player_system.set_current_beast(1);

        // Get status after decrease
        cheat_block_timestamp(7005000);
        let decreased_status: BeastStatus = game_system.get_timestamp_based_status();
        println!("Status After Decrease - Hygiene: {}, Happiness: {}, Is Alive: {}", 
            decreased_status.hygiene, decreased_status.happiness, decreased_status.is_alive);

        // Clean beast
        game_system.clean();

        // Get final status
        let final_status: BeastStatus = world.read_model(1);
        println!("Status After Cleaning - Hygiene: {}, Happiness: {}, Is Alive: {}", 
            final_status.hygiene, final_status.happiness, final_status.is_alive);

        assert(final_status.hygiene > decreased_status.hygiene, 'hygiene not increased');
        assert(final_status.happiness > decreased_status.happiness, 'happiness not increased');
    }

    #[test]
    #[should_panic]
    fn test_beast_clean_status() {
        // Initialize test environment
        let world = create_test_world();
        let game_system = create_game_system(world);
        let player_system = create_player_system(world);

        cheat_caller_address(PLAYER());
        cheat_block_timestamp(7000000);

        // Create player and beast
        player_system.spawn_player();
        game_system.spawn_beast(1, 1);
        player_system.set_current_beast(1);

        // -----------------------------------------------
        // HYGIENE: 85
        cheat_block_timestamp(7009000);
        let status: BeastStatus = game_system.get_timestamp_based_status();
        assert_eq!(status.clean_status, 2, "Clean status not changed");

        // -----------------------------------------------
        // HYGIENE: 65
        cheat_block_timestamp(7021000);
        let status: BeastStatus = game_system.get_timestamp_based_status();
        assert_eq!(status.clean_status, 3, "Clean status not changed");
        

        // // -----------------------------------------------
        // HYGIENE: 45
        cheat_block_timestamp(7033000);
        let status: BeastStatus = game_system.get_timestamp_based_status();
        assert_eq!(status.clean_status, 4, "Clean status not changed");
    

        // -----------------------------------------------
        // HYGIENE: 25
        cheat_block_timestamp(7045000);
        let status: BeastStatus = game_system.get_timestamp_based_status();
        assert_eq!(status.clean_status, 5, "Clean status not changed");
        

        // -----------------------------------------------
        // HYGIENE: 5
        cheat_block_timestamp(7057000);
        let status: BeastStatus = game_system.get_timestamp_based_status();
        assert_eq!(status.clean_status, 6, "Clean status not changed");
    }

    #[test]
    fn test_beast_death() {
        // Initialize test environment
        let world = create_test_world();
        let game_system = create_game_system(world);
        let player_system = create_player_system(world);

        cheat_caller_address(PLAYER());
        cheat_block_timestamp(7000000);

        // Create player and beast
        player_system.spawn_player();
        game_system.spawn_beast(1, 1);
        player_system.set_current_beast(1);

        // Get final status
        cheat_block_timestamp(8000000);
        let final_status: BeastStatus = game_system.get_timestamp_based_status();
        println!("Final Death Status - Energy: {}, Hunger: {}, Is Alive: {}", 
            final_status.energy, final_status.hunger, final_status.is_alive);

        assert(!final_status.is_alive, 'beast should be dead');
        assert(final_status.energy == 0 || final_status.hunger == 0, 'wrong death condition');
    }

    #[test]
    fn test_beast_revive() {
        // Initialize test environment
        let world = create_test_world();
        let game_system = create_game_system(world);
        let player_system = create_player_system(world);

        cheat_caller_address(PLAYER());
        cheat_block_timestamp(7000000);

        // Create player and beast
        player_system.spawn_player();
        game_system.spawn_beast(1, 1);
        player_system.set_current_beast(1);

        // Get status when dead
        cheat_block_timestamp(8000000); // Kill beast
        let dead_status: BeastStatus = game_system.get_timestamp_based_status();
        println!("Dead Status - Energy: {}, Hunger: {}, Happiness: {}, Hygiene: {}, Is Alive: {}", 
            dead_status.energy, dead_status.hunger, dead_status.happiness, dead_status.hygiene, 
            dead_status.is_alive);

        assert(!dead_status.is_alive, 'beast should be death');
        assert(dead_status.energy == 0, 'wrong energy value');
        assert(dead_status.hunger == 0, 'wrong hunger value');
        assert(dead_status.happiness == 0, 'wrong happiness value');
        assert(dead_status.hygiene == 0, 'wrong hygiene value');

        // Revive beast
        game_system.revive();

        // Get final status
        let revived_status: BeastStatus = world.read_model(1);
        println!("Revived Status - Energy: {}, Hunger: {}, Happiness: {}, Hygiene: {}, Is Alive: {}", 
            revived_status.energy, revived_status.hunger, revived_status.happiness, 
            revived_status.hygiene, revived_status.is_alive);

        assert(revived_status.is_alive, 'beast should be alive');
        assert(revived_status.energy == 100, 'wrong energy value');
        assert(revived_status.hunger == 100, 'wrong hunger value');
        assert(revived_status.happiness == 100, 'wrong happiness value');
        assert(revived_status.hygiene == 100, 'wrong hygiene value');
    }

}
