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
    use tamagotchi::systems::actions::{actions, IActionsDispatcher, IActionsDispatcherTrait};
    use tamagotchi::models::beast::{Beast};
    use tamagotchi::models::beast_stats::{BeastStats};
    use tamagotchi::models::beast_status::{BeastStatus};
    use tamagotchi::models::player::{Player};
    use tamagotchi::models::food::{Food};
    use tamagotchi::tests::utils::{utils, utils::{PLAYER, cheat_caller_address, namespace_def, contract_defs, actions_system_world}};

    // This is a quick test to run the actions
    #[test]
    fn test_quick_some_actions() {
        let (actions_system, _) = actions_system_world();

        cheat_caller_address(PLAYER());
        
        actions_system.spawn_player();
        actions_system.add_initial_food();
        actions_system.spawn(1, 1);
        actions_system.set_current_beast(1);

        actions_system.decrease_status();

        assert(1 == 1, 'error counter not working')
    }
}
