pub mod constants;
pub mod store;

pub mod helpers {
    pub mod timestamp;
}

pub mod systems {
    pub mod actions;
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
}

#[cfg(test)]
pub mod tests {
    mod utils;
    mod test_player;
    mod test_food;
    mod test_status;
    mod test_beast;
}
