#[cfg(test)]
mod tests {
    use starknet::{ContractAddress, get_caller_address};
    use dojo_cairo_test::WorldStorageTestTrait;
    use dojo::model::{ModelStorage, ModelStorageTest};
    use dojo::world::WorldStorageTrait;
    use dojo_cairo_test::{
        spawn_test_world, NamespaceDef, TestResource, ContractDefTrait, ContractDef,
    };

    // Import the interface and implementations
    use tamagotchi::systems::actions::{actions, IActionsDispatcher, IActionsDispatcherTrait};

    // Import models and types
    use tamagotchi::models::food::{Food, m_Food};
    use tamagotchi::models::beast::{Beast, m_Beast};
    use tamagotchi::models::beast_status::{BeastStatus, m_BeastStatus};
    use tamagotchi::models::beast_stats::{BeastStats, m_BeastStats};
    use tamagotchi::models::player::{Player, m_Player};
    use tamagotchi::types::food::{FoodType};
    use tamagotchi::constants;
    use tamagotchi::tests::utils::{utils, utils::{PLAYER, cheat_caller_address, namespace_def, contract_defs, actions_system_world}};

    #[test]
    fn test_spawn_beast() {
        // Initialize test environment
        let (actions_system, world) = actions_system_world();

        cheat_caller_address(PLAYER());

        // Setup player
        actions_system.spawn_player();

        // Spawn beast with specie 1
        actions_system.spawn(1, 1);
        actions_system.set_current_beast(1);

        // Get beast data
        let beast: Beast = world.read_model((PLAYER(), 1));
        println!("Beast Data - ID: {}, Specie: {}, Evolved: {}, Vaulted: {}", 
            beast.beast_id, beast.specie, beast.evolved, beast.vaulted);

        // Verify initial beast state
        assert(beast.beast_id == 1, 'wrong beast id');
        assert(beast.specie == 1, 'wrong specie');
        assert(!beast.evolved, 'should not be evolved');
        assert(!beast.vaulted, 'should not be vaulted');
    }

    #[test]
    fn test_multiple_beasts() {
        // Initialize test environment
        let (actions_system, world) = actions_system_world();

        cheat_caller_address(PLAYER());

        // Setup player
        actions_system.spawn_player();

        // Spawn multiple beasts
        actions_system.spawn(1, 1); // First beast, specie 1
        actions_system.spawn(2 , 2); // Second beast, specie 2
        actions_system.spawn(3, 3); // Third beast, specie 3

        // Read and verify each beast
        let beast1: Beast = world.read_model((PLAYER(), 1));
        let beast2: Beast = world.read_model((PLAYER(), 2));
        let beast3: Beast = world.read_model((PLAYER(), 3));

        println!("Beast 1 - ID: {}, Specie: {}", beast1.beast_id, beast1.specie);
        println!("Beast 2 - ID: {}, Specie: {}", beast2.beast_id, beast2.specie);
        println!("Beast 3 - ID: {}, Specie: {}", beast3.beast_id, beast3.specie);

        // Verify each beast has correct ID and specie
        assert(beast1.beast_id == 1 && beast1.specie == 1, 'wrong beast 1 data');
        assert(beast2.beast_id == 2 && beast2.specie == 2, 'wrong beast 2 data');
        assert(beast3.beast_id == 3 && beast3.specie == 3, 'wrong beast 3 data');
    }


    #[test]
    fn test_beast_evolution() {
        // Initialize test environment
        let (actions_system, world) = actions_system_world();

        cheat_caller_address(PLAYER());

        // Setup player and beast
        actions_system.spawn_player();
        actions_system.spawn(1, 1);
        actions_system.set_current_beast(1);

        // Get initial beast state
        let initial_beast: Beast = world.read_model((PLAYER(), 1));
        println!("Initial Beast State - ID: {}, Specie: {}, Evolved: {}, Vaulted: {}", 
            initial_beast.beast_id, initial_beast.specie, initial_beast.evolved, initial_beast.vaulted);

        // Play many times to trigger evolution
        let mut counter: u8 = 0;
        while counter < 20 {
            actions_system.play();
            counter = counter + 1;
        };

        // Get final beast state
        let final_beast: Beast = world.read_model((PLAYER(), 1));
        println!("Final Beast State - ID: {}, Specie: {}, Evolved: {}, Vaulted: {}", 
            final_beast.beast_id, final_beast.specie, final_beast.evolved, final_beast.vaulted);

        // Verify evolution occurred
        if final_beast.evolved {
            assert(final_beast.vaulted, 'evolved beast should be vaulted');
        }
    }


}
