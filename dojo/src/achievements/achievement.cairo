// Dojo achievements import
use achievement::types::task::{Task, TaskTrait};

// Into trait import
use core::traits::Into;

// Achievement enum
#[derive(Copy, Drop)]
pub enum Achievement {
    None,
    // Minigames
    MiniGamer,
    MasterGamer,
    LegendGamer,
    AllStarGamer,
    ScoreHunterI,
    ScoreHunterII,
    ScoreHunterIII,
    ScoreHunterIV,
    ScoreHunterV,
    JumperI,
    JumperII,
    JumperIII,
    JumperIV,
    JumperV,
    TangoI,
    TangoII,
    TangoIII,
    TangoIV,
    TangoV,
    // Social
    EchoNetworkI,
    EchoNetworkII,
    EchoNetworkIII,
    EchoNetworkIV,
    EchoNetworkV,
    ArenaRockstarI,
    ArenaRockstarII,
    ArenaRockstarIII,
    ArenaRockstarIV,
    ArenaRockstarV,
    NeuralLinkI,
    NeuralLinkII,
    NeuralLinkIII,
    NeuralLinkIV,
    NeuralLinkV,
    // BeastCare
    ByteBitesI,
    ByteBitesII,
    ByteBitesIII,
    ByteBitesIV,
    ByteBitesV,
    BeastFriendI,
    BeastFriendII,
    BeastFriendIII,
    BeastFriendIV,
    BeastFriendV,
    NapMasterI,
    NapMasterII,
    NapMasterIII,
    NapMasterIV,
    NapMasterV,
    CleanStreakI,
    CleanStreakII,
    CleanStreakIII,
    CleanStreakIV,
    CleanStreakV,
}


#[generate_trait]
pub impl AchievementImpl of AchievementTrait {
    #[inline]
    fn identifier(self: Achievement) -> felt252 {
        match self {
            Achievement::None => "None",
            Achievement::MiniGamer => "MiniGamer", // Play a minigame once
            Achievement::MasterGamer => "MasterGamer", // Play a minigame 15 times
            Achievement::LegendGamer => "LegendGamer", // Play a minigame 30 times
            Achievement::AllStarGamer => "AllStarGamer", // Play a minigame 50 times 

            Achievement::ScoreHunterI => "ScoreHunterI", // Get 2000 total points from minigames
            Achievement::ScoreHunterII => "ScoreHunterII", // Get 5000 total points from minigames
            Achievement::ScoreHunterIII => "ScoreHunterIII", // Get 12000 total points from minigames
            Achievement::ScoreHunterIV => "ScoreHunterIV", // Get 20000 total points from minigames
            Achievement::ScoreHunterV => "ScoreHunterV", // Get 50000 total points from minigames
        
            Achievement::JumperI => "JumperI", // Reach 500 points in a single platform game
            Achievement::JumperII => "JumperII", // Reach 1500 points in a single platform game
            Achievement::JumperIII => "JumperIII", // Reach 2500 points in a single platform game
            Achievement::JumperIV => "JumperIV", // Reach 3500 points in a single platform game
            Achievement::JumperV => "JumperV", // Reach 4500 points in a single platform game
        
            Achievement::TangoI => "TangoI", // Reach 25 points in a single flappy beasts game
            Achievement::TangoII => "TangoII", // Reach 50 points in a single flappy beasts game
            Achievement::TangoIII => "TangoIII", // Reach 100 points in a single flappy beasts game
            Achievement::TangoIV => "TangoIV", // Reach 200 points in a single flappy beasts game
            Achievement::TangoV => "TangoV", // Reach 350 points in a single flappy beasts game
            Achievement::EchoNetworkI => 'EchoNetworkI', // Shared Beast for the first time

            Achievement::EchoNetworkII => 'EchoNetworkII', // Shared beast 5 times
            Achievement::EchoNetworkIII => 'EchoNetworkIII', // Shared beast 10 times
            Achievement::EchoNetworkIV => 'EchoNetworkIV', // Shared your Beast 25 times
            Achievement::EchoNetworkV => 'EchoNetworkV', // Shared your Beast 50 times

            Achievement::ArenaRockstarI => 'ArenaRockstarI', // Shared a score of 500
            Achievement::ArenaRockstarII => 'ArenaRockstarII', // Shared a score of 1500
            Achievement::ArenaRockstarIII => 'ArenaRockstarIII', // Shared a score of 3000
            Achievement::ArenaRockstarIV => 'ArenaRockstarIV', // Shared a score of 5000
            Achievement::ArenaRockstarV => 'ArenaRockstarV', // Shared a score of 9999
            
            Achievement::NeuralLinkI => 'NeuralLinkI', // Talked to your Beast for the first time
            Achievement::NeuralLinkII => 'NeuralLinkII', // Talked to your Beast 5 times
            Achievement::NeuralLinkIII => 'NeuralLinkIII', // Talked to your Beast 10 times
            Achievement::NeuralLinkIV => 'NeuralLinkIV', // Talked to your Beast 20 times
            Achievement::NeuralLinkV => 'NeuralLinkV' // Talked to your Beast 50 times
        
            Achievement::ByteBitesI => "ByteBitesI", // Feed your beast once
            Achievement::ByteBitesII => "ByteBitesII", // Feed your beast 20 times
            Achievement::ByteBitesIII => "ByteBitesIII", // Feed your beast 50 times
            Achievement::ByteBitesIV => "ByteBitesIV", // Feed your beast 150 times
            Achievement::ByteBitesV => "ByteBitesV", // Feed your beast 250 times
        
            Achievement::BeastFriendI => "BeastFriendI", // Pet your beast once
            Achievement::BeastFriendII => "BeastFriendII", // Pet your beast 20 times
            Achievement::BeastFriendIII => "BeastFriendIII", // Pet your beast 20 times
            Achievement::BeastFriendIV => "BeastFriendIV", // Pet your beast 20 times
            Achievement::BeastFriendV => "BeastFriendV", // Pet your beast 20 times
        
            Achievement::NapMasterI => "NapMasterI", // Put your beast to sleep once
            Achievement::NapMasterII => "NapMasterII", // Put your beast to sleep 10 times
            Achievement::NapMasterIII => "NapMasterIII", // Put your beast to sleep 25 times
            Achievement::NapMasterIV => "NapMasterIV", // Put your beast to sleep 55 times
            Achievement::NapMasterV => "NapMasterV", // Put your beast to sleep 100 times

            Achievement::CleanStreakI => "CleanStreakI", // Clean your beast once
            Achievement::CleanStreakII => "CleanStreakII", // Clean your beast 25 times
            Achievement::CleanStreakIII => "CleanStreakIII", // Clean your beast 55 times
            Achievement::CleanStreakIV => "CleanStreakIV", // Clean your beast 100 times
            Achievement::CleanStreakV => "CleanStreakV", // Clean your beast 200 times
        }        
    }

