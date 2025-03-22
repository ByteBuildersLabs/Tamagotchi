// Types imports
use tamagotchi::types::clean_status::CleanStatus;

// Constants import
use tamagotchi::constants;

// Helpers import
use tamagotchi::helpers::pseudo_random::PseudoRandom;

// Model
#[derive(Drop, Serde, IntrospectPacked, Debug)]
#[dojo::model]
pub struct BeastStatus {
    #[key]
    pub beast_id: u16,
    pub is_alive: bool,
    pub is_awake: bool,
    pub hunger: u8,
    pub energy: u8,
    pub happiness: u8,
    pub hygiene: u8,
    pub clean_status: u8,
    pub last_timestamp: u64,
}

// Traits implementations
#[generate_trait]
pub impl BeastStatusImpl of BeastStatusTrait {
    fn new_beast_status_random_values(beast_id: u16, current_timestamp: u64) -> BeastStatus {
        BeastStatus {
            beast_id: beast_id,
            is_alive: true,
            is_awake: true,
            hunger: PseudoRandom::generate_random_u8(beast_id, 1, constants::MIN_INITIAL_STATUS, constants::MAX_INITIAL_STATUS),
            energy: PseudoRandom::generate_random_u8(beast_id, 2, constants::MIN_INITIAL_STATUS, constants::MAX_INITIAL_STATUS),
            happiness: PseudoRandom::generate_random_u8(beast_id, 3, constants::MIN_INITIAL_STATUS, constants::MAX_INITIAL_STATUS),
            hygiene: PseudoRandom::generate_random_u8(beast_id, 4, constants::MIN_INITIAL_STATUS, constants::MAX_INITIAL_STATUS),
            clean_status: CleanStatus::Clean.into(),
            last_timestamp: current_timestamp,
        }
    }

    fn calculate_recover_time(ref self: BeastStatus, current_timestamp: u64) -> u64 {
        return ((constants::MAX_POINTS.try_into().unwrap() - self.energy) * constants::POINTS_PER_SECOND).try_into().unwrap();
    }

    fn update_clean_status(ref self: BeastStatus, hygiene: u8){
            if hygiene>=90{
                self.clean_status = CleanStatus::Clean.into();
            }
            if hygiene>=70 && hygiene<90 {
                self.clean_status = CleanStatus::SlightlyDirty.into();
            }
            if hygiene>=50 && hygiene<70 {
                self.clean_status = CleanStatus::Dirty.into();
            }
            if hygiene>=30 && hygiene<50 {
                self.clean_status = CleanStatus::VeryDirty.into();
            }
            if hygiene>=10 && hygiene<30 {
                self.clean_status = CleanStatus::SuperDirty.into();
            }
            if hygiene<10 {
                self.clean_status = CleanStatus::Filthy.into();
            }
    }

    fn calculate_timestamp_based_status_awake(ref self: BeastStatus, current_timestamp: u64){
        let total_seconds: u64 =  current_timestamp - self.last_timestamp;
        let total_points: u64 = total_seconds / constants::SECONDS_IN_3_MINUTES;

        if total_points < constants::MAX_POINTS {
            let points_to_decrease: u8 = total_points.try_into().unwrap();

            let multiplied_hunger_to_decrease = (points_to_decrease * 3) / 2;
            let multiplied_energy_to_decrease = (points_to_decrease * 3) / 2; 

            if self.is_alive {
                // Decrease energy based on conditions
                if self.happiness == 0 || self.hygiene == 0 {
                    self.energy = if self.energy >= multiplied_energy_to_decrease {
                        self.energy - multiplied_energy_to_decrease
                    } else {
                        0
                    };
                } else {
                    self.energy = if self.energy >= points_to_decrease {
                        self.energy - points_to_decrease
                    } else {
                        0
                    };
                }

                // Decrease hunger safely
                self.hunger = if self.hunger >= multiplied_hunger_to_decrease {
                    self.hunger - multiplied_hunger_to_decrease
                } else {
                    0
                };

                // Decrease happiness safely 
                self.happiness = if self.happiness >= points_to_decrease {
                    self.happiness - points_to_decrease
                } else {
                    0
                };

                // Decrease hygiene safely
                self.hygiene = if self.hygiene >= points_to_decrease {
                    self.hygiene - points_to_decrease
                } else {
                    0
                };
                
                self.update_clean_status(self.hygiene);

                // Check if beast dies
                if self.energy == 0 || self.hunger == 0 {
                    self.is_alive = false;
                }
            }
        }
        else{
            self.hygiene = 0;
            self.happiness = 0;
            self.energy = 0;
            self.hunger = 0;
            self.is_alive = false;
        }
    }

    fn calculate_timestamp_based_status_asleep(ref self: BeastStatus, current_timestamp: u64){
        let total_seconds: u64 =  current_timestamp - self.last_timestamp; // Total seconds from the last timestamp to the current timestamp
        let total_energy_points: u64 = total_seconds / constants::POINTS_PER_SECOND.try_into().unwrap();

        if total_energy_points > 0 {
            if total_energy_points < constants::MAX_POINTS {
                let points_to_increase: u8 = total_energy_points.try_into().unwrap(); // Total points of energy and happiness to increase
                let points_to_decrease: u8 = points_to_increase / 2; // Total points to decrease for the other status of the beast

                if self.is_alive {
                    if (self.energy + points_to_decrease) < constants::MAX_POINTS.try_into().unwrap() {
                        // ----------- Increase energy and happiness ------------
                        self.energy = self.energy + points_to_increase;
                        self.happiness = self.happiness + points_to_increase;
                        
                        // ----------- Decrease hunger and hygiene ------------
                        self.hunger = if self.hunger >= points_to_decrease {
                            self.hunger - points_to_decrease
                        } else {
                            0
                        };
        
                        self.hygiene = if self.hygiene >= points_to_decrease {
                            self.hygiene - points_to_decrease
                        } else {
                            0
                        };
                        self.update_clean_status(self.hygiene);
        
                        // Check if beast dies
                        if self.hunger == 0 {
                            self.is_alive = false;
                        }
                    }
                    else {
                        self.happiness = 80;
                        self.energy = 100;
                        self.is_awake = true;
                    }
                }
            }
            else{
                self.happiness = 80;
                self.energy = 100;
                self.is_awake = true;
            }
        }
    }
}

