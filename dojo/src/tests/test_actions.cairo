#[cfg(test)]
mod tests {
    // Game imports
    use tamagotchi::systems::actions::{IActionsDispatcherTrait};
    use tamagotchi::tests::utils::{utils::{PLAYER, cheat_caller_address, actions_system_world}};

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
