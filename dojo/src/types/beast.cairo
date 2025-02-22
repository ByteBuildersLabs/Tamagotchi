#[derive(Copy, Drop, Serde)]
enum BeastType {
    Light,
    Magic,
    Shadow,
    None,
}

impl IntoBeastTypeFelt252 of core::Into<BeastType, felt252> {
    #[inline(always)]
    fn into(self: BeastType) -> felt252 {
        match self {
            BeastType::None => '',
            BeastType::Light => 'Light',
            BeastType::Magic => 'Magic',
            BeastType::Shadow => 'Shadow',
        }
    }
}

impl IntoBeastTypeu8 of core::Into<BeastType, u8> {
    #[inline(always)]
    fn into(self: BeastType) -> u8 {
        match self {
            BeastType::None => 0,
            BeastType::Light => 1,
            BeastType::Magic => 2,
            BeastType::Shadow => 3,
        }
    }
}

impl Intou8BeastType of core::Into<u8, BeastType> {
    #[inline]
    fn into(self: u8) -> BeastType {
        let beast_type: u8 = self.into();
        match beast_type {
            0 =>  BeastType::None,
            1 => BeastType::Light,
            2 => BeastType::Magic,
            3 => BeastType::Shadow,
            _ =>  BeastType::None,
        }
    }
}