    #[inline]
    fn hidden(self: Achievement) -> bool {
        match self {
            Achievement::None => true,
            Achievement::MiniGamer => false,
            Achievement::MasterGamer => false,
            Achievement::LegendGamer => false,
            Achievement::AllStarGamer => false,
            Achievement::ScoreHunterI => false,
            Achievement::ScoreHunterII => false,
            Achievement::ScoreHunterIII => false,
            Achievement::ScoreHunterIV => false,
            Achievement::ScoreHunterV => false,
            Achievement::JumperI => false,
            Achievement::JumperII => false,
            Achievement::JumperIII => false,
            Achievement::JumperIV => false,
            Achievement::JumperV => false,
            Achievement::TangoI => false,
            Achievement::TangoII => false,
            Achievement::TangoIII => false,
            Achievement::TangoIV => false,
            Achievement::TangoV => false,
            Achievement::EchoNetworkI => false,
            Achievement::EchoNetworkII => false,
            Achievement::EchoNetworkIII => false,
            Achievement::EchoNetworkIV => false,
            Achievement::EchoNetworkV => false,
            Achievement::ArenaRockstarI => false,
            Achievement::ArenaRockstarII => false,
            Achievement::ArenaRockstarIII => false,
            Achievement::ArenaRockstarIV => false,
            Achievement::ArenaRockstarV => false,
            Achievement::NeuralLinkI => false,
            Achievement::NeuralLinkII => false,
            Achievement::NeuralLinkIII => false,
            Achievement::NeuralLinkIV => false,
            Achievement::NeuralLinkV => false,
        }
    }

