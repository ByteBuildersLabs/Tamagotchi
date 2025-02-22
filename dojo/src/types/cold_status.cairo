use core::traits::TryInto;

#[derive(Copy, Drop, Serde)]
pub struct ColdStatus {
    pub is_alive: bool,
    pub is_awake: bool,
    pub hunger: u8,
    pub energy: u8,
    pub happiness: u8,
    pub hygiene: u8,
    pub last_update: u64, //timestamp of the last_update received
}

#[generate_trait]
pub impl ColdStatusImpl of ColdStatusTrait {
    fn calculate_colds_stats(ref self: ColdStatus, actual_timestamp: u64){
        // Calculate the status based on the timestamp
        let total_seconds: u32 =  (actual_timestamp - self.last_update).try_into().unwrap();
        let points_to_drecrease: u8 = (total_seconds / 600).try_into().unwrap(); // 600: seconds in 10 minutes   

        let multiplied_hunger_to_decrease = points_to_drecrease * 3;
        let multiplied_energy_to_decrease = points_to_drecrease * 2;

        if self.is_alive == true {
            // Decrease energy based on conditions
            if self.happiness == 0 || self.hygiene == 0 {
                self.energy = if self.energy >= multiplied_energy_to_decrease {
                    self.energy - multiplied_energy_to_decrease
                } else {
                    0
                };
            } else {
                self.energy = if self.energy >= points_to_drecrease {
                    self.energy - points_to_drecrease
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
            self.happiness = if self.happiness >= points_to_drecrease {
                self.happiness - points_to_drecrease
            } else {
                0
            };

            // Decrease hygiene safely
            self.hygiene = if self.hygiene >= points_to_drecrease {
                self.hygiene - points_to_drecrease
            } else {
                0
            };

            // Check if beast dies
            if self.energy == 0 || self.hunger == 0 {
                self.is_alive = false;
            }
        }
    }

    
}
