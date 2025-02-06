// Starknet import
use starknet::ContractAddress;

// Models import
use babybeasts::models::beast_stats::{BeastStats};
use babybeasts::models::beast_status::{BeastStatus};

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct Beast {
    #[key]
    pub player: ContractAddress, 
    #[key]
    pub beast_id: u32,
    pub specie: u32,
    pub status: BeastStatus,
    pub stats: BeastStats,
    pub evolved: bool,
    pub vaulted: bool
}

#[cfg(test)]
mod tests {
    use super::Beast;
    use super::BeastStats;
    use super::BeastStatus;
    use starknet::contract_address_const;

    #[test]
    #[available_gas(300000)]
    fn test_beast_initialization() {
        let player_address = contract_address_const::<0x123>();
        
        let beast_status = BeastStatus {
            beast_id: 1_u32,
            is_alive: true,
            is_awake: true,
            hunger: 100_u32,
            energy: 100_u32,
            happiness: 100_u32,
            hygiene: 100_u32,
        };

        let beast_stats = BeastStats {
            beast_id: 1_u32,
            attack: 10_u32,
            defense: 10_u32,
            speed: 10_u32,
            level: 1_u32,
            experience: 0_u32,
            next_level_experience: 100_u32,
        };

        let beast = Beast {
            player: player_address,
            beast_id: 1_u32,
            specie: 1_u32,
            status: beast_status,
            stats: beast_stats,
            evolved: false,
            vaulted: false,
        };

        assert_eq!(beast.player, player_address, "Player address should match");
        assert_eq!(beast.beast_id, 1_u32, "Beast ID should be 1");
        assert_eq!(beast.specie, 1_u32, "Specie should be 1");
        assert!(!beast.evolved, "Beast should not be evolved initially");
        assert!(!beast.vaulted, "Beast should not be vaulted initially");

        assert!(beast.status.is_alive, "Beast should be alive");
        assert!(beast.status.is_awake, "Beast should be awake");
        assert_eq!(beast.status.energy, 100_u32, "Beast should have full energy");

        assert_eq!(beast.stats.level, 1_u32, "Beast should be level 1");
        assert_eq!(beast.stats.experience, 0_u32, "Beast should have 0 experience");
    }

    #[test]
    #[available_gas(300000)]
    fn test_multiple_beasts_per_player() {
        let player_address = contract_address_const::<0x123>();
        
        let beast1 = Beast {
            player: player_address,
            beast_id: 1_u32,
            specie: 1_u32,
            status: BeastStatus {
                beast_id: 1_u32,
                is_alive: true,
                is_awake: true,
                hunger: 100_u32,
                energy: 100_u32,
                happiness: 100_u32,
                hygiene: 100_u32,
            },
            stats: BeastStats {
                beast_id: 1_u32,
                attack: 10_u32,
                defense: 10_u32,
                speed: 10_u32,
                level: 1_u32,
                experience: 0_u32,
                next_level_experience: 100_u32,
            },
            evolved: false,
            vaulted: false,
        };

        let beast2 = Beast {
            player: player_address,
            beast_id: 2_u32,
            specie: 2_u32,
            status: BeastStatus {
                beast_id: 2_u32,
                is_alive: true,
                is_awake: true,
                hunger: 100_u32,
                energy: 100_u32,
                happiness: 100_u32,
                hygiene: 100_u32,
            },
            stats: BeastStats {
                beast_id: 2_u32,
                attack: 12_u32,
                defense: 12_u32,
                speed: 12_u32,
                level: 1_u32,
                experience: 0_u32,
                next_level_experience: 100_u32,
            },
            evolved: false,
            vaulted: false,
        };

        assert_eq!(beast1.player, beast2.player, "Beasts should belong to same player");
        assert!(beast1.beast_id != beast2.beast_id, "Beasts should have different IDs");
        assert!(beast1.specie != beast2.specie, "Beasts should be different species");
    }

    #[test]
    #[available_gas(300000)]
    fn test_evolved_beast() {
        let player_address = contract_address_const::<0x123>();
        
        let evolved_beast = Beast {
            player: player_address,
            beast_id: 1_u32,
            specie: 1_u32,
            status: BeastStatus {
                beast_id: 1_u32,
                is_alive: true,
                is_awake: true,
                hunger: 100_u32,
                energy: 100_u32,
                happiness: 100_u32,
                hygiene: 100_u32,
            },
            stats: BeastStats {
                beast_id: 1_u32,
                attack: 20_u32,
                defense: 20_u32,
                speed: 20_u32,
                level: 10_u32,
                experience: 1000_u32,
                next_level_experience: 1200_u32,
            },
            evolved: true,
            vaulted: false,
        };

        assert!(evolved_beast.evolved, "Beast should be evolved");
        assert!(evolved_beast.stats.attack > 10_u32, "Evolved beast should have higher attack");
        assert!(evolved_beast.stats.level >= 10_u32, "Evolved beast should be higher level");
    }

    #[test]
    #[available_gas(300000)]
    fn test_vaulted_beast() {
        let player_address = contract_address_const::<0x123>();
        
        let vaulted_beast = Beast {
            player: player_address,
            beast_id: 1_u32,
            specie: 1_u32,
            status: BeastStatus {
                beast_id: 1_u32,
                is_alive: true,
                is_awake: false,  
                hunger: 100_u32,
                energy: 100_u32,
                happiness: 100_u32,
                hygiene: 100_u32,
            },
            stats: BeastStats {
                beast_id: 1_u32,
                attack: 10_u32,
                defense: 10_u32,
                speed: 10_u32,
                level: 1_u32,
                experience: 0_u32,
                next_level_experience: 100_u32,
            },
            evolved: false,
            vaulted: true,
        };

        assert!(vaulted_beast.vaulted, "Beast should be vaulted");
        assert!(vaulted_beast.status.is_alive, "Vaulted beast should still be alive");
    }

    #[test]
    #[available_gas(300000)]
    fn test_beast_id_consistency() {
        let player_address = contract_address_const::<0x123>();
        
        let beast = Beast {
            player: player_address,
            beast_id: 1_u32,
            specie: 1_u32,
            status: BeastStatus {
                beast_id: 1_u32,  
                is_alive: true,
                is_awake: true,
                hunger: 100_u32,
                energy: 100_u32,
                happiness: 100_u32,
                hygiene: 100_u32,
            },
            stats: BeastStats {
                beast_id: 1_u32,  
                attack: 10_u32,
                defense: 10_u32,
                speed: 10_u32,
                level: 1_u32,
                experience: 0_u32,
                next_level_experience: 100_u32,
            },
            evolved: false,
            vaulted: false,
        };

        assert_eq!(beast.beast_id, beast.status.beast_id, "Beast ID should match status ID");
        assert_eq!(beast.beast_id, beast.stats.beast_id, "Beast ID should match stats ID");
    }
}
