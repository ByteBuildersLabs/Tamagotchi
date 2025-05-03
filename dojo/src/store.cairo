// Starknet imports
use starknet::{ContractAddress, get_caller_address, get_block_timestamp};

// Dojo imports
use dojo::world::WorldStorage;
use dojo::model::ModelStorage;

// Models imports
use tamagotchi::models::beast::{Beast, BeastTrait};
use tamagotchi::models::beast_status::{BeastStatus, BeastStatusTrait};
use tamagotchi::models::player::{Player};
use tamagotchi::models::food::{Food};
use tamagotchi::models::highest_score::{HighestScore};

// types import
use tamagotchi::types::food::{FoodType};
use tamagotchi::types::beast_status_custom::{BeastStatusCustom};

// Constants import
use tamagotchi::constants;

// Helpers import
use tamagotchi::helpers::timestamp::Timestamp;

// Store struct
#[derive(Copy, Drop)]
pub struct Store {
    world: WorldStorage,
}

//Implementation of the `StoreTrait` trait for the `Store` struct
#[generate_trait]
pub impl StoreImpl of StoreTrait {
    fn new(world: WorldStorage) -> Store {
        Store { world: world }
    }

    // --------- Getters ---------
    fn read_player_from_address(self: Store, player_address: ContractAddress) -> Player {
        self.world.read_model(player_address)
    }

    fn read_player(self: Store) -> Player {
        let player_address = get_caller_address();
        self.world.read_model(player_address)
    }

    fn read_beast_from_address(self: Store, beast_id: u16, player_address: ContractAddress) -> Beast {
        self.world.read_model((player_address, beast_id))
    }

    fn read_beast(self: Store, beast_id: u16) -> Beast {
        let player_address = get_caller_address();
        self.world.read_model((player_address, beast_id))
    }

    fn read_food(self: Store, food_id: u8) -> Food {
        let player_address = get_caller_address();
        self.world.read_model((player_address, food_id))
    }

    fn read_beast_status(self: Store, beast_id: u16) -> BeastStatus {
        self.world.read_model(beast_id)
    }

    fn read_highest_score(self: Store, minigame_id: u16) -> HighestScore {
        let player_address = get_caller_address();
        self.world.read_model((minigame_id, player_address))
    }    

    // --------- Setters ---------
    fn write_player(mut self: Store, mut player: @Player) {
        self.world.write_model(player)
    }

    fn write_beast(mut self: Store, mut beast: @Beast) {
        self.world.write_model(beast)
    }

    fn write_beast_status(mut self: Store, mut beast_status: @BeastStatus) {
        self.world.write_model(beast_status)
    }

    fn write_food(mut self: Store, food: @Food) {
        self.world.write_model(food)
    }

    fn write_new_highest_score(mut self: Store, highest_score: @HighestScore){
        self.world.write_model(highest_score)
    }
    
    // --------- New entities ---------
    fn new_player(mut self: Store) {
        let caller = get_caller_address();
        let current_timestamp = get_block_timestamp();

        let new_player = Player {
            address: caller,
            current_beast_id: 0,
            total_points: 0,
            daily_streak: 0,
            last_active_day: 0,
            creation_day: Timestamp::unix_timestamp_to_day(current_timestamp),
        };

        self.world.write_model(@new_player)
    }

    fn new_food(mut self: Store, food_id: u8, amount: u8) {
        let caller = get_caller_address();

        let food_type: FoodType = food_id.into(); // Convert u8 to FoodType

        match food_type {
            FoodType::Apple => self.new_apples(caller, amount),
            FoodType::Banana => self.new_bananas(caller, amount),
            FoodType::Cherry => self.new_cherries(caller, amount),
            FoodType::Burguer => self.new_burguers(caller, amount),
            FoodType::CakeChocolate => self.new_cake_chocolates(caller, amount),
            FoodType::CakeStrawberry => self.new_cake_strawberries(caller, amount),
            FoodType::Cheese => self.new_cheeses(caller, amount),
            FoodType::Chicken => self.new_chickens(caller, amount),
            FoodType::Eggs => self.new_eggs(caller, amount),
            FoodType::Fish => self.new_fish(caller, amount),
            FoodType::FrenchFries => self.new_french_fries(caller, amount),
            FoodType::BlueBerry => self.new_blue_berries(caller, amount),
            FoodType::Beef => self.new_beefs(caller, amount),
            FoodType::Pizza => self.new_pizzas(caller, amount),
            FoodType::Corn => self.new_corns(caller, amount),
            FoodType::Potato => self.new_potatoes(caller, amount),
            _ => {}
        }

    }

    fn new_apples(mut self: Store, caller: ContractAddress, amount: u8) {
        let apples = Food {
            player: caller, id: FoodType::Apple.into(), amount: amount,
        };
        self.world.write_model(@apples);
    }

    fn new_bananas(mut self: Store, caller: ContractAddress, amount: u8) {
        let bananas = Food {
            player: caller, id: FoodType::Banana.into(), amount: amount,
        };
        self.world.write_model(@bananas);
    }

