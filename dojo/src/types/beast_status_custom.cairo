// BeastStatusCustom holds all the required params to create a custom BeastStatus model
#[derive(Copy, Drop, Serde)]
pub struct BeastStatusCustom {
    pub beast_id: u16,
    pub is_alive: bool,
    pub is_awake: bool,
    pub hunger: u8,
    pub energy: u8,
    pub happiness: u8,
    pub hygiene: u8,
    pub clean_status: u8,
    pub last_timestamp: u64,
}
