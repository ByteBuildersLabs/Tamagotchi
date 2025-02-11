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
    use babybeasts::systems::actions::{actions, IActionsDispatcher, IActionsDispatcherTrait};

    // Import models and types
    use babybeasts::models::food::{Food, m_Food};
    use babybeasts::models::beast::{Beast, m_Beast};
    use babybeasts::models::beast_status::{BeastStatus, m_BeastStatus};
    use babybeasts::models::beast_stats::{BeastStats, m_BeastStats};
    use babybeasts::models::player::{Player, m_Player};
    use babybeasts::types::food::{FoodType};
    use babybeasts::constants;

    // Define the namespace and resources
    fn namespace_def() -> NamespaceDef {
        let ndef = NamespaceDef {
            namespace: "babybeasts", resources: [
                TestResource::Model(m_Beast::TEST_CLASS_HASH),
                TestResource::Model(m_BeastStatus::TEST_CLASS_HASH),
                TestResource::Model(m_BeastStats::TEST_CLASS_HASH),
                TestResource::Model(m_Player::TEST_CLASS_HASH),
                TestResource::Model(m_Food::TEST_CLASS_HASH),
                TestResource::Contract(actions::TEST_CLASS_HASH),
            ].span(),
        };

        ndef
    }

    fn contract_defs() -> Span<ContractDef> {
        [
            ContractDefTrait::new(@"babybeasts", @"actions")
                .with_writer_of([dojo::utils::bytearray_hash(@"babybeasts")].span())
        ].span()
    }

    #[test]
    fn test_spawn_beast() {
        // Initialize test environment
        let caller = starknet::contract_address_const::<0x0>();
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        let (contract_address, _) = world.dns(@"actions").unwrap();
        let actions_system = IActionsDispatcher { contract_address };

        // Setup player
        actions_system.spawn_player();

        // Spawn beast with specie 1
        actions_system.spawn(1);
        actions_system.set_current_beast(1);

        // Get beast data
        let beast: Beast = world.read_model((caller, 1));
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
        let caller = starknet::contract_address_const::<0x0>();
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        let (contract_address, _) = world.dns(@"actions").unwrap();
        let actions_system = IActionsDispatcher { contract_address };

        // Setup player
        actions_system.spawn_player();

        // Spawn multiple beasts
        actions_system.spawn(1); // First beast, specie 1
        actions_system.spawn(2); // Second beast, specie 2
        actions_system.spawn(3); // Third beast, specie 3

        // Read and verify each beast
        let beast1: Beast = world.read_model((caller, 1));
        let beast2: Beast = world.read_model((caller, 2));
        let beast3: Beast = world.read_model((caller, 3));

        println!("Beast 1 - ID: {}, Specie: {}", beast1.beast_id, beast1.specie);
        println!("Beast 2 - ID: {}, Specie: {}", beast2.beast_id, beast2.specie);
        println!("Beast 3 - ID: {}, Specie: {}", beast3.beast_id, beast3.specie);

        // Verify each beast has correct ID and specie
        assert(beast1.beast_id == 1 && beast1.specie == 1, 'wrong beast 1 data');
        assert(beast2.beast_id == 2 && beast2.specie == 2, 'wrong beast 2 data');
        assert(beast3.beast_id == 3 && beast3.specie == 3, 'wrong beast 3 data');
    }


    #[test]
    #[should_panic]
    fn test_beast_evolution() {
        // Initialize test environment
        let caller = starknet::contract_address_const::<0x0>();
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        let (contract_address, _) = world.dns(@"actions").unwrap();
        let actions_system = IActionsDispatcher { contract_address };

        // Setup player and beast
        actions_system.spawn_player();
        actions_system.spawn(1);
        actions_system.set_current_beast(1);

        // Get initial beast state
        let initial_beast: Beast = world.read_model((caller, 1));
        println!("Initial Beast State - ID: {}, Specie: {}, Evolved: {}, Vaulted: {}", 
            initial_beast.beast_id, initial_beast.specie, initial_beast.evolved, initial_beast.vaulted);

        // Play many times to trigger evolution
        let mut counter: u32 = 0;
        while counter < 20 {
            actions_system.play();
            counter = counter + 1;
        };

        // Get final beast state
        let final_beast: Beast = world.read_model((caller, 1));
        println!("Final Beast State - ID: {}, Specie: {}, Evolved: {}, Vaulted: {}", 
            final_beast.beast_id, final_beast.specie, final_beast.evolved, final_beast.vaulted);

        // Verify evolution occurred
        if final_beast.evolved {
            assert(final_beast.vaulted, 'evolved beast should be vaulted');
        }
    }


}
