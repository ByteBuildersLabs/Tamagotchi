// Starknet import
use starknet::ContractAddress;

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct Beast {
    #[key]
    pub player: ContractAddress, 
    #[key]
    pub beast_id: u32,
    pub specie: u32,
    pub evolved: bool,
    pub vaulted: bool
}

#[cfg(test)]
mod tests {
    use super::Beast;
    use starknet::contract_address_const;

    #[test]
    #[available_gas(300000)]
    fn test_beast_initialization() {
        let player_address = contract_address_const::<0x123>();

        let beast = Beast {
            player: player_address,
            beast_id: 1_u32,
            specie: 1_u32,
            evolved: false,
            vaulted: false,
        };

        assert_eq!(beast.player, player_address, "Player address should match");
        assert_eq!(beast.beast_id, 1_u32, "Beast ID should be 1");
        assert_eq!(beast.specie, 1_u32, "Specie should be 1");
        assert!(!beast.evolved, "Beast should not be evolved initially");
        assert!(!beast.vaulted, "Beast should not be vaulted initially");
    }

    #[test]
    #[available_gas(300000)]
    fn test_multiple_beasts_per_player() {
        let player_address = contract_address_const::<0x123>();
        
        let beast1 = Beast {
            player: player_address,
            beast_id: 1_u32,
            specie: 1_u32,
            evolved: false,
            vaulted: false,
        };

        let beast2 = Beast {
            player: player_address,
            beast_id: 2_u32,
            specie: 2_u32,
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
            evolved: true,
            vaulted: false,
        };

        assert!(evolved_beast.evolved, "Beast should be evolved");
    }

    #[test]
    #[available_gas(300000)]
    fn test_vaulted_beast() {
        let player_address = contract_address_const::<0x123>();
        
        let vaulted_beast = Beast {
            player: player_address,
            beast_id: 1_u32,
            specie: 1_u32,
            evolved: false,
            vaulted: true,
        };

        assert!(vaulted_beast.vaulted, "Beast should be vaulted");
    }

    #[test]
    #[available_gas(300000)]
    fn test_beast_id_consistency() {
        let player_address = contract_address_const::<0x123>();
        
        let beast = Beast {
            player: player_address,
            beast_id: 1_u32,
            specie: 1_u32,
            evolved: false,
            vaulted: false,
        };

        assert_eq!(beast.beast_id, 1_u32, "Beast ID should be 1");
    }
}
