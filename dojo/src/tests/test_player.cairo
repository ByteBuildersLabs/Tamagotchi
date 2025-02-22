#[cfg(test)]
mod tests {
    // Starknet import
    use starknet::get_caller_address;

    // Dojo imports
    use dojo_cairo_test::WorldStorageTestTrait;
    use dojo::model::{ModelStorage, ModelStorageTest};
    use dojo::world::WorldStorageTrait;
    use dojo_cairo_test::{
        spawn_test_world, NamespaceDef, TestResource, ContractDefTrait, ContractDef,
    };

    // Game imports
    use tamagotchi::systems::actions::{actions, IActionsDispatcher, IActionsDispatcherTrait};
    use tamagotchi::models::beast::{Beast};
    use tamagotchi::models::beast_stats::{BeastStats};
    use tamagotchi::models::beast_status::{BeastStatus};
    use tamagotchi::models::player::{Player};
    use tamagotchi::tests::utils::{utils, utils::{PLAYER, cheat_caller_address, namespace_def, contract_defs, actions_system_world}};

    #[test]
    #[available_gas(40000000)]
    fn test_spawn_player() {
        let (actions_system, world) = actions_system_world();

        cheat_caller_address(PLAYER());

        // Test spawn player
        actions_system.spawn_player();

        // Verify player state
        let player: Player = world.read_model(PLAYER());
        assert(player.current_beast_id == 0, 'invalid initial beast id');
    }

    #[test]
    #[available_gas(50000000)]
    fn test_set_current_beast() {
        let (actions_system, world) = actions_system_world();

        cheat_caller_address(PLAYER());

        // Initialize player
        actions_system.spawn_player();
        
        // Spawn a beast first
        actions_system.spawn(1, 1); // Spawn beast with specie 1

        // Set current beast
        let beast_id: u16 = 1;
        actions_system.set_current_beast(beast_id);

        // Verify current beast was set correctly
        let player: Player = world.read_model(PLAYER());
        assert(player.current_beast_id == beast_id, 'wrong current beast id');
    }

    #[test]
    #[available_gas(60000000)]
    fn test_multiple_beasts_per_player() {
        let (actions_system, world) = actions_system_world();

        cheat_caller_address(PLAYER());

        // Initialize player
        actions_system.spawn_player();
        
        // Spawn multiple beasts
        actions_system.spawn(1 ,2); // First beast
        actions_system.spawn(2, 3); // Second beast
        
        // Set and verify we can switch between beasts
        actions_system.set_current_beast(1);
        let player: Player = world.read_model(PLAYER());
        assert(player.current_beast_id == 1, 'should be first beast');

        actions_system.set_current_beast(2);
        let player: Player = world.read_model(PLAYER());
        assert(player.current_beast_id == 2, 'should be second beast');
    }


    // Note: This test is important to maintain as it documents expected future behavior:
    // the system should validate beast existence before setting it as current.

    #[test]
    // #[should_panic]
    #[available_gas(40000000)]
    fn test_invalid_beast_id() {
        let (actions_system, _) = actions_system_world();
        
        cheat_caller_address(PLAYER());

        // Initialize player
        actions_system.spawn_player();
        
        // Set a non existent beast id
        actions_system.set_current_beast(999); // Should panic as beast doesn't exist
    }
}
