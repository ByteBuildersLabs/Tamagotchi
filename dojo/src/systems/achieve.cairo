// Interface definition
#[starknet::interface]
pub trait IAchieve<T> {
    // ------------------------- Minigames achievement methods -------------------------
    fn achieve_play_minigame(ref self: T);
    fn achieve_player_new_total_points(ref self: T);
    fn achieve_platform_highscore(ref self: T, score: u32);
    fn achieve_flappy_beast_highscore(ref self: T, score: u32);
    // ------------------------- Social achievement methods -------------------------
    fn achieve_social_share(ref self: T, score: u32);
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
            let mut achievement_id: u8 = 1;
            
            while achievement_id <= constants::MINIGAMES_ACHIEVEMENTS_COUNT {
                achievement_store.progress(player.address.into(), achievement_id.into(), 1, get_block_timestamp());
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
                let achievement_id: felt252 = 'ScoreHunterI';
                achievement_store.progress(player.address.into(), achievement_id.into(), 1, get_block_timestamp());
            }
            if player_points >= constants::SCOREHUNTERII_POINTS &&  player_points <= constants::SCOREHUNTERIII_POINTS {
                // ScoreHunterII
                let achievement_id: felt252 = 'ScoreHunterII';
                achievement_store.progress(player.address.into(), achievement_id.into(), 1, get_block_timestamp());
            }
            if player_points >= constants::SCOREHUNTERIII_POINTS && player_points <= constants::SCOREHUNTERIV_POINTS {
                // ScoreHunterII
                let achievement_id: felt252 = 'ScoreHunterIII';
                achievement_store.progress(player.address.into(), achievement_id.into(), 1, get_block_timestamp());
            }
            if player_points >= constants::SCOREHUNTERIV_POINTS && player_points <= constants::SCOREHUNTERV_POINTS {
                // ScoreHunterII
                let achievement_id: felt252 = 'ScoreHunterIV';
                achievement_store.progress(player.address.into(), achievement_id.into(), 1, get_block_timestamp());
            }
            if player_points >= constants::SCOREHUNTERV_POINTS {
                // ScoreHunterII
                let achievement_id: felt252 = 'ScoreHunterV';
                achievement_store.progress(player.address.into(), achievement_id.into(), 1, get_block_timestamp());
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
                let achievement_id: felt252 = 'JumperI';
                achievement_store.progress(player.address.into(), achievement_id.into(), 1, get_block_timestamp());
            }
            if score >= constants::JUMPERII_POINTS && score <= constants::JUMPERIII_POINTS {
                // JumperII
                let achievement_id: felt252 = 'JumperII';
                achievement_store.progress(player.address.into(), achievement_id.into(), 1, get_block_timestamp());
            }
            if score >= constants::JUMPERIII_POINTS && score <= constants::JUMPERIV_POINTS {
                // JumperIII
                let achievement_id: felt252 = 'JumperIII';
                achievement_store.progress(player.address.into(), achievement_id.into(), 1, get_block_timestamp());
            }
            if score >= constants::JUMPERIV_POINTS && score <= constants::JUMPERV_POINTS{
                // JumperIV
                let achievement_id: felt252 = 'JumperIV';
                achievement_store.progress(player.address.into(), achievement_id.into(), 1, get_block_timestamp());
            }
            if score >= constants::JUMPERV_POINTS {
                // JumperV
                let achievement_id: felt252 = 'JumperV';
                achievement_store.progress(player.address.into(), achievement_id.into(), 1, get_block_timestamp());
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
                let achievement_id: felt252 = 'TangoI';
                achievement_store.progress(player.address.into(), achievement_id.into(), 1, get_block_timestamp());
            }
            if score >= constants::TANGOI_POINTS && score <= constants::JUMPERIII_POINTS {
                // TangoII
                let achievement_id: felt252 = 'TangoII';
                achievement_store.progress(player.address.into(), achievement_id.into(), 1, get_block_timestamp());
            }
            if score >= constants::TANGOI_POINTS && score <= constants::JUMPERIV_POINTS {
                // TangoIII
                let achievement_id: felt252 = 'TangoIII';
                achievement_store.progress(player.address.into(), achievement_id.into(), 1, get_block_timestamp());
            }
            if score >= constants::TANGOI_POINTS && score <= constants::JUMPERV_POINTS{
                // TangoIV
                let achievement_id: felt252 = 'TangoIV';
                achievement_store.progress(player.address.into(), achievement_id.into(), 1, get_block_timestamp());
            }
            if score >= constants::TANGOI_POINTS {
                // TangoV
                let achievement_id: felt252 = 'TangoV';
                achievement_store.progress(player.address.into(), achievement_id.into(), 1, get_block_timestamp());
            }
        }

        // ------------------------- Social achievement methods -------------------------
        // Share on social media
        fn achieve_social_share(ref self: ContractState, score: u32) {
            let world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            let achievement_store = AchievementStoreTrait::new(world);
        
            let achievement_echoI: felt252 = 'ECHONETWORKI';
            let achievement_echoII: felt252 = 'ECHONETWORKII';
            let achievement_echoIII: felt252 = 'ECHONETWORKIII';
            let achievement_echoIV: felt252 = 'ECHONETWORKIV';
            let achievement_echoV: felt252 = 'ECHONETWORKV';
        
            let achievement_rockstarI: felt252 = 'ARENAROCKSTARI';
            let achievement_rockstarII: felt252 = 'ARENAROCKSTARII';
            let achievement_rockstarIII: felt252 = 'ARENAROCKSTARIII';
            let achievement_rockstarIV: felt252 = 'ARENAROCKSTARIV';
            let achievement_rockstarV: felt252 = 'ARENAROCKSTARV';
        
            let player = store.read_player();
            player.assert_exists();
        
            // Progress EchoNetwork (share count)
            achievement_store.progress(player.address.into(), achievement_echoI.into(), 1, get_block_timestamp());
            achievement_store.progress(player.address.into(), achievement_echoII.into(), 1, get_block_timestamp());
            achievement_store.progress(player.address.into(), achievement_echoIII.into(), 1, get_block_timestamp());
            achievement_store.progress(player.address.into(), achievement_echoIV.into(), 1, get_block_timestamp());
            achievement_store.progress(player.address.into(), achievement_echoV.into(), 1, get_block_timestamp());
        
            // Progress ArenaRockstar (score thresholds)
            if score >= constants::ARENAROCKSTARI_POINTS {
                achievement_store.progress(player.address.into(), achievement_rockstarI.into(), 1, get_block_timestamp());
            }
            if score >= constants::ARENAROCKSTARII_POINTS {
                achievement_store.progress(player.address.into(), achievement_rockstarII.into(), 1, get_block_timestamp());
            }
            if score >= constants::ARENAROCKSTARIII_POINTS {
                achievement_store.progress(player.address.into(), achievement_rockstarIII.into(), 1, get_block_timestamp());
            }
            if score >= constants::ARENAROCKSTARIV_POINTS {
                achievement_store.progress(player.address.into(), achievement_rockstarIV.into(), 1, get_block_timestamp());
            }
            if score >= constants::ARENAROCKSTARV_POINTS {
                achievement_store.progress(player.address.into(), achievement_rockstarV.into(), 1, get_block_timestamp());
            }
        }
        
        // Chat with beast
        fn achieve_beast_chat(ref self: ContractState) {
            let world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            let achievement_store = AchievementStoreTrait::new(world);

            let achievement_neural_linkI: felt252 = 'NEURALLINKI';
            let achievement_neural_linkII: felt252 = 'NEURALLINKII';
            let achievement_neural_linkIII: felt252 = 'NEURALLINKIII';
            let achievement_neural_linkIV: felt252 = 'NEURALLINKIV';
            let achievement_neural_linkV: felt252 = 'NEURALLINKV';
        
            let player = store.read_player();
            player.assert_exists();
        
            achievement_store.progress(player.address.into(), achievement_neural_linkI.into(), 1, get_block_timestamp());
            achievement_store.progress(player.address.into(), achievement_neural_linkII.into(), 1, get_block_timestamp());
            achievement_store.progress(player.address.into(), achievement_neural_linkIII.into(), 1, get_block_timestamp());
            achievement_store.progress(player.address.into(), achievement_neural_linkIV.into(), 1, get_block_timestamp());
            achievement_store.progress(player.address.into(), achievement_neural_linkV.into(), 1, get_block_timestamp());
        }

    }
}
