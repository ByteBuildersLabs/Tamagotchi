#[derive(Copy, Drop, Serde)]
enum FoodType {
    Apple,
    Banana,
    Cherry,
}

impl IntoFoodTypeFelt252 of core::Into<FoodType, felt252> {
    #[inline(always)]
    fn into(self: FoodType) -> felt252 {
        match self {
            FoodType::Apple => 'Apple',
            FoodType::Banana => 'Banana',
            FoodType::Cherry => 'Cherry',
        }
    }
}

impl IntoFoodTypeU8 of core::Into<FoodType, u8> {
    #[inline(always)]
    fn into(self: FoodType) -> u8 {
        match self {
            FoodType::Apple => 0,
            FoodType::Banana => 1,
            FoodType::Cherry => 2,
        }
    }
}


#[cfg(test)]
mod tests {
    use super::{FoodType, IntoFoodTypeFelt252, IntoFoodTypeU8};

    #[test]
    #[available_gas(1000000)]
    fn test_food_type_into_felt252() {
        // Test the conversion of each food type to felt252
        let apple = FoodType::Apple;
        let banana = FoodType::Banana;
        let cherry = FoodType::Cherry;

        assert_eq!(apple.into(), 'Apple', "FoodType::Apple should be converted to 'Apple'");
        assert_eq!(banana.into(), 'Banana', "FoodType::Banana should be converted to 'Banana'");
        assert_eq!(cherry.into(), 'Cherry', "FoodType::Cherry should be converted to 'Cherry'");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_food_type_into_u8() {
        // Test the conversion of each food type to u8
        let apple = FoodType::Apple;
        let banana = FoodType::Banana;
        let cherry = FoodType::Cherry;

        assert_eq!(apple.into(), 0_u8, "FoodType::Apple should be converted to 0");
        assert_eq!(banana.into(), 1_u8, "FoodType::Banana should be converted to 1");
        assert_eq!(cherry.into(), 2_u8, "FoodType::Cherry should be converted to 2");
    }
}