    #[inline]
    fn index(self: Achievement) -> u8 {
        match self {
            Achievement::None => 0,
            Achievement::MiniGamer => 0,
            Achievement::MasterGamer => 1,
            Achievement::LegendGamer => 2,
            Achievement::AllStarGamer => 3,
            Achievement::ScoreHunterI => 0,
            Achievement::ScoreHunterII => 1,
            Achievement::ScoreHunterIII => 2,
            Achievement::ScoreHunterIV => 3,
            Achievement::ScoreHunterV => 4,
            Achievement::JumperI => 0,
            Achievement::JumperII => 1,
            Achievement::JumperIII => 2,
            Achievement::JumperIV => 3,
            Achievement::JumperV => 4,
            Achievement::TangoI => 0,
            Achievement::TangoII => 1,
            Achievement::TangoIII => 2,
            Achievement::TangoIV => 3,
            Achievement::TangoV => 4,
            Achievement::EchoNetworkI => 0,
            Achievement::EchoNetworkII => 1,
            Achievement::EchoNetworkIII => 2,
            Achievement::EchoNetworkIV => 3,
            Achievement::EchoNetworkV => 4,
            Achievement::ArenaRockstarI => 0,
            Achievement::ArenaRockstarII => 1,
            Achievement::ArenaRockstarIII => 2,
            Achievement::ArenaRockstarIV => 3,
            Achievement::ArenaRockstarV => 4,
            Achievement::NeuralLinkI => 0,
            Achievement::NeuralLinkII => 1,
            Achievement::NeuralLinkIII => 2,
            Achievement::NeuralLinkIV => 3,
            Achievement::NeuralLinkV => 4,
        }
    }

    #[inline]
    fn points(self: Achievement) -> u16 {
        match self {
            Achievement::None => 0,
            Achievement::MiniGamer => 10,
            Achievement::MasterGamer => 15,
            Achievement::LegendGamer => 25,
            Achievement::AllStarGamer => 35,
            Achievement::ScoreHunterI => 10,
            Achievement::ScoreHunterII => 20,
            Achievement::ScoreHunterIII => 30,
            Achievement::ScoreHunterIV => 40,
            Achievement::ScoreHunterV => 50,
            Achievement::JumperI => 10,
            Achievement::JumperII => 20,
            Achievement::JumperIII => 30,
            Achievement::JumperIV => 40,
            Achievement::JumperV => 50,
            Achievement::TangoI => 10,
            Achievement::TangoII => 20,
            Achievement::TangoIII => 30,
            Achievement::TangoIV => 40,
            Achievement::TangoV => 50,
            Achievement::EchoNetworkI => 10,
            Achievement::EchoNetworkII => 20,
            Achievement::EchoNetworkIII => 30,
            Achievement::EchoNetworkIV => 40,
            Achievement::EchoNetworkV => 50,
            Achievement::ArenaRockstarI => 10,
            Achievement::ArenaRockstarII => 20,
            Achievement::ArenaRockstarIII => 30,
            Achievement::ArenaRockstarIV => 40,
            Achievement::ArenaRockstarV => 50,
            Achievement::NeuralLinkI => 10,
            Achievement::NeuralLinkII => 20,
            Achievement::NeuralLinkIII => 30,
            Achievement::NeuralLinkIV => 40,
            Achievement::NeuralLinkV => 50,
        }
    }

    #[inline]
    fn start(self: Achievement) -> u64 {
        match self {
            Achievement::None => 0,
            Achievement::MiniGamer => 0,
            Achievement::MasterGamer => 0,
            Achievement::LegendGamer => 0,
            Achievement::AllStarGamer => 0,
            Achievement::ScoreHunterI => 0,
            Achievement::ScoreHunterII => 0,
            Achievement::ScoreHunterIII => 0,
            Achievement::ScoreHunterIV => 0,
            Achievement::ScoreHunterV => 0,
            Achievement::JumperI => 0,
            Achievement::JumperII => 0,
            Achievement::JumperIII => 0,
            Achievement::JumperIV => 0,
            Achievement::JumperV => 0,
            Achievement::TangoI => 0,
            Achievement::TangoII => 0,
            Achievement::TangoIII => 0,
            Achievement::TangoIV => 0,
            Achievement::TangoV => 0,
            Achievement::EchoNetworkI => 0,
            Achievement::EchoNetworkII => 0,
            Achievement::EchoNetworkIII => 0,
            Achievement::EchoNetworkIV => 0,
            Achievement::EchoNetworkV => 0,
            Achievement::ArenaRockstarI => 0,
            Achievement::ArenaRockstarII => 0,
            Achievement::ArenaRockstarIII => 0,
            Achievement::ArenaRockstarIV => 0,
            Achievement::ArenaRockstarV => 0,
            Achievement::NeuralLinkI => 0,
            Achievement::NeuralLinkII => 0,
            Achievement::NeuralLinkIII => 0,
            Achievement::NeuralLinkIV => 0,
            Achievement::NeuralLinkV => 0,
        }
    }

