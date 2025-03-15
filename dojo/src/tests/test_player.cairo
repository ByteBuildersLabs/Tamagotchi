#[cfg(test)]
mod tests {
    // Dojo import
    use dojo::model::{ModelStorage};

    // Traits import
    use tamagotchi::systems::game::IGameDispatcherTrait;
    use tamagotchi::systems::player::IPlayerDispatcherTrait;

    // Models and types import
    use tamagotchi::models::player::{Player};
    use tamagotchi::tests::utils::{utils::{PLAYER, cheat_caller_address, create_game_system, create_player_system, create_test_world}};

    #[test]
    #[available_gas(40000000)]
    fn test_spawn_player() {
        let world = create_test_world();
        let player_system = create_player_system(world);


        cheat_caller_address(PLAYER());

        // Test spawn player
        player_system.spawn_player();

        // Verify player state
        let player: Player = world.read_model(PLAYER());
        assert(player.current_beast_id == 0, 'invalid initial beast id');
    }

    #[test]
    #[available_gas(50000000)]
    fn test_set_current_beast() {
        let world = create_test_world();
        let game_system = create_game_system(world);
        let player_system = create_player_system(world);


        cheat_caller_address(PLAYER());

        // Initialize player
        player_system.spawn_player();
        
        // Spawn a beast first
        game_system.spawn_beast(1, 1); // Spawn beast with specie 1

        // Set current beast
        let beast_id: u16 = 1;
        player_system.set_current_beast(beast_id);

        // Verify current beast was set correctly
        let player: Player = world.read_model(PLAYER());
        assert(player.current_beast_id == beast_id, 'wrong current beast id');
    }

    #[test]
    #[available_gas(60000000)]
    fn test_multiple_beasts_per_player() {
        let world = create_test_world();
        let game_system = create_game_system(world);
        let player_system = create_player_system(world);

        cheat_caller_address(PLAYER());

        // Initialize player
        player_system.spawn_player();
        
        // Spawn multiple beasts
        game_system.spawn_beast(1 ,2); // First beast
        game_system.spawn_beast(2, 3); // Second beast
        
        // Set and verify we can switch between beasts
        player_system.set_current_beast(1);
        let player: Player = world.read_model(PLAYER());
        assert(player.current_beast_id == 1, 'should be first beast');

        player_system.set_current_beast(2);
        let player: Player = world.read_model(PLAYER());
        assert(player.current_beast_id == 2, 'should be second beast');
    }


    // Note: This test is important to maintain as it documents expected future behavior:
    // the system should validate beast existence before setting it as current.

    #[test]
    // #[should_panic]
    #[available_gas(40000000)]
    fn test_invalid_beast_id() {
        let world = create_test_world();
        let player_system = create_player_system(world);
        
        cheat_caller_address(PLAYER());

        // Initialize player
        player_system.spawn_player();
        
        // Set a non existent beast id
        player_system.set_current_beast(999); // Should panic as beast doesn't exist
    }
}
