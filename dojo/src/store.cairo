// Starknet imports
use starknet::{ContractAddress, get_caller_address};

// Dojo imports
use dojo::world::WorldStorage;
use dojo::model::ModelStorage;

// Models imports
use babybeasts::models::beast::{Beast};
use babybeasts::models::beast_stats::{BeastStats};
use babybeasts::models::beast_status::{BeastStatus};
use babybeasts::models::player::{Player};
use babybeasts::models::food::{Food};

// types import
use babybeasts::types::food::{FoodType};
use babybeasts::types::clean_status::{CleanStatus};

// Constants import
use babybeasts::constants;

// Store struct.
#[derive(Copy, Drop)]
struct Store {
    world: WorldStorage,
}

//Implementation of the `StoreTrait` trait for the `Store` struct.
#[generate_trait]
impl StoreImpl of StoreTrait {
    fn new(world: WorldStorage) -> Store {
        Store { world: world }
    }

    // --------- Getters ---------
    fn read_player(self: Store) -> Player {
        let player_address = get_caller_address();
        self.world.read_model(player_address)
    }

    fn read_beast(self: Store, beast_id: u16) -> Beast {
        let player_address = get_caller_address();
        self.world.read_model((player_address, beast_id))
    }

    fn read_food(self: Store, food_id: u8) -> Food {
        let player_address = get_caller_address();
        self.world.read_model((player_address, food_id))
    }

    fn read_beast_stats(self: Store, beast_id: u16) -> BeastStats {
        self.world.read_model(beast_id)
    }

