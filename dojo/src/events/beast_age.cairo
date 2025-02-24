#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct BeastAge {
    #[key]
    pub beast_id: u16,
    pub age: u8,
}
