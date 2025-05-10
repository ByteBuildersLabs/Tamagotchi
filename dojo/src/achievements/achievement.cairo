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
            Achievement::None => 0,
            Achievement::MiniGamer => 'MiniGamer', // Play a minigame once
            Achievement::MasterGamer => 'MasterGamer', // Play a minigame 15 times
            Achievement::LegendGamer => 'LegendGamer', // Play a minigame 30 times
            Achievement::AllStarGamer => 'AllStarGamer', // Play a minigame 50 times 

            Achievement::ScoreHunterI => 'ScoreHunterI', // Get 2000 total points from minigames
            Achievement::ScoreHunterII => 'ScoreHunterII', // Get 5000 total points from minigames
            Achievement::ScoreHunterIII => 'ScoreHunterIII', // Get 12000 total points from minigames
            Achievement::ScoreHunterIV => 'ScoreHunterIV', // Get 20000 total points from minigames
            Achievement::ScoreHunterV => 'ScoreHunterV', // Get 50000 total points from minigames

            Achievement::JumperI => 'JumperI', // Reach 500 points in a single platform game
            Achievement::JumperII => 'JumperII', // Reach 1500 points in a single platform game
            Achievement::JumperIII => 'JumperIII', // Reach 2500 points in a single platform game
            Achievement::JumperIV => 'JumperIV', // Reach 3500 points in a single platform game
            Achievement::JumperV => 'JumperV', // Reach 4500 points in a single platform game

            Achievement::TangoI => 'TangoI', // Reach 25 points in a single flappy beasts game
            Achievement::TangoII => 'TangoII', // Reach 50 points in a single flappy beasts game
            Achievement::TangoIII => 'TangoIII', // Reach 100 points in a single flappy beasts game
            Achievement::TangoIV => 'TangoIV', // Reach 200 points in a single flappy beasts game
            Achievement::TangoV => 'TangoV', // Reach 350 points in a single flappy beasts game
            
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
            Achievement::NeuralLinkV => 'NeuralLinkV', // Talked to your Beast 50 times
        
            Achievement::ByteBitesI => 'ByteBitesI', // Feed your beast once
            Achievement::ByteBitesII => 'ByteBitesII', // Feed your beast 20 times
            Achievement::ByteBitesIII => 'ByteBitesIII', // Feed your beast 50 times
            Achievement::ByteBitesIV => 'ByteBitesIV', // Feed your beast 150 times
            Achievement::ByteBitesV => 'ByteBitesV', // Feed your beast 250 times

            Achievement::BeastFriendI => 'BeastFriendI', // Pet your beast once
            Achievement::BeastFriendII => 'BeastFriendII', // Pet your beast 20 times
            Achievement::BeastFriendIII => 'BeastFriendIII', // Pet your beast 35 times
            Achievement::BeastFriendIV => 'BeastFriendIV', // Pet your beast 55 times
            Achievement::BeastFriendV => 'BeastFriendV', // Pet your beast 100 times

            Achievement::NapMasterI => 'NapMasterI', // Put your beast to sleep once
            Achievement::NapMasterII => 'NapMasterII', // Put your beast to sleep 10 times
            Achievement::NapMasterIII => 'NapMasterIII', // Put your beast to sleep 25 times
            Achievement::NapMasterIV => 'NapMasterIV', // Put your beast to sleep 55 times
            Achievement::NapMasterV => 'NapMasterV', // Put your beast to sleep 100 times

            Achievement::CleanStreakI => 'CleanStreakI', // Clean your beast once
            Achievement::CleanStreakII => 'CleanStreakII', // Clean your beast 25 times
            Achievement::CleanStreakIII => 'CleanStreakIII', // Clean your beast 55 times
            Achievement::CleanStreakIV => 'CleanStreakIV', // Clean your beast 100 times
            Achievement::CleanStreakV => 'CleanStreakV', // Clean your beast 200 times
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
            Achievement::ByteBitesI => false,
            Achievement::ByteBitesII => false,
            Achievement::ByteBitesIII => false,
            Achievement::ByteBitesIV => false,
            Achievement::ByteBitesV => false,
            Achievement::BeastFriendI => false,
            Achievement::BeastFriendII => false,
            Achievement::BeastFriendIII => false,
            Achievement::BeastFriendIV => false,
            Achievement::BeastFriendV => false,
            Achievement::NapMasterI => false,
            Achievement::NapMasterII => false,
            Achievement::NapMasterIII => false,
            Achievement::NapMasterIV => false,
            Achievement::NapMasterV => false,
            Achievement::CleanStreakI => false,
            Achievement::CleanStreakII => false,
            Achievement::CleanStreakIII => false,
            Achievement::CleanStreakIV => false,
            Achievement::CleanStreakV => false,
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
            Achievement::ByteBitesI => 0,
            Achievement::ByteBitesII => 1,
            Achievement::ByteBitesIII => 2,
            Achievement::ByteBitesIV => 3,
            Achievement::ByteBitesV => 4,
            Achievement::BeastFriendI => 0,
            Achievement::BeastFriendII => 1,
            Achievement::BeastFriendIII => 2,
            Achievement::BeastFriendIV => 3,
            Achievement::BeastFriendV => 4,
            Achievement::NapMasterI => 0,
            Achievement::NapMasterII => 1,
            Achievement::NapMasterIII => 2,
            Achievement::NapMasterIV => 3,
            Achievement::NapMasterV => 4,
            Achievement::CleanStreakI => 0,
            Achievement::CleanStreakII => 1,
            Achievement::CleanStreakIII => 2,
            Achievement::CleanStreakIV => 3,
            Achievement::CleanStreakV => 4,
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
            Achievement::ByteBitesI => 10,
            Achievement::ByteBitesII => 20,
            Achievement::ByteBitesIII => 30,
            Achievement::ByteBitesIV => 40,
            Achievement::ByteBitesV => 50,
            Achievement::BeastFriendI => 10,
            Achievement::BeastFriendII => 20,
            Achievement::BeastFriendIII => 30,
            Achievement::BeastFriendIV => 40,
            Achievement::BeastFriendV => 50,
            Achievement::NapMasterI => 10,
            Achievement::NapMasterII => 20,
            Achievement::NapMasterIII => 30,
            Achievement::NapMasterIV => 40,
            Achievement::NapMasterV => 50,
            Achievement::CleanStreakI => 10,
            Achievement::CleanStreakII => 20,
            Achievement::CleanStreakIII => 30,
            Achievement::CleanStreakIV => 40,
            Achievement::CleanStreakV => 50,
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
            Achievement::ByteBitesI => 0,
            Achievement::ByteBitesII => 0,
            Achievement::ByteBitesIII => 0,
            Achievement::ByteBitesIV => 0,
            Achievement::ByteBitesV => 0,
            Achievement::BeastFriendI => 0,
            Achievement::BeastFriendII => 0,
            Achievement::BeastFriendIII => 0,
            Achievement::BeastFriendIV => 0,
            Achievement::BeastFriendV => 0,
            Achievement::NapMasterI => 0,
            Achievement::NapMasterII => 0,
            Achievement::NapMasterIII => 0,
            Achievement::NapMasterIV => 0,
            Achievement::NapMasterV => 0,
            Achievement::CleanStreakI => 0,
            Achievement::CleanStreakII => 0,
            Achievement::CleanStreakIII => 0,
            Achievement::CleanStreakIV => 0,
            Achievement::CleanStreakV => 0,
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
            Achievement::ByteBitesI => 0,
            Achievement::ByteBitesII => 0,
            Achievement::ByteBitesIII => 0,
            Achievement::ByteBitesIV => 0,
            Achievement::ByteBitesV => 0,
            Achievement::BeastFriendI => 0,
            Achievement::BeastFriendII => 0,
            Achievement::BeastFriendIII => 0,
            Achievement::BeastFriendIV => 0,
            Achievement::BeastFriendV => 0,
            Achievement::NapMasterI => 0,
            Achievement::NapMasterII => 0,
            Achievement::NapMasterIII => 0,
            Achievement::NapMasterIV => 0,
            Achievement::NapMasterV => 0,
            Achievement::CleanStreakI => 0,
            Achievement::CleanStreakII => 0,
            Achievement::CleanStreakIII => 0,
            Achievement::CleanStreakIV => 0,
            Achievement::CleanStreakV => 0,
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
            Achievement::ScoreHunterI => 'Score Hunter',
            Achievement::ScoreHunterII => 'Score Hunter',
            Achievement::ScoreHunterIII => 'Score Hunter',
            Achievement::ScoreHunterIV => 'Score Hunter',
            Achievement::ScoreHunterV => 'Score Hunter',
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
            Achievement::EchoNetworkI => 'Echo Network',
            Achievement::EchoNetworkII => 'Echo Network',
            Achievement::EchoNetworkIII => 'Echo Network',
            Achievement::EchoNetworkIV => 'Echo Network',
            Achievement::EchoNetworkV => 'Echo Network',
            Achievement::ArenaRockstarI => 'Arena Rockstar',
            Achievement::ArenaRockstarII => 'Arena Rockstar',
            Achievement::ArenaRockstarIII => 'Arena Rockstar',
            Achievement::ArenaRockstarIV => 'Arena Rockstar',
            Achievement::ArenaRockstarV => 'Arena Rockstar',
            Achievement::NeuralLinkI => 'Neural Link',
            Achievement::NeuralLinkII => 'Neural Link',
            Achievement::NeuralLinkIII => 'Neural Link',
            Achievement::NeuralLinkIV => 'Neural Link',
            Achievement::NeuralLinkV => 'Neural Link',
            Achievement::ByteBitesI => 'Byte Bites',
            Achievement::ByteBitesII => 'Byte Bites',
            Achievement::ByteBitesIII => 'Byte Bites',
            Achievement::ByteBitesIV => 'Byte Bites',
            Achievement::ByteBitesV => 'Byte Bites',
            Achievement::BeastFriendI => 'Beast Friend',
            Achievement::BeastFriendII => 'Beast Friend',
            Achievement::BeastFriendIII => 'Beast Friend',
            Achievement::BeastFriendIV => 'Beast Friend',
            Achievement::BeastFriendV => 'Beast Friend', 
            Achievement::NapMasterI => 'Nap Master',
            Achievement::NapMasterII => 'Nap Master',
            Achievement::NapMasterIII => 'Nap Master',
            Achievement::NapMasterIV => 'Nap Master',
            Achievement::NapMasterV => 'Nap Master',
            Achievement::CleanStreakI => 'Clean Streak',
            Achievement::CleanStreakII => 'Clean Streak',
            Achievement::CleanStreakIII => 'Clean Streak',
            Achievement::CleanStreakIV => 'Clean Streak',
            Achievement::CleanStreakV => 'Clean Streak',
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
            // Feed your beast
            Achievement::ByteBitesI => 'fa-utensils',
            Achievement::ByteBitesII => 'fa-apple-alt',
            Achievement::ByteBitesIII => 'fa-drumstick-bite',
            Achievement::ByteBitesIV => 'fa-fish',
            Achievement::ByteBitesV => 'fa-hamburger',
            // Pet your beast
            Achievement::BeastFriendI => 'fa-hand-paper',
            Achievement::BeastFriendII => 'fa-handshake',
            Achievement::BeastFriendIII => 'fa-paw',
            Achievement::BeastFriendIV => 'fa-heart-circle-check',
            Achievement::BeastFriendV => 'fa-hands',
            // Put your beast to sleep
            Achievement::NapMasterI => 'fa-bed',
            Achievement::NapMasterII => 'fa-moon',
            Achievement::NapMasterIII => 'fa-cloud-moon',
            Achievement::NapMasterIV => 'fa-face-smile',
            Achievement::NapMasterV => 'fa-star-and-crescent',
            // Clean your beast
            Achievement::CleanStreakI => 'fa-soap',
            Achievement::CleanStreakII => 'fa-bath',
            Achievement::CleanStreakIII => 'fa-spray-can-sparkles',
            Achievement::CleanStreakIV => 'fa-shower',
            Achievement::CleanStreakV => 'fa-water',
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
            // Feed your beast
            Achievement::ByteBitesI => 'First Feast',
            Achievement::ByteBitesII => 'Hungry Companion',
            Achievement::ByteBitesIII => 'Devouring Duo',
            Achievement::ByteBitesIV => 'Gourmet Guardian',
            Achievement::ByteBitesV => 'Eternal Banquet',
            // Pet your beast
            Achievement::BeastFriendI => 'Gentle Touch',
            Achievement::BeastFriendII => 'Caring Hand',
            Achievement::BeastFriendIII => 'Trusted Companion',
            Achievement::BeastFriendIV => 'Kindred Spirits',
            Achievement::BeastFriendV => 'Bond Eternal',
            // Put your beast to sleep
            Achievement::NapMasterI => 'First Nap',
            Achievement::NapMasterII => 'Dream Sender',
            Achievement::NapMasterIII => 'Restful Guardian',
            Achievement::NapMasterIV => 'Slumber Sage',
            Achievement::NapMasterV => 'Keeper of Dreams',
            // Clean your beast
            Achievement::CleanStreakI => 'Bubble Beginner',
            Achievement::CleanStreakII => 'Tidy Beastmaster',
            Achievement::CleanStreakIII => 'Hygiene Hero',
            Achievement::CleanStreakIV => 'Sparkle Specialist',
            Achievement::CleanStreakV => 'Sanitation Saint',
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
            // Feed your beast
            Achievement::ByteBitesI => "You fed your Beast for the first time. It looks at you with grateful eyes.",
            Achievement::ByteBitesII => "Your Beast starts to rely on your care. Snacks well-received.",
            Achievement::ByteBitesIII => "Feeding time is a ritual now. Your bond strengthens.",
            Achievement::ByteBitesIV => "Only the finest treats for your cherished companion.",
            Achievement::ByteBitesV => "Your Beast thrives in luxury. You feed like royalty.",
            // Pet your beast
            Achievement::BeastFriendI => "The first pet. Your Beast purrs with joy.",
            Achievement::BeastFriendII => "You have shown kindness. The bond grows.",
            Achievement::BeastFriendIII => "Your Beast follows you without hesitation.",
            Achievement::BeastFriendIV => "Petting becomes communication deep and mutual.",
            Achievement::BeastFriendV => "No longer just friends. You are soulbound.",
            // Put your beast to sleep
            Achievement::NapMasterI => "Your Beast takes a cozy rest under your watch.",
            Achievement::NapMasterII => "You haveve mastered the bedtime ritual.",
            Achievement::NapMasterIII => "Peace surrounds you as your Beast naps soundly.",
            Achievement::NapMasterIV => "You guide dreams like a shepherd.",
            Achievement::NapMasterV => "You are the guardian of sleep, the architect of rest.",
            // Clean your beast
            Achievement::CleanStreakI => "First clean! Your Beast shines with joy.",
            Achievement::CleanStreakII => "A routine emerges your Beast looks immaculate.",
            Achievement::CleanStreakIII => "Dirt fears your presence.",
            Achievement::CleanStreakIV => "Every scrub deepens your friendship.",
            Achievement::CleanStreakV => "Spotless. Radiant. You are the cleansing force.",
        }
    }

    #[inline]
    fn tasks(self: Achievement) -> Span<Task> {
        // array![ TaskTrait::new(task_id, task_target, "Description");].span();
        match self {
            Achievement::None => [].span(),
            // Gamer progression
            Achievement::MiniGamer => array![TaskTrait::new('MiniGamer', 1, "Play a minigame once.")].span(),
            Achievement::MasterGamer => array![TaskTrait::new('MasterGamer', 15, "Play a minigame 15 times.")].span(),
            Achievement::LegendGamer => array![TaskTrait::new('LegendGamer', 30, "Play a minigame 30 times.")].span(),
            Achievement::AllStarGamer => array![TaskTrait::new('AllStarGamer', 50, "Play a minigame 50 times.")].span(),

            // ScoreHunter levels
            Achievement::ScoreHunterI => array![TaskTrait::new('ScoreHunterI', 1, "Get 2000 total points from minigames.")].span(),
            Achievement::ScoreHunterII => array![TaskTrait::new('ScoreHunterII', 1, "Get 5000 total points from minigames.")].span(),
            Achievement::ScoreHunterIII => array![TaskTrait::new('ScoreHunterIII', 1, "Get 12000 total points from minigames.")].span(),
            Achievement::ScoreHunterIV => array![TaskTrait::new('ScoreHunterIV', 1, "Get 20000 total points from minigames.")].span(),
            Achievement::ScoreHunterV => array![TaskTrait::new('ScoreHunterV', 1, "Get 50000 total points from minigames.")].span(),

            // Jumper (platform game)
            Achievement::JumperI => array![TaskTrait::new('JumperI', 1, "Reach 500 points in a single platform game.")].span(),
            Achievement::JumperII => array![TaskTrait::new('JumperII', 1, "Reach 1500 points in a single platform game.")].span(),
            Achievement::JumperIII => array![TaskTrait::new('JumperIII', 1, "Reach 2500 points in a single platform game.")].span(),
            Achievement::JumperIV => array![TaskTrait::new('JumperIV', 1, "Reach 3500 points in a single platform game.")].span(),
            Achievement::JumperV => array![TaskTrait::new('JumperV', 1, "Reach 4500 points in a single platform game.")].span(),

            // Tango (flappy beasts game)
            Achievement::TangoI => array![TaskTrait::new('TangoI', 1, "Reach 25 points in a single flappy beasts game.")].span(),
            Achievement::TangoII => array![TaskTrait::new('TangoII', 1, "Reach 50 points in a single flappy beasts game.")].span(),
            Achievement::TangoIII => array![TaskTrait::new('TangoIII', 1, "Reach 100 points in a single flappy beasts game.")].span(),
            Achievement::TangoIV => array![TaskTrait::new('TangoIV', 1, "Reach 200 points in a single flappy beasts game.")].span(),
            Achievement::TangoV => array![TaskTrait::new('TangoV', 1, "Reach 350 points in a single flappy beasts game.")].span(),

            // Echo Network (share X times)
            Achievement::EchoNetworkI => array![TaskTrait::new('EchoNetworkI', 1, "Share once")].span(),
            Achievement::EchoNetworkII => array![TaskTrait::new('EchoNetworkII', 5, "Share 5 times")].span(),
            Achievement::EchoNetworkIII => array![TaskTrait::new('EchoNetworkIII', 10, "Share 10 times")].span(),
            Achievement::EchoNetworkIV => array![TaskTrait::new('EchoNetworkIV', 25, "Share 25 times")].span(),
            Achievement::EchoNetworkV => array![TaskTrait::new('EchoNetworkV', 50, "Share 50 times")].span(),

            // Arena Rockstar (share score thresholds)
            Achievement::ArenaRockstarI => array![TaskTrait::new('ArenaRockstarI', 1, "Share a score of 500+")].span(),
            Achievement::ArenaRockstarII => array![TaskTrait::new('ArenaRockstarII', 1, "Share a score of 1500+")].span(),
            Achievement::ArenaRockstarIII => array![TaskTrait::new('ArenaRockstarIII', 1, "Share a score of 3000+")].span(),
            Achievement::ArenaRockstarIV => array![TaskTrait::new('ArenaRockstarIV', 1, "Share a score of 5000+")].span(),
            Achievement::ArenaRockstarV => array![TaskTrait::new('ArenaRockstarV', 1, "Share a score of 9999+")].span(),

            // Neural Link (AI chat interactions)
            Achievement::NeuralLinkI => array![TaskTrait::new('NeuralLinkI', 1, "Talk to your Beast once")].span(),
            Achievement::NeuralLinkII => array![TaskTrait::new('NeuralLinkII', 5, "Talk to your Beast 5 times")].span(),
            Achievement::NeuralLinkIII => array![TaskTrait::new('NeuralLinkIII', 10, "Talk to your Beast 10 times")].span(),
            Achievement::NeuralLinkIV => array![TaskTrait::new('NeuralLinkIV', 20, "Talk to your Beast 20 times")].span(),
            Achievement::NeuralLinkV => array![TaskTrait::new('NeuralLinkV', 50, "Talk to your Beast 50 times")].span(),

            // ByteBites (feeding)
            Achievement::ByteBitesI => array![TaskTrait::new('ByteBitesI', 1, "Feed your Beast once")].span(),
            Achievement::ByteBitesII => array![TaskTrait::new('ByteBitesII', 20, "Feed your Beast 20 times")].span(),
            Achievement::ByteBitesIII => array![TaskTrait::new('ByteBitesIII', 50, "Feed your Beast 50 times")].span(),
            Achievement::ByteBitesIV => array![TaskTrait::new('ByteBitesIV', 150, "Feed your Beast 150 times")].span(),
            Achievement::ByteBitesV => array![TaskTrait::new('ByteBitesV', 250, "Feed your Beast 250 times")].span(),

            // BeastFriend (petting)
            Achievement::BeastFriendI => array![TaskTrait::new('BeastFriendI', 1, "Pet your Beast once")].span(),
            Achievement::BeastFriendII => array![TaskTrait::new('BeastFriendII', 20, "Pet your Beast 20 times")].span(),
            Achievement::BeastFriendIII => array![TaskTrait::new('BeastFriendIII', 35, "Pet your Beast 35 times")].span(),
            Achievement::BeastFriendIV => array![TaskTrait::new('BeastFriendIV', 55, "Pet your Beast 55 times")].span(),
            Achievement::BeastFriendV => array![TaskTrait::new('BeastFriendV', 100, "Pet your Beast 100 times")].span(),

            // NapMaster (sleeping)
            Achievement::NapMasterI => array![TaskTrait::new('NapMasterI', 1, "Put your Beast to sleep once")].span(),
            Achievement::NapMasterII => array![TaskTrait::new('NapMasterII', 10, "Put your Beast to sleep 10 times")].span(),
            Achievement::NapMasterIII => array![TaskTrait::new('NapMasterIII', 25, "Put your Beast to sleep 25 times")].span(),
            Achievement::NapMasterIV => array![TaskTrait::new('NapMasterIV', 55, "Put your Beast to sleep 55 times")].span(),
            Achievement::NapMasterV => array![TaskTrait::new('NapMasterV', 100, "Put your Beast to sleep 100 times")].span(),

            // CleanStreak (cleaning)
            Achievement::CleanStreakI => array![TaskTrait::new('CleanStreakI', 1, "Clean your Beast once")].span(),
            Achievement::CleanStreakII => array![TaskTrait::new('CleanStreakII', 25, "Clean your Beast 25 times")].span(),
            Achievement::CleanStreakIII => array![TaskTrait::new('CleanStreakIII', 55, "Clean your Beast 55 times")].span(),
            Achievement::CleanStreakIV => array![TaskTrait::new('CleanStreakIV', 100, "Clean your Beast 100 times")].span(),
            Achievement::CleanStreakV => array![TaskTrait::new('CleanStreakV', 200, "Clean your Beast 200 times")].span(),
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
            // Feed your beast
            Achievement::ByteBitesI => 35,
            Achievement::ByteBitesII => 36,
            Achievement::ByteBitesIII => 37,
            Achievement::ByteBitesIV => 38,
            Achievement::ByteBitesV => 39,
            // Pet your beast
            Achievement::BeastFriendI => 40,
            Achievement::BeastFriendII => 41,
            Achievement::BeastFriendIII => 42,
            Achievement::BeastFriendIV => 43,
            Achievement::BeastFriendV => 44,
            // Put your beast to sleep
            Achievement::NapMasterI => 45,
            Achievement::NapMasterII => 46,
            Achievement::NapMasterIII => 47,
            Achievement::NapMasterIV => 48,
            Achievement::NapMasterV => 49,
            // Clean your beast
            Achievement::CleanStreakI => 50,
            Achievement::CleanStreakII => 51,
            Achievement::CleanStreakIII => 52,
            Achievement::CleanStreakIV => 53,
            Achievement::CleanStreakV => 54,
        }
    }
}

pub impl IntoU8Achievement of Into<u8, Achievement> {
    #[inline]
    fn into(self: u8) -> Achievement {
        match self {
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
            // Feed your beast
            35 => Achievement::ByteBitesI,
            36 => Achievement::ByteBitesII,
            37 => Achievement::ByteBitesIII,
            38 => Achievement::ByteBitesIV,
            39 => Achievement::ByteBitesV,
            // Pet your beast
            40 => Achievement::BeastFriendI,
            41 => Achievement::BeastFriendII,
            42 => Achievement::BeastFriendIII,
            43 => Achievement::BeastFriendIV,
            44 => Achievement::BeastFriendV,
            // Put your beast to sleep
            45 => Achievement::NapMasterI,
            46 => Achievement::NapMasterII,
            47 => Achievement::NapMasterIII,
            48 => Achievement::NapMasterIV,
            49 => Achievement::NapMasterV,
            // Clean your beast
            50 => Achievement::CleanStreakI,
            51 => Achievement::CleanStreakII,
            52 => Achievement::CleanStreakIII,
            53 => Achievement::CleanStreakIV,
            54 => Achievement::CleanStreakV,
            // Default case
            _ => Achievement::None,
        }
    }
}
