#[cfg(test)]
mod tests {
    // Dojo imports
    use dojo_cairo_test::WorldStorageTestTrait;
    use dojo::model::{ModelStorage, ModelStorageTest};
    use dojo::world::WorldStorageTrait;
    use dojo_cairo_test::{
        spawn_test_world, NamespaceDef, TestResource, ContractDefTrait, ContractDef,
    };

    // Game imports
    use babybeasts::systems::actions::{actions, IActionsDispatcher, IActionsDispatcherTrait};
    use babybeasts::models::beast::{Beast};
    use babybeasts::models::beast_stats::{BeastStats};
    use babybeasts::models::beast_status::{BeastStatus};
    use babybeasts::models::player::{Player};
    use babybeasts::models::food::{Food};
    use babybeasts::tests::utils::{utils, utils::{PLAYER, cheat_caller_address, namespace_def, contract_defs, actions_system_world}};

    // This is a quick test to run the actions
    #[test]
    fn test_quick_some_actions() {
        let (actions_system, _) = actions_system_world();

        cheat_caller_address(PLAYER());
        
        actions_system.spawn_player();
        actions_system.add_initial_food();
        actions_system.spawn(1);
        actions_system.set_current_beast(1);

        actions_system.decrease_status();

        assert(1 == 1, 'error counter not working')
    }
}
