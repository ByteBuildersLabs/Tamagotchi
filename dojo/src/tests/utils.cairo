mod utils {
    // Starknet imports
    use starknet::testing::{set_contract_address, set_account_contract_address};
    use starknet::{ContractAddress, contract_address_const};
    
    // Dojo imports
    use dojo_cairo_test::WorldStorageTestTrait;
    use dojo::model::{ModelStorage, ModelStorageTest};
    use dojo::world::{WorldStorageTrait, WorldStorage};
    use dojo_cairo_test::{
        spawn_test_world, NamespaceDef, TestResource, ContractDefTrait, ContractDef,
    };

    // Game imports
    use babybeasts::systems::actions::{actions, IActionsDispatcher, IActionsDispatcherTrait};
    use babybeasts::models::beast::{Beast, m_Beast};
    use babybeasts::models::beast_stats::{BeastStats, m_BeastStats};
    use babybeasts::models::beast_status::{BeastStatus, m_BeastStatus};
    use babybeasts::models::player::{Player, m_Player};
    use babybeasts::models::food::{Food, m_Food};
    use babybeasts::constants;

    // Constants
    fn PLAYER() -> ContractAddress {
        starknet::contract_address_const::<'PLAYER'>()
    }

    fn namespace_def() -> NamespaceDef {
        let ndef = NamespaceDef {
            namespace: "babybeasts",
            resources: [
                TestResource::Model(m_Beast::TEST_CLASS_HASH),
                TestResource::Model(m_BeastStats::TEST_CLASS_HASH),
                TestResource::Model(m_BeastStatus::TEST_CLASS_HASH),
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
        ]
            .span()
    }


    fn actions_system_world() -> (IActionsDispatcher, WorldStorage){
         // Initialize test environment
         let ndef = namespace_def();

         // Register the resources.
         let mut world = spawn_test_world([ndef].span());
 
         // Ensures permissions and initializations are synced.
         world.sync_perms_and_inits(contract_defs());
 
         let (contract_address, _) = world.dns(@"actions").unwrap();
         let actions_system = IActionsDispatcher { contract_address };
         (actions_system, world)
    }

    // set_contract_address: used to define the address of the calling contract,
    // set_account_contract_address: used to define the address of the account used for the current
    // transaction.
    fn cheat_caller_address(address: ContractAddress) {
        set_contract_address(address);
        set_account_contract_address(address);
    }

}