// Tests
#[cfg(test)]
mod tests {
    use super::BeastStatus;
    use tamagotchi::types::clean_status::{CleanStatus};

    #[test]
    #[available_gas(300000)]
    fn test_beast_status_initialization() {
        let beast_status = BeastStatus {
            beast_id: 1,
            is_alive: true,
            is_awake: true,
            hunger: 100,
            energy: 100,
            happiness: 100,
            hygiene: 100,
            clean_status: CleanStatus::Clean.into(),
            last_timestamp: 1,
        };

        assert_eq!(beast_status.beast_id, 1, "Beast ID should be 1");
        assert!(beast_status.is_alive, "Beast should be alive initially");
        assert!(beast_status.is_awake, "Beast should be awake initially");
        assert_eq!(beast_status.hunger, 100, "Initial hunger should be 100");
        assert_eq!(beast_status.energy, 100, "Initial energy should be 100");
        assert_eq!(beast_status.happiness, 100, "Initial happiness should be 100");
        assert_eq!(beast_status.hygiene, 100, "Initial hygiene should be 100");
        assert_eq!(beast_status.clean_status, 1, "Initial clean status should be Clean");
    }

    #[test]
    #[available_gas(300000)]
    fn test_beast_status_boundaries() {
        let max_status_beast = BeastStatus {
            beast_id: 4,
            is_alive: true,
            is_awake: true,
            hunger: 100,
            energy: 100,
            happiness: 100,
            hygiene: 100,
            clean_status: CleanStatus::Clean.into(),
            last_timestamp: 1, 
        };

        assert!(max_status_beast.hunger <= 100, "Hunger should not exceed 100");
        assert!(max_status_beast.energy <= 100, "Energy should not exceed 100");
        assert!(max_status_beast.happiness <= 100, "Happiness should not exceed 100");
        assert!(max_status_beast.hygiene <= 100, "Hygiene should not exceed 100");
        assert_eq!(max_status_beast.clean_status, 1, "Initial clean status should be Clean");
    }

    #[test]
    #[available_gas(300000)]
    fn test_beast_unique_ids() {
        let beast1 = BeastStatus {
            beast_id: 1,
            is_alive: true,
            is_awake: true,
            hunger: 100,
            energy: 100,
            happiness: 100,
            hygiene: 100,
            clean_status: CleanStatus::Clean.into(),
            last_timestamp: 1,
        };

        let beast2 = BeastStatus {
            beast_id: 2,
            is_alive: true,
            is_awake: true,
            hunger: 100,
            energy: 100,
            happiness: 100,
            hygiene: 100,
            clean_status: CleanStatus::Clean.into(),
            last_timestamp: 1,
        };

        assert!(
            beast1.beast_id != beast2.beast_id,
            "Different beasts should have unique IDs"
        );
    }

    #[test]
    #[available_gas(300000)]
    fn test_deceased_beast_state() {
        let deceased_beast = BeastStatus {
            beast_id: 5,
            is_alive: false,
            is_awake: false,
            hunger: 0,
            energy: 0,
            happiness: 0,
            hygiene: 0,
            clean_status: CleanStatus::Clean.into(),
            last_timestamp: 1,
        };

        assert!(!deceased_beast.is_alive, "Beast should be deceased");
        assert!(!deceased_beast.is_awake, "Deceased beast should not be awake");
        assert_eq!(deceased_beast.hunger, 0, "Deceased beast should have 0 hunger");
        assert_eq!(deceased_beast.energy, 0, "Deceased beast should have 0 energy");
    }

    #[test]
    #[available_gas(300000)]
    fn test_prevent_negative_status() {
        let low_status_beast = BeastStatus {
            beast_id: 6,
            is_alive: true,
            is_awake: true,
            hunger: 1,
            energy: 1,
            happiness: 1,
            hygiene: 1,
            clean_status: CleanStatus::Clean.into(),
            last_timestamp: 1,
        };

        assert!(low_status_beast.hunger >= 0, "Hunger should never be negative");
        assert!(low_status_beast.energy >= 0, "Energy should never be negative");
        assert!(low_status_beast.happiness >= 0, "Happiness should never be negative");
        assert!(low_status_beast.hygiene >= 0, "Hygiene should never be negative");

        assert_eq!(
            low_status_beast.energy, 1,
            "Energy should be maintainable at minimum value without going negative"
        );
    }

    #[test]
    #[available_gas(300000)]
    fn test_status_lower_bound() {
        let zero_status_beast = BeastStatus {
            beast_id: 7,
            is_alive: true,
            is_awake: true,
            hunger: 0,
            energy: 0,
            happiness: 0,
            hygiene: 0,
            clean_status: CleanStatus::Filthy.into(),
            last_timestamp: 1,
        };

        assert_eq!(zero_status_beast.hunger, 0, "Minimum hunger should be 0");
        assert_eq!(zero_status_beast.energy, 0, "Minimum energy should be 0");
        assert_eq!(zero_status_beast.happiness, 0, "Minimum happiness should be 0");
        assert_eq!(zero_status_beast.hygiene, 0, "Minimum hygiene should be 0");
        assert_eq!(zero_status_beast.clean_status, 6, "Minimun clean status should be Filthy");
    }
}