    fn read_beast_status(self: Store, beast_id: u16) -> BeastStatus {
        self.world.read_model(beast_id)
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

    fn write_beast_stats(mut self: Store, mut beast_stats: @BeastStats) {
        self.world.write_model(beast_stats)
    }

    fn write_food(mut self: Store, food: @Food) {
        self.world.write_model(food)
    }

    
    // --------- New entities ---------
    fn new_player(mut self: Store) {
        let caller = get_caller_address();

        let new_player = Player {
            address: caller, 
            current_beast_id: 0
        };

        self.world.write_model(@new_player)
    }

    fn new_apples(mut self: Store, caller: ContractAddress) {
        let apples = Food {
            player: caller,
            id: FoodType::Apple.into(),
            amount: constants::MAX_FOOD_AMOUNT
        };
        self.world.write_model(@apples);
    }

    fn new_bananas(mut self: Store, caller: ContractAddress) {
        let bananas = Food {
            player: caller,
            id: FoodType::Banana.into(),
            amount: constants::MAX_FOOD_AMOUNT
        };
        self.world.write_model(@bananas);
    }

    fn new_cherries(mut self: Store, caller: ContractAddress) {
        let cherries = Food {
            player: caller,
            id: FoodType::Cherry.into(),
            amount: constants::MAX_FOOD_AMOUNT
        };
        self.world.write_model(@cherries);
    }

    fn new_burguers(mut self: Store, caller: ContractAddress) {
        let burguers = Food {
            player: caller,
            id: FoodType::Burguer.into(),
            amount: constants::MAX_FOOD_AMOUNT
        };
        self.world.write_model(@burguers);
    }

    fn new_cake_chocolates(mut self: Store, caller: ContractAddress) {
        let cake_chocolates = Food {
            player: caller,
            id: FoodType::CakeChocolate.into(),
            amount: constants::MAX_FOOD_AMOUNT,
        };
        self.world.write_model(@cake_chocolates);
    }

    fn new_cake_strawberries(mut self: Store, caller: ContractAddress) {
        let cake_strawberries = Food {
            player: caller,
            id: FoodType::CakeStrawberry.into(),
            amount: constants::MAX_FOOD_AMOUNT,
        };
        self.world.write_model(@cake_strawberries);
    }

    fn new_cheeses(mut self: Store, caller: ContractAddress) {
        let cheeses = Food {
            player: caller,
            id: FoodType::Cheese.into(),
            amount: constants::MAX_FOOD_AMOUNT,
        };
        self.world.write_model(@cheeses);
    }

    fn new_chickens(mut self: Store, caller: ContractAddress) {
        let chickens = Food {
            player: caller,
            id: FoodType::Chicken.into(),
            amount: constants::MAX_FOOD_AMOUNT,
        };
        self.world.write_model(@chickens);
    }

    fn new_eggs(mut self: Store, caller: ContractAddress) {
        let eggs = Food {
            player: caller,
            id: FoodType::Eggs.into(),
            amount: constants::MAX_FOOD_AMOUNT,
        };
        self.world.write_model(@eggs);
    }

    fn new_fish(mut self: Store, caller: ContractAddress) {
        let fish = Food {
            player: caller,
            id: FoodType::Fish.into(),
            amount: constants::MAX_FOOD_AMOUNT,
        };
        self.world.write_model(@fish);
    }

    fn new_french_fries(mut self: Store, caller: ContractAddress) {
        let french_fries = Food {
            player: caller,
            id: FoodType::FrenchFries.into(),
            amount: constants::MAX_FOOD_AMOUNT,
        };
        self.world.write_model(@french_fries);
    }

    fn new_blue_berries(mut self: Store, caller: ContractAddress) {
        let blue_berries = Food {
            player: caller,
            id: FoodType::BlueBerry.into(),
            amount: constants::MAX_FOOD_AMOUNT,
        };
        self.world.write_model(@blue_berries);
    }

    fn new_beefs(mut self: Store, caller: ContractAddress) {
        let beefs = Food {
            player: caller,
            id: FoodType::Beef.into(),
            amount: constants::MAX_FOOD_AMOUNT,
        };
        self.world.write_model(@beefs);
    }

    fn new_pizzas(mut self: Store, caller: ContractAddress) {
        let pizzas = Food {
            player: caller,
            id: FoodType::Pizza.into(),
            amount: constants::MAX_FOOD_AMOUNT,
        };
        self.world.write_model(@pizzas);
    }

    fn new_corns(mut self: Store, caller: ContractAddress) {
        let corns = Food {
            player: caller,
            id: FoodType::Corn.into(),
            amount: constants::MAX_FOOD_AMOUNT,
        };
        self.world.write_model(@corns);
    }

    fn new_potatoes(mut self: Store, caller: ContractAddress) {
        let potatoes = Food {
            player: caller,
            id: FoodType::Potato.into(),
            amount: constants::MAX_FOOD_AMOUNT,
        };
        self.world.write_model(@potatoes);
    }

    fn init_player_food(mut self: Store) {
        let caller = get_caller_address();

        self.new_apples(caller);
        self.new_bananas(caller);
        self.new_cherries(caller);
        self.new_burguers(caller);
        self.new_cake_chocolates(caller);
        self.new_cake_strawberries(caller);
        self.new_cheeses(caller);
        self.new_chickens(caller);
        self.new_eggs(caller);
        self.new_fish(caller);
        self.new_french_fries(caller);
        self.new_blue_berries(caller);
        self.new_beefs(caller);
        self.new_pizzas(caller);
        self.new_corns(caller);
        self.new_potatoes(caller);
    }

    fn new_beast_stats(mut self: Store, beast_id: u16) {
        let mut beast_stats = BeastStats {
            beast_id: beast_id,
            attack: 5,
            defense: 5,
            speed: 5,
            level: 1,
            experience: 0,
            next_level_experience: 60,
        };

        self.world.write_model(@beast_stats);
    }
    
    fn new_beast_status(mut self: Store, beast_id: u16) {
        let mut beast_status = BeastStatus {
            beast_id: beast_id,
            is_alive: true,
            is_awake: true,
            hunger: 100,
            energy: 100,
            happiness: 100,
            hygiene: 100,
            clean_status: CleanStatus::Clean.into(),
        };

        self.world.write_model(@beast_status);
    }
    
    fn new_beast(mut self: Store, beast_id: u16, specie: u8, beast_type: u8) {
        let player = get_caller_address();

        let mut new_beast = Beast {
            player: player,
            beast_id: beast_id,
            specie: specie,
            beast_type: beast_type,
            evolved: false,
            vaulted: false
        };

        self.world.write_model(@new_beast);
    }
    // Delete
}
