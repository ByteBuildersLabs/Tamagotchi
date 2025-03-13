use core::hash::{HashStateTrait};
use starknet::{get_block_timestamp, get_block_number};
use core::pedersen::PedersenTrait;

#[generate_trait]
pub impl PseudoRandom of PseudoRandomTrait {
    /// Generates a pseudo-random number between min and max (inclusive)
    /// 
    /// # Arguments
    /// * `seed` - Seed value for the random number
    /// * `salt` - Additional value to add randomness
    /// * `min` - Minimum value for the range
    /// * `max` - Maximum value for the range
    /// 
    /// # Returns
    /// * `u8` - Random number between min and max
    fn generate_random(seed: felt252, salt: felt252, min: u8, max: u8) -> u8 {
        // Combine the seed and salt
        let combined = seed + salt;
        
        // Use the Pedersen hash to generate a pseudo-random value
        let hash_state = PedersenTrait::new(0);
        let hash_state = hash_state.update(combined);
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
    
    /// Generates a random attribute value for a beast
    /// 
    /// # Arguments
    /// * `beast_id` - ID of the beast
    /// * `attribute_salt` - Unique salt value for each attribute
    /// * `min` - Minimum value for the range
    /// * `max` - Maximum value for the range
    /// 
    /// # Returns
    /// * `u8` - Random number between min and max
    fn generate_beast_attribute(
        beast_id: u16, 
        attribute_salt: u16,
        min: u8, 
        max: u8
    ) -> u8 {
        // Obtain entropy values from the environment
        let block_timestamp = get_block_timestamp();
        let block_number = get_block_number();
        
        // Create a unique seed for each attribute by combining different sources
        let timestamp_seed: felt252 = block_timestamp.into() + attribute_salt.into();
        let block_seed: felt252 = block_number.into() + beast_id.into();
        let combined_seed: felt252 = timestamp_seed + (beast_id * attribute_salt).into();
        
        // Generate a random value
        return Self::generate_random(combined_seed, block_seed, min, max);
    }
}

#[cfg(test)]
mod tests {
    use super::PseudoRandom;
    
    #[test]
    #[available_gas(300000)]
    fn test_random_generation() {
        let min: u8 = 50;
        let max: u8 = 90;
        
        // Test with different seeds
        let random1 = PseudoRandom::generate_random(1, 100, min, max);
        let random2 = PseudoRandom::generate_random(2, 100, min, max);
        let random3 = PseudoRandom::generate_random(1, 101, min, max);
        
        // Check that values are within range
        assert(random1 >= min && random1 <= max, 'Value should be within range');
        assert(random2 >= min && random2 <= max, 'Value should be within range');
        assert(random3 >= min && random3 <= max, 'Value should be within range');
        
        // Check that at least two values are different (collisions are possible)
        let all_equal = random1 == random2 && random2 == random3;
        assert(!all_equal, 'All values are the same');
    }
    

    #[test]
    #[available_gas(300000)]
    fn test_beast_attribute_generation() {
        let beast_id = 1_u16;
        let min: u8 = 50;
        let max: u8 = 90;
        
        // Generate attributes for different beasts
        let hunger1 = PseudoRandom::generate_beast_attribute(beast_id, 1, min, max);
        let hunger2 = PseudoRandom::generate_beast_attribute(beast_id + 1, 1, min, max);
        
        // Check that values are within range
        assert(hunger1 >= min && hunger1 <= max, 'Value out of range');
        assert(hunger2 >= min && hunger2 <= max, 'Value out of range');
        
        // Generate several values to see if they are different
        let happiness = PseudoRandom::generate_beast_attribute(beast_id, 2, min, max);
        let energy = PseudoRandom::generate_beast_attribute(beast_id, 3, min, max);
        let hygiene = PseudoRandom::generate_beast_attribute(beast_id, 4, min, max);
        
        // At least some values are different
        let all_equal = hunger1 == happiness && happiness == energy && energy == hygiene;
        assert(!all_equal, 'All values are the same');
    }
    
}