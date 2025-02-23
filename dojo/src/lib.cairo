pub mod constants;
pub mod store;

pub mod systems {
    pub mod actions;
}

pub mod models {
    pub mod beast;
    pub mod beast_stats;
    pub mod beast_status;
    pub mod player;
    pub mod food;
}

pub mod types {
    pub mod food;
    pub mod beast;
    pub mod clean_status;
}

// pub mod utils {
//     mod random;
// }

#[cfg(test)]
pub mod tests {
    mod utils;
    // mod test_random;
    mod test_actions;
    mod test_player;
    mod test_food;
    mod test_status;
    mod test_stats;
    mod test_beast;
}
