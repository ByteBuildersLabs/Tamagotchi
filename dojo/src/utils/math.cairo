pub mod math{    
    // Function to calculate the age of a beast
    pub fn calculate_age(birth_date: u64, current_timestamp: u64) -> u8 {
        let total_seconds: u64 =  current_timestamp - birth_date;
        
        let total_days: u64 = total_seconds / 86400; // 86400: total seconds in a day
        
        return total_days.try_into().unwrap();
    }
}
