// Interface definition
#[starknet::interface]
pub trait IAchieve<T> {
    // ------------------------- Minigames achievement methods -------------------------
    fn achieve_play_minigame(ref self: T);
    fn achieve_player_new_total_points(ref self: T);
    fn achieve_platform_highscore(ref self: T, score: u32);
    fn achieve_flappy_beast_highscore(ref self: T, score: u32);
    // ------------------------- BeastCare achievement methods -------------------------
    fn achieve_beast_feed(ref self: T);
    fn achieve_beast_pet(ref self: T);
    fn achieve_beast_sleep(ref self: T);
    fn achieve_beast_clean(ref self: T);
    // ------------------------- Social achievement methods -------------------------
    fn achieve_beast_share(ref self: T);
    fn achieve_score_share(ref self: T, score: u32);
    fn achieve_beast_chat(ref self: T);
}

#[dojo::contract]
pub mod achieve {
    // Local import
    use super::{IAchieve};

    // Constants import
    use tamagotchi::constants;

    // Starknet imports
    use starknet::{get_block_timestamp};

    // Tamagotchi achievements import
    use tamagotchi::achievements::achievement::{Achievement, AchievementTrait};

    // Dojo achievements imports
    use achievement::components::achievable::AchievableComponent;
    use achievement::store::{StoreTrait as AchievementStoreTrait};
    component!(path: AchievableComponent, storage: achievable, event: AchievableEvent);
    impl AchievableInternalImpl = AchievableComponent::InternalImpl<ContractState>;

    // Model imports
    #[allow(unused_imports)]
    use tamagotchi::models::beast::{Beast, BeastTrait};
    use tamagotchi::models::player::{Player, PlayerAssert};

    // Store import
    use tamagotchi::store::{StoreTrait};