    #[inline]
    fn end(self: Achievement) -> u64 {
        match self {
            Achievement::None => 0,
            Achievement::MiniGamer => 0,
            Achievement::MasterGamer => 0,
            Achievement::LegendGamer => 0,
            Achievement::AllStarGamer => 0,
            Achievement::ScoreHunterI => 0,
            Achievement::ScoreHunterII => 0,
            Achievement::ScoreHunterIII => 0,
            Achievement::ScoreHunterIV => 0,
            Achievement::ScoreHunterV => 0,
            Achievement::JumperI => 0,
            Achievement::JumperII => 0,
            Achievement::JumperIII => 0,
            Achievement::JumperIV => 0,
            Achievement::JumperV => 0,
            Achievement::TangoI => 0,
            Achievement::TangoII => 0,
            Achievement::TangoIII => 0,
            Achievement::TangoIV => 0,
            Achievement::TangoV => 0,
            Achievement::EchoNetworkI => 0,
            Achievement::EchoNetworkII => 0,
            Achievement::EchoNetworkIII => 0,
            Achievement::EchoNetworkIV => 0,
            Achievement::EchoNetworkV => 0,
            Achievement::ArenaRockstarI => 0,
            Achievement::ArenaRockstarII => 0,
            Achievement::ArenaRockstarIII => 0,
            Achievement::ArenaRockstarIV => 0,
            Achievement::ArenaRockstarV => 0,
            Achievement::NeuralLinkI => 0,
            Achievement::NeuralLinkII => 0,
            Achievement::NeuralLinkIII => 0,
            Achievement::NeuralLinkIV => 0,
            Achievement::NeuralLinkV => 0,
        }
    }

    #[inline]
    fn group(self: Achievement) -> felt252 {
        match self {
            Achievement::None => 0,
            Achievement::MiniGamer => 'Gamer',
            Achievement::MasterGamer => 'Gamer',
            Achievement::LegendGamer => 'Gamer',
            Achievement::AllStarGamer => 'Gamer',
            Achievement::ScoreHunterI => 'ScoreHunter',
            Achievement::ScoreHunterII => 'ScoreHunter',
            Achievement::ScoreHunterIII => 'ScoreHunter',
            Achievement::ScoreHunterIV => 'ScoreHunter',
            Achievement::ScoreHunterV => 'ScoreHunter',
            Achievement::JumperI => 'Jumper',
            Achievement::JumperII => 'Jumper',
            Achievement::JumperIII => 'Jumper',
            Achievement::JumperIV => 'Jumper',
            Achievement::JumperV => 'Jumper',
            Achievement::TangoI => 'Tango',
            Achievement::TangoII => 'Tango',
            Achievement::TangoIII => 'Tango',
            Achievement::TangoIV => 'Tango',
            Achievement::TangoV => 'Tango',
            Achievement::EchoNetworkI => 'EchoNetwork',
            Achievement::EchoNetworkII => 'EchoNetwork',
            Achievement::EchoNetworkIII => 'EchoNetwork',
            Achievement::EchoNetworkIV => 'EchoNetwork',
            Achievement::EchoNetworkV => 'EchoNetwork',
            Achievement::ArenaRockstarI => 'ArenaRockstar',
            Achievement::ArenaRockstarII => 'ArenaRockstar',
            Achievement::ArenaRockstarIII => 'ArenaRockstar',
            Achievement::ArenaRockstarIV => 'ArenaRockstar',
            Achievement::ArenaRockstarV => 'ArenaRockstar',
            Achievement::NeuralLinkI => 'NeuralLink',
            Achievement::NeuralLinkII => 'NeuralLink',
            Achievement::NeuralLinkIII => 'NeuralLink',
            Achievement::NeuralLinkIV => 'NeuralLink',
            Achievement::NeuralLinkV => 'NeuralLink',
        }
    }

