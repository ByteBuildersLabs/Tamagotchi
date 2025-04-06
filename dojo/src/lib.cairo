pub mod constants;
pub mod store;

pub mod helpers {
    pub mod timestamp;
    pub mod pseudo_random;
}

pub mod systems {
    pub mod game;
    pub mod player;
}

pub mod models {
    pub mod beast;
    pub mod beast_status;
    pub mod player;
    pub mod food;
}

pub mod types {
    pub mod food;
    pub mod beast;
    pub mod clean_status;
    pub mod beast_status_custom;
}

#[cfg(test)]
pub mod tests {
    mod utils;
    mod test_beast;
    mod test_food;
    mod test_player;
    mod test_status;
}
