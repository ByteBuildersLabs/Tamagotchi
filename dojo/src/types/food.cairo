use core::traits::Into;

#[derive(Copy, Drop, Serde)]
pub enum FoodType {
    Apple,
    Banana,
    Cherry,
    Burguer,
    CakeChocolate,
    CakeStrawberry,
    Cheese,
    Chicken,
    Eggs,
    Fish,
    FrenchFries,
    BlueBerry,
    Beef,
    Pizza,
    Corn,
    Potato,
    None
}

pub impl IntoFoodTypeFelt252 of Into<FoodType, felt252> {
    #[inline(always)]
    fn into(self: FoodType) -> felt252 {
        match self {
            FoodType::None => '',
            FoodType::Apple => 'Apple',
            FoodType::Banana => 'Banana',
            FoodType::Cherry => 'Cherry',
            FoodType::Burguer => 'Burguer',
            FoodType::CakeChocolate => 'Cake Chocolate',
            FoodType::CakeStrawberry => 'Cake Strawberry',
            FoodType::Cheese => 'Cheese',
            FoodType::Chicken => 'Chicken',
            FoodType::Eggs => 'Eggs',
            FoodType::Fish => 'Fish',
            FoodType::FrenchFries => 'French Fries',
            FoodType::BlueBerry => 'BlueBerry',
            FoodType::Beef => 'Beef',
            FoodType::Pizza => 'Pizza',
            FoodType::Corn => 'Corn',
            FoodType::Potato => 'Potato',
        }
    }
}

pub impl IntoFoodTypeU8 of Into<FoodType, u8> {
    #[inline(always)]
    fn into(self: FoodType) -> u8 {
        match self {
            FoodType::None => 0,
            FoodType::Apple => 1,
            FoodType::Banana => 2,
            FoodType::Cherry => 3,
            FoodType::Burguer => 4,
            FoodType::CakeChocolate => 5,
            FoodType::CakeStrawberry => 6,
            FoodType::Cheese => 7,
            FoodType::Chicken => 8,
            FoodType::Eggs => 9,
            FoodType::Fish => 10,
            FoodType::FrenchFries => 11,
            FoodType::BlueBerry => 12,
            FoodType::Beef => 13,
            FoodType::Pizza => 14,
            FoodType::Corn => 15,
            FoodType::Potato => 16,
        }
    }
}

pub impl IntoU8FoodType of Into<u8, FoodType> {
    #[inline(always)]
    fn into(self: u8) -> FoodType {
        let food_type: u8 = self.into();
        match food_type {
            0  => FoodType::None,
            1  => FoodType::Apple,
            2  => FoodType::Banana,
            3  => FoodType::Cherry,
            4  => FoodType::Burguer,
            5  => FoodType::CakeChocolate,
            6  => FoodType::CakeStrawberry,
            7  => FoodType::Cheese,
            8  => FoodType::Chicken,
            9  => FoodType::Eggs,
            10 => FoodType::Fish,
            11 => FoodType::FrenchFries,
            12 => FoodType::BlueBerry,
            13 => FoodType::Beef,
            14 => FoodType::Pizza,
            15 => FoodType::Corn,
            16 => FoodType::Potato,
            _  => FoodType::None,
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

        assert_eq!(apple.into(), 1_u8, "FoodType::Apple should be converted to 1");
        assert_eq!(banana.into(), 2_u8, "FoodType::Banana should be converted to 2");
        assert_eq!(cherry.into(), 3_u8, "FoodType::Cherry should be converted to 3");
    }
}