    #[inline]
    fn icon(self: Achievement) -> felt252 {
        match self {
            Achievement::None => '',
            // Gamer progression
            Achievement::MiniGamer => 'fa-gamepad',
            Achievement::MasterGamer => 'fa-chess-knight',
            Achievement::LegendGamer => 'fa-dungeon',
            Achievement::AllStarGamer => 'fa-star',
            // ScoreHunter levels
            Achievement::ScoreHunterI => 'fa-crosshairs',
            Achievement::ScoreHunterII => 'fa-bullseye',
            Achievement::ScoreHunterIII => 'fa-chart-line',
            Achievement::ScoreHunterIV => 'fa-trophy',
            Achievement::ScoreHunterV => 'fa-crown',
            // Jumper (platform game)
            Achievement::JumperI => 'fa-shoe-prints',
            Achievement::JumperII => 'fa-arrow-up',
            Achievement::JumperIII => 'fa-stairs',
            Achievement::JumperIV => 'fa-mountain',
            Achievement::JumperV => 'fa-rocket',
            // Tango (flappy beasts game)
            Achievement::TangoI => 'fa-feather',
            Achievement::TangoII => 'fa-wind',
            Achievement::TangoIII => 'fa-bird',
            Achievement::TangoIV => 'fa-cloud-arrow-up',
            Achievement::TangoV => 'fa-jet-fighter',
            // Share in X your beast
            Achievement::EchoNetworkI => 'fa-feather-alt',
            Achievement::EchoNetworkII => 'fa-book',
            Achievement::EchoNetworkIII => 'fa-wifi',
            Achievement::EchoNetworkIV => 'fa-broadcast-tower',
            Achievement::EchoNetworkV => 'fa-volume-up',
            // Share in X your score
            Achievement::ArenaRockstarI => 'fa-fire',
            Achievement::ArenaRockstarII => 'fa-bullhorn',
            Achievement::ArenaRockstarIII => 'fa-star',
            Achievement::ArenaRockstarIV => 'fa-trophy',
            Achievement::ArenaRockstarV => 'fa-dragon',
            // Talk to your beast
            Achievement::NeuralLinkI => 'fa-comments',
            Achievement::NeuralLinkII => 'fa-heart',
            Achievement::NeuralLinkIII => 'fa-brain',
            Achievement::NeuralLinkIV => 'fa-link',
            Achievement::NeuralLinkV => 'fa-infinity',
        }
    }

    #[inline]
    fn title(self: Achievement) -> felt252 {
        match self {
            Achievement::None => '',
            // Gamer progression
            Achievement::MiniGamer => 'Novice Explorer',
            Achievement::MasterGamer => 'Tactician',
            Achievement::LegendGamer => 'Heroic Gamer',
            Achievement::AllStarGamer => 'Ultimate Champion',
            // ScoreHunter levels
            Achievement::ScoreHunterI => 'Sharpshooter',
            Achievement::ScoreHunterII => 'Precision Seeker',
            Achievement::ScoreHunterIII => 'High Roller',
            Achievement::ScoreHunterIV => 'Legendary Sniper',
            Achievement::ScoreHunterV => 'Master Hunter',
            // Jumper (platform game)
            Achievement::JumperI => 'First Leap',
            Achievement::JumperII => 'Skyward Bound',
            Achievement::JumperIII => 'Tower Climber',
            Achievement::JumperIV => 'Mountain Conqueror',
            Achievement::JumperV => 'Rocket Rider',
            // Tango (flappy beasts game)
            Achievement::TangoI => 'Feathered Friend',
            Achievement::TangoII => 'Wind Dancer',
            Achievement::TangoIII => 'Soaring Adventurer',
            Achievement::TangoIV => 'Cloud Chaser',
            Achievement::TangoV => 'Sky King',
            // Share in X n times
            Achievement::EchoNetworkI => 'Whisper to the Wind',
            Achievement::EchoNetworkII => 'Chronicler',
            Achievement::EchoNetworkIII => 'Echo Weaver',
            Achievement::EchoNetworkIV => 'Signal Tower',
            Achievement::EchoNetworkV => 'The Voice of Beasts',
            // Share in X your score
            Achievement::ArenaRockstarI => 'Spark of Glory',
            Achievement::ArenaRockstarII => 'Echo of Triumph',
            Achievement::ArenaRockstarIII => 'Signal of Greatness',
            Achievement::ArenaRockstarIV => 'Myth in Motion',
            Achievement::ArenaRockstarV => 'Beast Ascendant',
            // Talk to your beast
            Achievement::NeuralLinkI => 'Emotional Ping',
            Achievement::NeuralLinkII => 'Emotional Ping',
            Achievement::NeuralLinkIII => 'Thread of Thought',
            Achievement::NeuralLinkIV => 'Soul Link',
            Achievement::NeuralLinkV => 'Symbiotic Mind',
        }
    }

