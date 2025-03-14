// Core imports
use core::hash::{HashStateTrait};
use core::pedersen::PedersenTrait;

// Starknet import
use starknet::{get_block_timestamp, get_block_number};

// Trait implementation
#[generate_trait]
pub impl PseudoRandom of PseudoRandomTrait {
    /// Generates a pseudo-random u8 number between min and max (inclusive)
    /// 
    /// # Arguments
    /// * `unique_id` - Unique ID used to generate randomness
    /// * `salt` - Unique salt value to generate randomness
    /// * `min` - Minimum value for the range
    /// * `max` - Maximum value for the range
    /// 
    /// # Returns
    /// * `u8` - Random number between min and max
    fn generate_random_u8(
        unique_id: u16, 
        salt: u16,
        min: u8, 
        max: u8
    ) -> u8 {
        // Obtain entropy values from the environment
        let block_timestamp = get_block_timestamp();
        let block_number = get_block_number();
        
        // Create unique seeds by combining different sources
        let timestamp_seed: felt252 = block_timestamp.into() + salt.into();
        let block_seed: felt252 = block_number.into() + unique_id.into();
        let combined_seed: felt252 = timestamp_seed + (unique_id * salt).into();
        
        // Combine the seeds
        let hash_input = combined_seed + block_seed;
        
        // Use the Pedersen hash to generate a pseudo-random value
        let hash_state = PedersenTrait::new(0);
        let hash_state = hash_state.update(hash_input);
        let hash = hash_state.finalize();
        
        // Convert the hash to a value between min and max
        let range: u64 = (max - min + 1).into();
        
        // Convert hash to u256 to handle large values safely
        let hash_u256: u256 = hash.into();
        
        // Take modulo to get a value within range
        let mod_value: u64 = (hash_u256 % range.into()).try_into().unwrap();
        
        // Convert back to u8 and add min
        let random_value: u8 = mod_value.try_into().unwrap() + min;
        
        return random_value;
    }
}

// Tests
#[cfg(test)]
mod tests {
    use super::PseudoRandom;
    
    #[test]
    #[available_gas(300000)]
    fn test_random_generation() {
        let min: u8 = 50;
        let max: u8 = 90;
        
        // Test with different beast IDs and attribute salts
        let random1 = PseudoRandom::generate_random_u8(1, 1, min, max);
        let random2 = PseudoRandom::generate_random_u8(2, 1, min, max);
        let random3 = PseudoRandom::generate_random_u8(1, 2, min, max);
        
        // Check that values are within range
        assert(random1 >= min && random1 <= max, 'Value out of range');
        assert(random2 >= min && random2 <= max, 'Value out of range');
        assert(random3 >= min && random3 <= max, 'Value out of range');
        
        // Check that at least two values are different (collisions are possible)
        let all_equal = random1 == random2 && random2 == random3;
        assert(!all_equal, 'All values are the same');
    }
    
    #[test]
    #[available_gas(300000)]
    fn test_different_attributes() {
        let beast_id = 1_u16;
        let min: u8 = 50;
        let max: u8 = 90;
        
        // Generate values for different attributes of the same beast
        let hunger = PseudoRandom::generate_random_u8(beast_id, 1, min, max);
        let energy = PseudoRandom::generate_random_u8(beast_id, 2, min, max);
        let happiness = PseudoRandom::generate_random_u8(beast_id, 3, min, max);
        let hygiene = PseudoRandom::generate_random_u8(beast_id, 4, min, max);
        
        // Check that values are within range
        assert(hunger >= min && hunger <= max, 'Hunger out of range');
        assert(energy >= min && energy <= max, 'Energy out of range');
        assert(happiness >= min && happiness <= max, 'Happiness out of range');
        assert(hygiene >= min && hygiene <= max, 'Hygiene out of range');
        
        // It's likely that at least some values are different
        let all_equal = hunger == energy && energy == happiness && happiness == hygiene;
        assert(!all_equal, 'All attributes are the same');
    }
    
    #[test]
    #[available_gas(300000)]
    fn test_consistency() {
        // Test that the same inputs produce the same outputs
        let beast_id = 5_u16;
        let attribute_salt = 3_u16;
        let min: u8 = 50;
        let max: u8 = 90;
        
        let value1 = PseudoRandom::generate_random_u8(beast_id, attribute_salt, min, max);
        let value2 = PseudoRandom::generate_random_u8(beast_id, attribute_salt, min, max);
        
        // Same inputs should give same outputs
        assert(value1 == value2, 'Random values not consistent');
    }
}