    // Dojo Imports
    #[allow(unused_imports)]
    use dojo::model::{ModelStorage};
    #[allow(unused_imports)]
    use dojo::event::EventStorage;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        achievable: AchievableComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        AchievableEvent: AchievableComponent::Event,
    }

    // Constructor
    fn dojo_init(ref self: ContractState) {
        // [Event] Emit all Achievement creation events
        let mut world = self.world(@"tamagotchi");

        let mut achievement_id: u8 = 1;
        while achievement_id <= constants::ACHIEVEMENTS_COUNT {
            let achievement: Achievement = achievement_id.into();
            self
                .achievable
                .create(
                    world,
                    id: achievement.identifier(),
                    hidden: achievement.hidden(),
                    index: achievement.index(),
                    points: achievement.points(),
                    start: achievement.start(),
                    end: achievement.end(),
                    group: achievement.group(),
                    icon: achievement.icon(),
                    title: achievement.title(),
                    description: achievement.description(),
                    tasks: achievement.tasks(),
                    data: achievement.data(),
                );
            achievement_id += 1;
        }
    }

    // Implementation of the interface methods
    #[abi(embed_v0)]
    impl AchieveImpl of IAchieve<ContractState> {
        // ------------------------- Minigames achievement methods -------------------------
        // Minigames
        fn achieve_play_minigame(ref self: ContractState){
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            let achievement_store = AchievementStoreTrait::new(world);

            let mut player: Player = store.read_player();
            player.assert_exists();

            // Emit all minigames progress
            let mut achievement_id = constants::PLAY_MINIGAMES_INITIAL_COUNT;
            let counter = constants::PLAY_MINIGAMES_ACHIEVEMENTS_COUNT;
            let stop = counter + achievement_id;
            
            while achievement_id < stop {
                let task: Achievement = achievement_id.into(); // u8 to Achievement
                let task_identifier = task.identifier(); // Achievement identifier is the task to complete
                achievement_store.progress(player.address.into(), task_identifier, 1, get_block_timestamp());
                achievement_id += 1;
            }
        }

        // Score hunter
        fn achieve_player_new_total_points(ref self: ContractState){
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            let achievement_store = AchievementStoreTrait::new(world);

            let mut player: Player = store.read_player();
            player.assert_exists();

            let player_points = player.total_points;
            
            if player_points >= constants::SCOREHUNTERI_POINTS && player_points <= constants::SCOREHUNTERII_POINTS {
                // ScoreHunterI
                let task_id: felt252 = 'ScoreHunterI';
                achievement_store.progress(player.address.into(), task_id, 1, get_block_timestamp());
            }
            if player_points >= constants::SCOREHUNTERII_POINTS &&  player_points <= constants::SCOREHUNTERIII_POINTS {
                // ScoreHunterII
                let task_id: felt252 = 'ScoreHunterII';
                achievement_store.progress(player.address.into(), task_id, 1, get_block_timestamp());
            }
            if player_points >= constants::SCOREHUNTERIII_POINTS && player_points <= constants::SCOREHUNTERIV_POINTS {
                // ScoreHunterII
                let task_id: felt252 = 'ScoreHunterIII';
                achievement_store.progress(player.address.into(), task_id, 1, get_block_timestamp());
            }
            if player_points >= constants::SCOREHUNTERIV_POINTS && player_points <= constants::SCOREHUNTERV_POINTS {
                // ScoreHunterII
                let task_id: felt252 = 'ScoreHunterIV';
                achievement_store.progress(player.address.into(), task_id, 1, get_block_timestamp());
            }
            if player_points >= constants::SCOREHUNTERV_POINTS {
                // ScoreHunterII
                let task_id: felt252 = 'ScoreHunterV';
                achievement_store.progress(player.address.into(), task_id, 1, get_block_timestamp());
            }
        }

        // Platform minigame
        fn achieve_platform_highscore(ref self: ContractState, score: u32){
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            let achievement_store = AchievementStoreTrait::new(world);

            let mut player: Player = store.read_player();
            player.assert_exists();

            if score >= constants::JUMPERI_POINTS && score <= constants::JUMPERII_POINTS {
                // JumperI
                let task_id: felt252 = 'JumperI';
                achievement_store.progress(player.address.into(), task_id, 1, get_block_timestamp());
            }
            if score >= constants::JUMPERII_POINTS && score <= constants::JUMPERIII_POINTS {
                // JumperII
                let task_id: felt252 = 'JumperII';
                achievement_store.progress(player.address.into(), task_id, 1, get_block_timestamp());
            }
            if score >= constants::JUMPERIII_POINTS && score <= constants::JUMPERIV_POINTS {
                // JumperIII
                let task_id: felt252 = 'JumperIII';
                achievement_store.progress(player.address.into(), task_id, 1, get_block_timestamp());
            }
            if score >= constants::JUMPERIV_POINTS && score <= constants::JUMPERV_POINTS{
                // JumperIV
                let task_id: felt252 = 'JumperIV';
                achievement_store.progress(player.address.into(), task_id, 1, get_block_timestamp());
            }
            if score >= constants::JUMPERV_POINTS {
                // JumperV
                let task_id: felt252 = 'JumperV';
                achievement_store.progress(player.address.into(), task_id, 1, get_block_timestamp());
            }
        }

        // Flappy beasts minigame
        fn achieve_flappy_beast_highscore(ref self: ContractState, score: u32){
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            let achievement_store = AchievementStoreTrait::new(world);

            let mut player: Player = store.read_player();
            player.assert_exists();

            if score >= constants::TANGOI_POINTS && score <= constants::JUMPERII_POINTS {
                // TangoI
                let task_id: felt252 = 'TangoI';
                achievement_store.progress(player.address.into(), task_id, 1, get_block_timestamp());
            }
            if score >= constants::TANGOI_POINTS && score <= constants::JUMPERIII_POINTS {
                // TangoII
                let task_id: felt252 = 'TangoII';
                achievement_store.progress(player.address.into(), task_id, 1, get_block_timestamp());
            }
            if score >= constants::TANGOI_POINTS && score <= constants::JUMPERIV_POINTS {
                // TangoIII
                let task_id: felt252 = 'TangoIII';
                achievement_store.progress(player.address.into(), task_id, 1, get_block_timestamp());
            }
            if score >= constants::TANGOI_POINTS && score <= constants::JUMPERV_POINTS{
                // TangoIV
                let task_id: felt252 = 'TangoIV';
                achievement_store.progress(player.address.into(), task_id, 1, get_block_timestamp());
            }
            if score >= constants::TANGOI_POINTS {
                // TangoV
                let task_id: felt252 = 'TangoV';
                achievement_store.progress(player.address.into(), task_id, 1, get_block_timestamp());
            }
        }

        // ------------------------- BeastCare achievement methods -------------------------
        fn achieve_beast_feed(ref self: ContractState){
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            let achievement_store = AchievementStoreTrait::new(world);

            let mut player: Player = store.read_player();
            player.assert_exists();

            // Emit all minigames progress
            let mut achievement_id = constants::BYTEBITES_INITIAL_ID;
            let counter = constants::BYTEBITES_ACHIEVEMENTS_COUNT;
            let stop = counter + achievement_id;
            
            while achievement_id < stop {
                let task: Achievement = achievement_id.into(); // u8 to Achievement
                let task_identifier = task.identifier(); // Achievement identifier is the task to complete
                achievement_store.progress(player.address.into(), task_identifier, 1, get_block_timestamp());
                achievement_id += 1;
            }
        }

        fn achieve_beast_pet(ref self: ContractState){
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            let achievement_store = AchievementStoreTrait::new(world);

            let mut player: Player = store.read_player();
            player.assert_exists();

            // Emit all minigames progress
            let mut achievement_id = constants::PET_INITIAL_ID;
            let counter = constants::PET_ACHIEVEMENTS_COUNT;
            let stop = counter + achievement_id;
            
            while achievement_id < stop {
                let task: Achievement = achievement_id.into(); // u8 to Achievement
                let task_identifier = task.identifier(); // Achievement identifier is the task to complete
                achievement_store.progress(player.address.into(), task_identifier, 1, get_block_timestamp());
                achievement_id += 1;
            }
        }

        fn achieve_beast_sleep(ref self: ContractState){
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            let achievement_store = AchievementStoreTrait::new(world);

            let mut player: Player = store.read_player();
            player.assert_exists();

            // Emit all minigames progress
            let mut achievement_id = constants::SLEEP_INITIAL_ID;
            let counter = constants::SLEEP_ACHIEVEMENTS_COUNT;
            let stop = counter + achievement_id;
            
            while achievement_id < stop {
                let task: Achievement = achievement_id.into(); // u8 to Achievement
                let task_identifier = task.identifier(); // Achievement identifier is the task to complete
                achievement_store.progress(player.address.into(), task_identifier, 1, get_block_timestamp());
                achievement_id += 1;
            }
        }

        fn achieve_beast_clean(ref self: ContractState){
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            let achievement_store = AchievementStoreTrait::new(world);

            let mut player: Player = store.read_player();
            player.assert_exists();

            // Emit all minigames progress
            let mut achievement_id = constants::CLEAN_INITIAL_ID;
            let counter = constants::CLEAN_ACHIEVEMENTS_COUNT;
            let stop = counter + achievement_id;
            
            while achievement_id < stop {
                let task: Achievement = achievement_id.into(); // u8 to Achievement
                let task_identifier = task.identifier(); // Achievement identifier is the task to complete
                achievement_store.progress(player.address.into(), task_identifier, 1, get_block_timestamp());
                achievement_id += 1;
            }
        }

        // ------------------------- Social achievement methods -------------------------
         // Share beast on social media
        fn achieve_beast_share(ref self: ContractState) {
            let world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            let achievement_store = AchievementStoreTrait::new(world);
        
            let player = store.read_player();
            player.assert_exists();
        
            // Emit all progress achievements
            let mut achievement_id = constants::ECHONETWORK_INITIAL_ID;
            let counter = constants::ECHONETWORK_ACHIEVEMENTS_COUNT;
            let stop = counter + achievement_id;
            
            while achievement_id < stop {
                let task: Achievement = achievement_id.into(); // u8 to Achievement
                let task_identifier = task.identifier(); // Achievement identifier is the task to complete
                achievement_store.progress(player.address.into(), task_identifier, 1, get_block_timestamp());
                achievement_id += 1;
            };
        }

        // Share score on social media 
        fn achieve_score_share(ref self: ContractState, score: u32) {
            let world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            let achievement_store = AchievementStoreTrait::new(world);
        
            let player = store.read_player();
            player.assert_exists();
            
            // Progress ArenaRockstar (score thresholds)
            if score >= constants::ARENAROCKSTARI_POINTS && score <= constants::ARENAROCKSTARII_POINTS {
                let task_id: felt252 = 'ArenaRockstarI';
                achievement_store.progress(player.address.into(), task_id, 1, get_block_timestamp());
            }
            if score >= constants::ARENAROCKSTARII_POINTS && score <= constants::ARENAROCKSTARIII_POINTS {
                let task_id: felt252 = 'ArenaRockstarII';
                achievement_store.progress(player.address.into(), task_id, 1, get_block_timestamp());
            }
            if score >= constants::ARENAROCKSTARIII_POINTS && score <= constants::ARENAROCKSTARIV_POINTS {
                let task_id: felt252 = 'ArenaRockstarIII';
                achievement_store.progress(player.address.into(), task_id, 1, get_block_timestamp());
            }
            if score >= constants::ARENAROCKSTARIV_POINTS && score <= constants::ARENAROCKSTARV_POINTS {
                let task_id: felt252 = 'ArenaRockstarIV';
                achievement_store.progress(player.address.into(), task_id, 1, get_block_timestamp());
            }
            if score >= constants::ARENAROCKSTARV_POINTS {
                let task_id: felt252 = 'ArenaRockstarV';
                achievement_store.progress(player.address.into(), task_id, 1, get_block_timestamp());
            }
        }
        
        // Chat with beast
        fn achieve_beast_chat(ref self: ContractState) {
            let world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            let achievement_store = AchievementStoreTrait::new(world);
        
            let player = store.read_player();
            player.assert_exists();
        
            // Emit all progress achievements
            let mut achievement_id = constants::NEURALLINK_INITIAL_ID;
            let counter = constants::NEURALLINK_ACHIEVEMENTS_COUNT;
            let stop = counter + achievement_id;
            
            while achievement_id < stop {
                let task: Achievement = achievement_id.into(); // u8 to Achievement
                let task_identifier = task.identifier(); // Achievement identifier is the task to complete
                achievement_store.progress(player.address.into(), task_identifier, 1, get_block_timestamp());
                achievement_id += 1;
            };
        }
    }
}