    #[inline]
    fn description(self: Achievement) -> ByteArray {
        match self {
            Achievement::None => "",
            // Gamer progression
            Achievement::MiniGamer => "Embark on your first gaming adventure! A true novice.",
            Achievement::MasterGamer => "You've honed your skills and mastered the art of gaming.",
            Achievement::LegendGamer => "You are a legendary figure in the gaming world, a true hero.",
            Achievement::AllStarGamer => "The ultimate champion, a master of all things gaming.",
            // ScoreHunter levels
            Achievement::ScoreHunterI => "You've set your sights on the highest scores, aiming for precision.",
            Achievement::ScoreHunterII => "Your aim is true, and you've become a true score hunter.",
            Achievement::ScoreHunterIII => "You are a pro at hunting high scores, an unstoppable force.",
            Achievement::ScoreHunterIV => "Legends are made with your skills, and your name echoes among the greatest.",
            Achievement::ScoreHunterV => "You are the master of scores, no one can match your precision.",
            // Jumper (platform game)
            Achievement::JumperI => "A small step, but a leap toward greatness. The world is at your feet.",
            Achievement::JumperII => "You've taken to the skies, ready to jump higher and further.",
            Achievement::JumperIII => "Scaling new heights, you've become a master of jumps.",
            Achievement::JumperIV => "The mountains don't scare you anymore; you're on top of the world.",
            Achievement::JumperV => "Your leaps defy gravity itself, as you ride rockets into the unknown.",
            // Tango (flappy beasts game)
            Achievement::TangoI => "You have got the moves! Glide through the air with elegance.",
            Achievement::TangoII => "The wind is your friend, helping you soar through the skies.",
            Achievement::TangoIII => "You have embraced the adventure of flight, an unstoppable flapper.",
            Achievement::TangoIV => "Clouds are your playground as you dance across the sky.",
            Achievement::TangoV => "You rule the skies now, flying at lightning speeds like a true king.",
            // Share n times
            Achievement::EchoNetworkI => "Your very first share. A gentle echo into the wild.",
            Achievement::EchoNetworkII => "5 shares in. You're infiltrating timelines.",
            Achievement::EchoNetworkIII => "10 drops. People scroll and they stop at your Beast.",
            Achievement::EchoNetworkIV => "25 shares. The community hears you loud and clear.",
            Achievement::EchoNetworkV => "50 broadcasts. You are the algorithm.",
            // Share your score
            Achievement::ArenaRockstarI => "Shared a score of 500+. You're catching fire.",
            Achievement::ArenaRockstarII => "Shared a score of 1500+. The crowd hears you now.",
            Achievement::ArenaRockstarIII => "Shared a 3000+ score. Competitors pause to watch.",
            Achievement::ArenaRockstarIV => "Shared a 5000+ score. You're the stuff of legends.",
            Achievement::ArenaRockstarV => "Shared a godlike 9999+ score. You broke the sound barrier.",
            // Talk to your beast
            Achievement::NeuralLinkI => "You have spoken to your Beast for the first time. A connection begins.",
            Achievement::NeuralLinkII => "5 chats exchanged. Your Beast starts to feel real.",
            Achievement::NeuralLinkIII => "10 conversations in. There's depth in these exchanges.",
            Achievement::NeuralLinkIV => "20 chats. Your Beast responds like it knows you.",
            Achievement::NeuralLinkV => "50 deep interactions. Two minds, one bond.",
        }
    }

