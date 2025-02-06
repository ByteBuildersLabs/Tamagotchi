// Starknet import
use starknet::ContractAddress;

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct BeastStats {
    #[key]
    pub beast_id: u32,
    pub attack: u32,
    pub defense: u32,
    pub speed: u32,
    pub level: u32,
    pub experience: u32,
    pub next_level_experience: u32,
}

#[cfg(test)]
mod tests {
    use super::BeastStats;

    #[test]
    #[available_gas(300000)]
    fn test_beast_stats_initialization() {
        let beast_stats = BeastStats {
            beast_id: 1_u32,
            attack: 10_u32,
            defense: 10_u32,
            speed: 10_u32,
            level: 1_u32,
            experience: 0_u32,
            next_level_experience: 100_u32,
        };

        assert_eq!(beast_stats.beast_id, 1_u32, "Beast ID should be 1");
        assert_eq!(beast_stats.attack, 10_u32, "Initial attack should be 10");
        assert_eq!(beast_stats.defense, 10_u32, "Initial defense should be 10");
        assert_eq!(beast_stats.speed, 10_u32, "Initial speed should be 10");
        assert_eq!(beast_stats.level, 1_u32, "Initial level should be 1");
        assert_eq!(beast_stats.experience, 0_u32, "Initial experience should be 0");
        assert_eq!(beast_stats.next_level_experience, 100_u32, "Initial next level experience should be 100");
    }

    #[test]
    #[available_gas(300000)]
    fn test_beast_stats_different_levels() {
        let beast_level_1 = BeastStats {
            beast_id: 1_u32,
            attack: 10_u32,
            defense: 10_u32,
            speed: 10_u32,
            level: 1_u32,
            experience: 0_u32,
            next_level_experience: 100_u32,
        };

        let beast_level_5 = BeastStats {
            beast_id: 2_u32,
            attack: 25_u32,
            defense: 25_u32,
            speed: 25_u32,
            level: 5_u32,
            experience: 400_u32,
            next_level_experience: 500_u32,
        };

        assert!(beast_level_1.level < beast_level_5.level, "Higher level beast should have greater level");
        assert!(beast_level_1.attack < beast_level_5.attack, "Higher level beast should have greater attack");
        assert!(beast_level_1.next_level_experience < beast_level_5.next_level_experience, "Higher level beast should have greater next level experience requirement");
    }

    #[test]
    #[available_gas(300000)]
    fn test_beast_stats_experience_system() {
        let beast_stats = BeastStats {
            beast_id: 1_u32,
            attack: 15_u32,
            defense: 15_u32,
            speed: 15_u32,
            level: 2_u32,
            experience: 75_u32,
            next_level_experience: 200_u32,
        };

        assert!(
            beast_stats.experience < beast_stats.next_level_experience,"Current experience should be less than next level requirement"
        );

        assert!(beast_stats.next_level_experience > 0_u32, "Next level experience should be positive");
        assert!(beast_stats.level > 0_u32, "Level should be positive");
    }

    #[test]
    #[available_gas(300000)]
    fn test_beast_stats_unique_ids() {
        let beast1 = BeastStats {
            beast_id: 1_u32,
            attack: 10_u32,
            defense: 10_u32,
            speed: 10_u32,
            level: 1_u32,
            experience: 0_u32,
            next_level_experience: 100_u32,
        };

        let beast2 = BeastStats {
            beast_id: 2_u32,
            attack: 10_u32,
            defense: 10_u32,
            speed: 10_u32,
            level: 1_u32,
            experience: 0_u32,
            next_level_experience: 100_u32,
        };

        assert!(
            beast1.beast_id != beast2.beast_id,"Different beasts should have unique IDs"
        );
    }

    #[test]
    #[available_gas(300000)]
    fn test_beast_stats_max_values() {
        let high_level_beast = BeastStats {
            beast_id: 1_u32,
            attack: 999_u32,
            defense: 999_u32,
            speed: 999_u32,
            level: 99_u32,
            experience: 9999_u32,
            next_level_experience: 10000_u32,
        };

        assert!(high_level_beast.attack > 0_u32, "Attack should be positive");
        assert!(high_level_beast.defense > 0_u32, "Defense should be positive");
        assert!(high_level_beast.speed > 0_u32, "Speed should be positive");
        assert!(high_level_beast.experience < high_level_beast.next_level_experience, "Experience should be less than next level requirement");
    }
}