    fn new_cherries(mut self: Store, caller: ContractAddress, amount: u8) {
        let cherries = Food {
            player: caller, id: FoodType::Cherry.into(), amount: amount,
        };
        self.world.write_model(@cherries);
    }

    fn new_burguers(mut self: Store, caller: ContractAddress, amount: u8) {
        let burguers = Food {
            player: caller, id: FoodType::Burguer.into(), amount: amount,
        };
        self.world.write_model(@burguers);
    }

    fn new_cake_chocolates(mut self: Store, caller: ContractAddress, amount: u8) {
        let cake_chocolates = Food {
            player: caller, id: FoodType::CakeChocolate.into(), amount: amount,
        };
        self.world.write_model(@cake_chocolates);
    }

    fn new_cake_strawberries(mut self: Store, caller: ContractAddress, amount: u8) {
        let cake_strawberries = Food {
            player: caller, id: FoodType::CakeStrawberry.into(), amount: amount,
        };
        self.world.write_model(@cake_strawberries);
    }

    fn new_cheeses(mut self: Store, caller: ContractAddress, amount: u8) {
        let cheeses = Food {
            player: caller, id: FoodType::Cheese.into(), amount: amount,
        };
        self.world.write_model(@cheeses);
    }

    fn new_chickens(mut self: Store, caller: ContractAddress, amount: u8) {
        let chickens = Food {
            player: caller, id: FoodType::Chicken.into(), amount: amount,
        };
        self.world.write_model(@chickens);
    }

    fn new_eggs(mut self: Store, caller: ContractAddress, amount: u8) {
        let eggs = Food {
            player: caller, id: FoodType::Eggs.into(), amount: amount,
        };
        self.world.write_model(@eggs);
    }

    fn new_fish(mut self: Store, caller: ContractAddress, amount: u8) {
        let fish = Food {
            player: caller, id: FoodType::Fish.into(), amount: amount,
        };
        self.world.write_model(@fish);
    }

    fn new_french_fries(mut self: Store, caller: ContractAddress, amount: u8) {
        let french_fries = Food {
            player: caller, id: FoodType::FrenchFries.into(), amount: amount,
        };
        self.world.write_model(@french_fries);
    }

    fn new_blue_berries(mut self: Store, caller: ContractAddress, amount: u8) {
        let blue_berries = Food {
            player: caller, id: FoodType::BlueBerry.into(), amount: amount,
        };
        self.world.write_model(@blue_berries);
    }

    fn new_beefs(mut self: Store, caller: ContractAddress, amount: u8) {
        let beefs = Food {
            player: caller, id: FoodType::Beef.into(), amount: amount,
        };
        self.world.write_model(@beefs);
    }

    fn new_pizzas(mut self: Store, caller: ContractAddress, amount: u8) {
        let pizzas = Food {
            player: caller, id: FoodType::Pizza.into(), amount: amount,
        };
        self.world.write_model(@pizzas);
    }

    fn new_corns(mut self: Store, caller: ContractAddress, amount: u8) {
        let corns = Food {
            player: caller, id: FoodType::Corn.into(), amount: amount,
        };
        self.world.write_model(@corns);
    }

    fn new_potatoes(mut self: Store, caller: ContractAddress, amount: u8) {
        let potatoes = Food {
            player: caller, id: FoodType::Potato.into(), amount: amount,
        };
        self.world.write_model(@potatoes);
    }

    fn init_player_food(mut self: Store, beast_id: u16) {
        // Read the beast instance
        let beast = self.read_beast(beast_id);
    
        // Get a random favorite food for this beast
        let favorite_food_id = beast.get_random_favorite_food(beast_id);

        // Get a random common food for this beast
        let common_food_id = beast.get_random_common_food(beast_id);
    
        // Create both foods for the player with the initial amount
        self.new_food(favorite_food_id, constants::MAX_FOOD_AMOUNT);
        self.new_food(common_food_id, constants::MAX_FOOD_AMOUNT);
    }

    fn new_beast_status_random_values(mut self: Store, beast_id: u16) {
        let current_timestamp = get_block_timestamp();

        let mut beast_status = BeastStatusTrait::new_beast_status_random_values(beast_id, current_timestamp);

        self.world.write_model(@beast_status);
    }

    fn new_beast_status_custom_values(mut self: Store, beast_status_custom: BeastStatusCustom) {
        let mut beast_status = BeastStatusTrait::new_beast_status_custom_values(beast_status_custom);

        self.world.write_model(@beast_status);
    }

    fn new_beast(mut self: Store, beast_id: u16, specie: u8, beast_type: u8) {
        let player = get_caller_address();
        let current_timestamp = get_block_timestamp();

        let mut new_beast = Beast {
            player: player,
            beast_id: beast_id,
            age: 0,
            birth_date: current_timestamp,
            specie: specie,
            beast_type: beast_type,
        };

        self.world.write_model(@new_beast);
    }
}