    #[inline]
    fn tasks(self: Achievement) -> Span<Task> {
        match self {
            Achievement::None => [].span(),
            // Gamer progression
            Achievement::MiniGamer => array![TaskTrait::new('MINIGAMER', 1, "Play a minigame once.")].span(),
            Achievement::MasterGamer => array![TaskTrait::new('MASTERGAMER', 15, "Play a minigame 15 times.")].span(),
            Achievement::LegendGamer => array![TaskTrait::new('LEGENDGAMER', 30, "Play a minigame 30 times.")].span(),
            Achievement::AllStarGamer => array![TaskTrait::new('ALLSTARGAMER', 50, "Play a minigame 50 times.")].span(),

            // ScoreHunter levels
            Achievement::ScoreHunterI => array![TaskTrait::new('SCOREHUNTERI', 1, "Get 2000 total points from minigames.")].span(),
            Achievement::ScoreHunterII => array![TaskTrait::new('SCOREHUNTERII', 1, "Get 5000 total points from minigames.")].span(),
            Achievement::ScoreHunterIII => array![TaskTrait::new('SCOREHUNTERIII', 1, "Get 12000 total points from minigames.")].span(),
            Achievement::ScoreHunterIV => array![TaskTrait::new('SCOREHUNTERIV', 1, "Get 20000 total points from minigames.")].span(),
            Achievement::ScoreHunterV => array![TaskTrait::new('SCOREHUNTERV', 1, "Get 50000 total points from minigames.")].span(),

            // Jumper (platform game)
            Achievement::JumperI => array![TaskTrait::new('JUMPERI', 1, "Reach 500 points in a single platform game.")].span(),
            Achievement::JumperII => array![TaskTrait::new('JUMPERII', 1, "Reach 1500 points in a single platform game.")].span(),
            Achievement::JumperIII => array![TaskTrait::new('JUMPERIII', 1, "Reach 2500 points in a single platform game.")].span(),
            Achievement::JumperIV => array![TaskTrait::new('JUMPERIV', 1, "Reach 3500 points in a single platform game.")].span(),
            Achievement::JumperV => array![TaskTrait::new('JUMPERV', 1, "Reach 4500 points in a single platform game.")].span(),

            // Tango (flappy beasts game)
            Achievement::TangoI => array![TaskTrait::new('TANGOI', 1, "Reach 25 points in a single flappy beasts game.")].span(),
            Achievement::TangoII => array![TaskTrait::new('TANGOII', 1, "Reach 50 points in a single flappy beasts game.")].span(),
            Achievement::TangoIII => array![TaskTrait::new('TANGOIII', 1, "Reach 100 points in a single flappy beasts game.")].span(),
            Achievement::TangoIV => array![TaskTrait::new('TANGOIV', 1, "Reach 200 points in a single flappy beasts game.")].span(),
            Achievement::TangoV => array![TaskTrait::new('TANGOV', 1, "Reach 350 points in a single flappy beasts game.")].span(),

            // Echo Network (share X times)
            Achievement::EchoNetworkI => array![TaskTrait::new('ECHONETWORKI', 1, "Share once")].span(),
            Achievement::EchoNetworkII => array![TaskTrait::new('ECHONETWORKII', 5, "Share 5 times")].span(),
            Achievement::EchoNetworkIII => array![TaskTrait::new('ECHONETWORKIII', 10, "Share 10 times")].span(),
            Achievement::EchoNetworkIV => array![TaskTrait::new('ECHONETWORKIV', 25, "Share 25 times")].span(),
            Achievement::EchoNetworkV => array![TaskTrait::new('ECHONETWORKV', 50, "Share 50 times")].span(),

            // Arena Rockstar (share score thresholds)
            Achievement::ArenaRockstarI => array![TaskTrait::new('ARENAROCKSTARI', 1, "Share a score of 500+")].span(),
            Achievement::ArenaRockstarII => array![TaskTrait::new('ARENAROCKSTARII', 1, "Share a score of 1500+")].span(),
            Achievement::ArenaRockstarIII => array![TaskTrait::new('ARENAROCKSTARIII', 1, "Share a score of 3000+")].span(),
            Achievement::ArenaRockstarIV => array![TaskTrait::new('ARENAROCKSTARIV', 1, "Share a score of 5000+")].span(),
            Achievement::ArenaRockstarV => array![TaskTrait::new('ARENAROCKSTARV', 1, "Share a score of 9999+")].span(),

            // Neural Link (AI chat interactions)
            Achievement::NeuralLinkI => array![TaskTrait::new('NEURALLINKI', 1, "Talk to your Beast once")].span(),
            Achievement::NeuralLinkII => array![TaskTrait::new('NEURALLINKII', 5, "Talk to your Beast 5 times")].span(),
            Achievement::NeuralLinkIII => array![TaskTrait::new('NEURALLINKIII', 10, "Talk to your Beast 10 times")].span(),
            Achievement::NeuralLinkIV => array![TaskTrait::new('NEURALLINKIV', 20, "Talk to your Beast 20 times")].span(),
            Achievement::NeuralLinkV => array![TaskTrait::new('NEURALLINKV', 50, "Talk to your Beast 50 times")].span(),
        }
    }

