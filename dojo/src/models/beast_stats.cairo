// Starknet import
use starknet::ContractAddress;

#[derive(Drop, Serde, IntrospectPacked, Debug)]
#[dojo::model]
pub struct BeastStats {
    #[key]
    pub beast_id: u16,
    pub attack: u8,
    pub defense: u8,
    pub speed: u8,
    pub level: u8,
    pub experience: u8,
    pub next_level_experience: u8,
}

#[cfg(test)]
mod tests {
    use super::BeastStats;

    #[test]
    #[available_gas(300000)]
    fn test_beast_stats_initialization() {
        let beast_stats = BeastStats {
            beast_id: 1,
            attack: 10,
            defense: 10,
            speed: 10,
            level: 1,
            experience: 0,
            next_level_experience: 100,
        };

        assert_eq!(beast_stats.beast_id, 1, "Beast ID should be 1");
        assert_eq!(beast_stats.attack, 10, "Initial attack should be 10");
        assert_eq!(beast_stats.defense, 10, "Initial defense should be 10");
        assert_eq!(beast_stats.speed, 10, "Initial speed should be 10");
        assert_eq!(beast_stats.level, 1, "Initial level should be 1");
        assert_eq!(beast_stats.experience, 0, "Initial experience should be 0");
        assert_eq!(beast_stats.next_level_experience, 100, "Initial next level experience should be 100");
    }

    #[test]
    #[available_gas(300000)]
    fn test_beast_stats_different_levels() {
        let beast_level_1 = BeastStats {
            beast_id: 1,
            attack: 10,
            defense: 10,
            speed: 10,
            level: 1,
            experience: 0,
            next_level_experience: 100,
        };

        let beast_level_5 = BeastStats {
            beast_id: 2,
            attack: 25,
            defense: 25,
            speed: 25,
            level: 5,
            experience: 200,
            next_level_experience: 200,
        };

        assert!(beast_level_1.level < beast_level_5.level, "Higher level beast should have greater level");
        assert!(beast_level_1.attack < beast_level_5.attack, "Higher level beast should have greater attack");
        assert!(beast_level_1.next_level_experience < beast_level_5.next_level_experience, "Higher level beast should have greater next level experience requirement");
    }

    #[test]
    #[available_gas(300000)]
    fn test_beast_stats_experience_system() {
        let beast_stats = BeastStats {
            beast_id: 1,
            attack: 15,
            defense: 15,
            speed: 15,
            level: 2,
            experience: 75,
            next_level_experience: 200,
        };

        assert!(
            beast_stats.experience < beast_stats.next_level_experience,"Current experience should be less than next level requirement"
        );

        assert!(beast_stats.next_level_experience > 0, "Next level experience should be positive");
        assert!(beast_stats.level > 0, "Level should be positive");
    }

    #[test]
    #[available_gas(300000)]
    fn test_beast_stats_unique_ids() {
        let beast1 = BeastStats {
            beast_id: 1,
            attack: 10,
            defense: 10,
            speed: 10,
            level: 1,
            experience: 0,
            next_level_experience: 100,
        };

        let beast2 = BeastStats {
            beast_id: 2,
            attack: 10,
            defense: 10,
            speed: 10,
            level: 1,
            experience: 0,
            next_level_experience: 100,
        };

        assert!(
            beast1.beast_id != beast2.beast_id,"Different beasts should have unique IDs"
        );
    }

    #[test]
    #[available_gas(300000)]
    fn test_beast_stats_max_values() {
        let high_level_beast = BeastStats {
            beast_id: 1,
            attack: 200,
            defense: 200,
            speed: 200,
            level: 99,
            experience: 200,
            next_level_experience: 240,
        };

        assert!(high_level_beast.attack > 0, "Attack should be positive");
        assert!(high_level_beast.defense > 0, "Defense should be positive");
        assert!(high_level_beast.speed > 0, "Speed should be positive");
        assert!(high_level_beast.experience < high_level_beast.next_level_experience, "Experience should be less than next level requirement");
    }
}