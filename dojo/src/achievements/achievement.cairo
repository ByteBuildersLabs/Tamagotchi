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
            _ => Achievement::None,
        }
    }
}