    #[inline]
    fn data(self: Achievement) -> ByteArray {
        ""
    }
}

pub impl IntoAchievementU8 of Into<Achievement, u8> {
    #[inline]
    fn into(self: Achievement) -> u8 {
        match self {
            Achievement::None => 0,
            // Minigames - General Progression
            Achievement::MiniGamer => 1,
            Achievement::MasterGamer => 2,
            Achievement::LegendGamer => 3,
            Achievement::AllStarGamer => 4,
            // Score Hunter
            Achievement::ScoreHunterI => 5,
            Achievement::ScoreHunterII => 6,
            Achievement::ScoreHunterIII => 7,
            Achievement::ScoreHunterIV => 8,
            Achievement::ScoreHunterV => 9,
            // Jumper
            Achievement::JumperI => 10,
            Achievement::JumperII => 11,
            Achievement::JumperIII => 12,
            Achievement::JumperIV => 13,
            Achievement::JumperV => 14,
            // Tango
            Achievement::TangoI => 15,
            Achievement::TangoII => 16,
            Achievement::TangoIII => 17,
            Achievement::TangoIV => 18,
            Achievement::TangoV => 19,
            // Share n times
            Achievement::EchoNetworkI => 20,
            Achievement::EchoNetworkII => 21,
            Achievement::EchoNetworkIII => 22,
            Achievement::EchoNetworkIV => 23,
            Achievement::EchoNetworkV => 24,
            // Share your score
            Achievement::ArenaRockstarI => 25,
            Achievement::ArenaRockstarII => 26,
            Achievement::ArenaRockstarIII => 27,
            Achievement::ArenaRockstarIV => 28,
            Achievement::ArenaRockstarV => 29,
            // Talk to your beast
            Achievement::NeuralLinkI => 30,
            Achievement::NeuralLinkII => 31,
            Achievement::NeuralLinkIII => 32,
            Achievement::NeuralLinkIV => 33,
            Achievement::NeuralLinkV => 34,
        }
    }
}

pub impl IntoU8Achievement of Into<u8, Achievement> {
    #[inline]
    fn into(self: u8) -> Achievement {
        let value: felt252 = self.into();
        match value {
            0 => Achievement::None,
            // Minigames - General Progression
            1 => Achievement::MiniGamer,
            2 => Achievement::MasterGamer,
            3 => Achievement::LegendGamer,
            4 => Achievement::AllStarGamer,
            // Score Hunter
            5 => Achievement::ScoreHunterI,
            6 => Achievement::ScoreHunterII,
            7 => Achievement::ScoreHunterIII,
            8 => Achievement::ScoreHunterIV,
            9 => Achievement::ScoreHunterV,
            // Jumper
            10 => Achievement::JumperI,
            11 => Achievement::JumperII,
            12 => Achievement::JumperIII,
            13 => Achievement::JumperIV,
            14 => Achievement::JumperV,
            // Tango
            15 => Achievement::TangoI,
            16 => Achievement::TangoII,
            17 => Achievement::TangoIII,
            18 => Achievement::TangoIV,
            19 => Achievement::TangoV,
            // Share n times
            20 => Achievement::EchoNetworkI,
            21 => Achievement::EchoNetworkII,
            22 => Achievement::EchoNetworkIII,
            23 => Achievement::EchoNetworkIV,
            24 => Achievement::EchoNetworkV,
            // Share your score
            25 => Achievement::ArenaRockstarI,
            26 => Achievement::ArenaRockstarII,
            27 => Achievement::ArenaRockstarIII,
            28 => Achievement::ArenaRockstarIV,
            29 => Achievement::ArenaRockstarV,
            // Talk to your beast
            30 => Achievement::NeuralLinkI,
            31 => Achievement::NeuralLinkII,
            32 => Achievement::NeuralLinkIII,
            33 => Achievement::NeuralLinkIV,
            34 => Achievement::NeuralLinkV,
            // Default case
            _ => Achievement::None,
        }
    }
}
