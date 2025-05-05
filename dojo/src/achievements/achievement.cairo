// Dojo achievements import
use achievement::types::task::{Task, TaskTrait}; 

// Into trait import
use core::traits::Into;

// Achievement enum
#[derive(Copy, Drop)]
enum Achievement {
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
impl AchievementImpl of AchievementTrait {
    #[inline]
    fn identifier(self: Achievement) -> felt252 {
        match self {
            Achievement::None => 0,
            Achievement::MiniGamer => 'MiniGamer',
            Achievement::MasterGamer => 'MasterGamer',
            Achievement::LegendGamer => 'LegendGamer',
            Achievement::AllStarGamer => 'AllStarGamer',
            Achievement::ScoreHunterI => 'ScoreHunterI',
            Achievement::ScoreHunterII => 'ScoreHunterII',
            Achievement::ScoreHunterIII => 'ScoreHunterIII',
            Achievement::ScoreHunterIV => 'ScoreHunterIV',
            Achievement::ScoreHunterV => 'ScoreHunterV',
            Achievement::JumperI => 'JumperI',
            Achievement::JumperII => 'JumperII',
            Achievement::JumperIII => 'JumperIII',
            Achievement::JumperIV => 'JumperIV',
            Achievement::JumperV => 'JumperV',
            Achievement::TangoI => 'TangoI',
            Achievement::TangoII => 'TangoII',
            Achievement::TangoIII => 'TangoIII',
            Achievement::TangoIV => 'TangoIV',
            Achievement::TangoV => 'TangoV',
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
            Achievement::MasterGamer => 0,
            Achievement::LegendGamer => 0,
            Achievement::AllStarGamer => 0,
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
            Achievement::LegendGamer => "You are a legendary figure in the ByteBeasts world, a true hero.",
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
        // span structure: array![TaskTrait::new(task_id, count, description)].span(),
        match self {
            Achievement::None => [].span(),
            // Gamer progression
            Achievement::MiniGamer => array![TaskTrait::new('MINIGAMER', 1, "Embark on your first gaming adventure! A true novice.")].span(),
            Achievement::MasterGamer => array![TaskTrait::new('MASTERGAMER', 1, "You've honed your skills and mastered the art of gaming.")].span(),
            Achievement::LegendGamer => array![TaskTrait::new('LEGENDGAMER', 1, "You are a legendary figure in the gaming world, a true hero.")].span(),
            Achievement::AllStarGamer => array![TaskTrait::new('ALLSTARGAMER', 1, "The ultimate champion, a master of all things gaming.")].span(),
            // ScoreHunter levels
            Achievement::ScoreHunterI => array![TaskTrait::new('SCOREHUNTERI', 1, "You've set your sights on the highest scores, aiming for precision.")].span(),
            Achievement::ScoreHunterII => array![TaskTrait::new('SCOREHUNTERII', 1, "Your aim is true, and you've become a true score hunter.")].span(),
            Achievement::ScoreHunterIII => array![TaskTrait::new('SCOREHUNTERIII', 1, "You are a pro at hunting high scores, an unstoppable force.")].span(),
            Achievement::ScoreHunterIV => array![TaskTrait::new('SCOREHUNTERIV', 1, "Legends are made with your skills, and your name echoes among the greatest.")].span(),
            Achievement::ScoreHunterV => array![TaskTrait::new('SCOREHUNTERV', 1, "You are the master of scores, no one can match your precision.")].span(),   
            // Jumper (platform game)
            Achievement::JumperI => array![TaskTrait::new('JUMPERI', 1, "A small step, but a leap toward greatness. The world is at your feet.")].span(),
            Achievement::JumperII => array![TaskTrait::new('JUMPERII', 1, "You've taken to the skies, ready to jump higher and further.")].span(),
            Achievement::JumperIII => array![TaskTrait::new('JUMPERIII', 1, "Scaling new heights, you've become a master of jumps.")].span(),
            Achievement::JumperIV => array![TaskTrait::new('JUMPERIV', 1, "The mountains don't scare you anymore; you're on top of the world.")].span(),
            Achievement::JumperV => array![TaskTrait::new('JUMPERV', 1, "Your leaps defy gravity itself, as you ride rockets into the unknown.")].span(),
            // Tango (flappy beasts game)
            Achievement::TangoI => array![TaskTrait::new('TANGOI', 1, "You have got the moves! Glide through the air with elegance.")].span(),
            Achievement::TangoII => array![TaskTrait::new('TANGOII', 1, "The wind is your friend, helping you soar through the skies.")].span(),
            Achievement::TangoIII => array![TaskTrait::new('TANGOIII', 1, "You have embraced the adventure of flight, an unstoppable flapper.")].span(),
            Achievement::TangoIV => array![TaskTrait::new('TANGOIV', 1, "Clouds are your playground as you dance across the sky.")].span(),
            Achievement::TangoV => array![TaskTrait::new('TANGOV', 1, "You rule the skies now, flying at lightning speeds like a true king.")].span(),
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
