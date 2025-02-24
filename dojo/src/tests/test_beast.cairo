#[cfg(test)]
mod tests {
    use dojo::model::{ModelStorage};
    use dojo::event::{Event, EventStorage};
    use dojo::world::world::Event as WorldEvent;

    // Import the interface and implementations
    use tamagotchi::systems::actions::{IActionsDispatcherTrait};

    // Import models and types
    use tamagotchi::models::beast::{Beast};
    use tamagotchi::events::beast_age::{BeastAge};
    use tamagotchi::tests::utils::{utils::{PLAYER, cheat_caller_address, actions_system_world, drop_all_events}};

    #[test]
    fn test_spawn_beast() {
        // Initialize test environment
        let (actions_system, world) = actions_system_world();

        cheat_caller_address(PLAYER());

        // Setup player
        actions_system.spawn_player();

        // Spawn beast with specie 1
        actions_system.spawn_beast(1, 1);
        actions_system.set_current_beast(1);

        // Get beast data
        let beast: Beast = world.read_model((PLAYER(), 1));
        println!("Beast Data - ID: {}, Specie: {}", 
            beast.beast_id, beast.specie);

        // Verify initial beast state
        assert(beast.beast_id == 1, 'wrong beast id');
        assert(beast.specie == 1, 'wrong specie');
    }

    #[test]
    fn test_beast_age_event() {
        // Initialize test environment
        let (_,  mut world) = actions_system_world();

        drop_all_events(world.dispatcher.contract_address);

        world.emit_event(@BeastAge{ beast_id: 1, age: 1});

        let event = starknet::testing::pop_log::<WorldEvent>(world.dispatcher.contract_address);

        assert(event.is_some(), 'no event');

        if let WorldEvent::EventEmitted(event) = event.unwrap() {
            assert(
                event.selector == Event::<BeastAge>::selector(world.namespace_hash),
                'bad event selector',
            );
            assert(event.keys == [1].span(), 'bad keys');
            assert(event.values == [1].span(), 'bad values');
        } else {
            core::panic_with_felt252('no EventEmitted event');
        }
    }

    #[test]
    fn test_multiple_beasts() {
        // Initialize test environment
        let (actions_system, world) = actions_system_world();

        cheat_caller_address(PLAYER());

        // Setup player
        actions_system.spawn_player();

        // Spawn multiple beasts
        actions_system.spawn_beast(1, 1); // First beast, specie 1
        actions_system.spawn_beast(2 , 2); // Second beast, specie 2
        actions_system.spawn_beast(3, 3); // Third beast, specie 3

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
}
