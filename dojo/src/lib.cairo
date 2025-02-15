mod constants;
mod store;

mod systems {
    mod actions;
}

mod models {
    mod beast;
    mod beast_stats;
    mod beast_status;
    mod player;
    mod food;
}

mod types {
    mod food;
    mod beast;
    mod clean_status;
}

mod utils {
    mod random;
}

#[cfg(test)]
mod tests {
    mod utils;
    mod test_random;
    mod test_actions;
    mod test_player;
    mod test_food;
    mod test_status;
    mod test_stats;
    mod test_beast;
}
