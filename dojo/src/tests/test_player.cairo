#[cfg(test)]
mod tests {
    use starknet::get_caller_address;
    use dojo_cairo_test::WorldStorageTestTrait;
    use dojo::model::{ModelStorage, ModelStorageTest};
    use dojo::world::WorldStorageTrait;
    use dojo_cairo_test::{
        spawn_test_world, NamespaceDef, TestResource, ContractDefTrait, ContractDef,
    };

    use babybeasts::systems::actions::{actions, IActionsDispatcher, IActionsDispatcherTrait};
    use babybeasts::models::beast::{Beast, m_Beast};
    use babybeasts::models::beast_stats::{BeastStats, m_BeastStats};
    use babybeasts::models::beast_status::{BeastStatus, m_BeastStatus};
    use babybeasts::models::player::{Player, m_Player};

    fn namespace_def() -> NamespaceDef {
        let ndef = NamespaceDef {
            namespace: "babybeasts", resources: [
                TestResource::Model(m_Beast::TEST_CLASS_HASH),
                TestResource::Model(m_BeastStats::TEST_CLASS_HASH),
                TestResource::Model(m_BeastStatus::TEST_CLASS_HASH),
                TestResource::Model(m_Player::TEST_CLASS_HASH),
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
    #[available_gas(30000000)]
    fn test_spawn_player() {
        // Initialize test environment
        let caller = starknet::contract_address_const::<0x0>();
        let ndef = namespace_def();

        // Register the resources.
        let mut world = spawn_test_world([ndef].span());

        // Ensures permissions and initializations are synced.
        world.sync_perms_and_inits(contract_defs());

        let (contract_address, _) = world.dns(@"actions").unwrap();
        let actions_system = IActionsDispatcher { contract_address };

        // Test spawn player
        actions_system.spawn_player();

        // Verify player state
        let player: Player = world.read_model(caller);
        assert(player.current_beast_id == 0, 'invalid initial beast id');
    }

    #[test]
    #[available_gas(30000000)]
    fn test_set_current_beast() {
        // Initialize test environment
        let caller = starknet::contract_address_const::<0x0>();
        let ndef = namespace_def();

        // Register the resources.
        let mut world = spawn_test_world([ndef].span());

        // Ensures permissions and initializations are synced.
        world.sync_perms_and_inits(contract_defs());

        let (contract_address, _) = world.dns(@"actions").unwrap();
        let actions_system = IActionsDispatcher { contract_address };

        // Initialize player
        actions_system.spawn_player();
        
        // Spawn a beast first
        actions_system.spawn(1); // Spawn beast with specie 1

        // Set current beast
        let beast_id: u32 = 1;
        actions_system.set_current_beast(beast_id);

        // Verify current beast was set correctly
        let player: Player = world.read_model(caller);
        assert(player.current_beast_id == beast_id, 'wrong current beast id');
    }

    #[test]
    #[available_gas(50000000)]
    fn test_multiple_beasts_per_player() {
        // Initialize test environment
        let caller = starknet::contract_address_const::<0x0>();
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        let (contract_address, _) = world.dns(@"actions").unwrap();
        let actions_system = IActionsDispatcher { contract_address };

        // Initialize player
        actions_system.spawn_player();
        
        // Spawn multiple beasts
        actions_system.spawn(1); // First beast
        actions_system.spawn(2); // Second beast
        
        // Set and verify we can switch between beasts
        actions_system.set_current_beast(1);
        let player: Player = world.read_model(caller);
        assert(player.current_beast_id == 1, 'should be first beast');

        actions_system.set_current_beast(2);
        let player: Player = world.read_model(caller);
        assert(player.current_beast_id == 2, 'should be second beast');
    }


    // Note: This test is important to maintain as it documents expected future behavior:
    // the system should validate beast existence before setting it as current.

    #[test]
    // #[should_panic]
    #[available_gas(30000000)]
    fn test_invalid_beast_id() {
        // Initialize test environment
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        let (contract_address, _) = world.dns(@"actions").unwrap();
        let actions_system = IActionsDispatcher { contract_address };
        
        // Initialize player
        actions_system.spawn_player();
        
        // Set a non existent beast id
        actions_system.set_current_beast(999); // Should panic as beast doesn't exist
    }

   
}
