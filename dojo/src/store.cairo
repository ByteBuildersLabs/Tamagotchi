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
    #[inline(always)]
    fn new(world: WorldStorage) -> Store {
        Store { world: world }
    }

    // --------- Getters ---------
    #[inline(always)]
    fn read_player(self: Store) -> Player {
        let player_address = get_caller_address();
        self.world.read_model(player_address)
    }

    #[inline(always)]
    fn read_beast(self: Store, beast_id: u32) -> Beast {
        let player_address = get_caller_address();
        self.world.read_model((player_address, beast_id))
    }

    #[inline(always)]
    fn read_food(self: Store, food_id: u8) -> Food {
        let player_address = get_caller_address();
        self.world.read_model((player_address, food_id))
    }

    #[inline(always)]
    fn read_beast_stats(self: Store, beast_id: u32) -> BeastStats {
        self.world.read_model(beast_id)
    }

    #[inline(always)]
    fn read_beast_status(self: Store, beast_id: u32) -> BeastStatus {
        self.world.read_model(beast_id)
    }

    // --------- Setters ---------
    #[inline(always)]
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
    #[inline(always)]
    fn new_player(mut self: Store) {
        let caller = get_caller_address();

        let new_player = Player {
            address: caller, 
            current_beast_id: 0
        };

        self.world.write_model(@new_player)
    }

    #[inline(always)]
    fn new_apples(mut self: Store) {
        let caller = get_caller_address();

        let apples = Food {
            player: caller,
            id: FoodType::Apple.into(),
            name: FoodType::Apple.into(),
            amount: constants::MAX_FOOD_AMOUNT
        };
        self.world.write_model(@apples);
    }

    #[inline(always)]
    fn new_bananas(mut self: Store) {
        let caller = get_caller_address();

        let bananas = Food {
            player: caller,
            id: FoodType::Banana.into(),
            name: FoodType::Banana.into(),
            amount: constants::MAX_FOOD_AMOUNT
        };
        self.world.write_model(@bananas);
    }

    #[inline(always)]
    fn new_cherries(mut self: Store) {
        let caller = get_caller_address();

        let cherries = Food {
            player: caller,
            id: FoodType::Cherry.into(),
            name: FoodType::Cherry.into(),
            amount: constants::MAX_FOOD_AMOUNT
        };
        self.world.write_model(@cherries);
    }

    #[inline(always)]
    fn new_burguers(mut self: Store) {
        let caller = get_caller_address();

        let burguers = Food {
            player: caller,
            id: FoodType::Burguer.into(),
            name: FoodType::Burguer.into(),
            amount: constants::MAX_FOOD_AMOUNT
        };
        self.world.write_model(@burguers);
    }

    #[inline(always)]
    fn new_cake_chocolates(mut self: Store) {
        let caller = get_caller_address();

        let cake_chocolates = Food {
            player: caller,
            id: FoodType::CakeChocolate.into(),
            name: FoodType::CakeChocolate.into(),
            amount: constants::MAX_FOOD_AMOUNT,
        };
        self.world.write_model(@cake_chocolates);
    }

    #[inline(always)]
    fn new_cake_strawberries(mut self: Store) {
        let caller = get_caller_address();

        let cake_strawberries = Food {
            player: caller,
            id: FoodType::CakeStrawberry.into(),
            name: FoodType::CakeStrawberry.into(),
            amount: constants::MAX_FOOD_AMOUNT,
        };
        self.world.write_model(@cake_strawberries);
    }

    #[inline(always)]
    fn new_cheeses(mut self: Store) {
        let caller = get_caller_address();

        let cheeses = Food {
            player: caller,
            id: FoodType::Cheese.into(),
            name: FoodType::Cheese.into(),
            amount: constants::MAX_FOOD_AMOUNT,
        };
        self.world.write_model(@cheeses);
    }

    #[inline(always)]
    fn new_chickens(mut self: Store) {
        let caller = get_caller_address();

        let chickens = Food {
            player: caller,
            id: FoodType::Chicken.into(),
            name: FoodType::Chicken.into(),
            amount: constants::MAX_FOOD_AMOUNT,
        };
        self.world.write_model(@chickens);
    }

    #[inline(always)]
    fn new_eggs(mut self: Store) {
        let caller = get_caller_address();

        let eggs = Food {
            player: caller,
            id: FoodType::Eggs.into(),
            name: FoodType::Eggs.into(),
            amount: constants::MAX_FOOD_AMOUNT,
        };
        self.world.write_model(@eggs);
    }

    #[inline(always)]
    fn new_fish(mut self: Store) {
        let caller = get_caller_address();

        let fish = Food {
            player: caller,
            id: FoodType::Fish.into(),
            name: FoodType::Fish.into(),
            amount: constants::MAX_FOOD_AMOUNT,
        };
        self.world.write_model(@fish);
    }

    #[inline(always)]
    fn new_french_fries(mut self: Store) {
        let caller = get_caller_address();

        let french_fries = Food {
            player: caller,
            id: FoodType::FrenchFries.into(),
            name: FoodType::FrenchFries.into(),
            amount: constants::MAX_FOOD_AMOUNT,
        };
        self.world.write_model(@french_fries);
    }

    #[inline(always)]
    fn new_blue_berries(mut self: Store) {
        let caller = get_caller_address();

        let blue_berries = Food {
            player: caller,
            id: FoodType::BlueBerry.into(),
            name: FoodType::BlueBerry.into(),
            amount: constants::MAX_FOOD_AMOUNT,
        };
        self.world.write_model(@blue_berries);
    }

    #[inline(always)]
    fn new_beefs(mut self: Store) {
        let caller = get_caller_address();

        let beefs = Food {
            player: caller,
            id: FoodType::Beef.into(),
            name: FoodType::Beef.into(),
            amount: constants::MAX_FOOD_AMOUNT,
        };
        self.world.write_model(@beefs);
    }

    #[inline(always)]
    fn new_pizzas(mut self: Store) {
        let caller = get_caller_address();

        let pizzas = Food {
            player: caller,
            id: FoodType::Pizza.into(),
            name: FoodType::Pizza.into(),
            amount: constants::MAX_FOOD_AMOUNT,
        };
        self.world.write_model(@pizzas);
    }

    #[inline(always)]
    fn new_corns(mut self: Store) {
        let caller = get_caller_address();

        let corns = Food {
            player: caller,
            id: FoodType::Corn.into(),
            name: FoodType::Corn.into(),
            amount: constants::MAX_FOOD_AMOUNT,
        };
        self.world.write_model(@corns);
    }

    #[inline(always)]
    fn new_potatoes(mut self: Store) {
        let caller = get_caller_address();

        let potatoes = Food {
            player: caller,
            id: FoodType::Potato.into(),
            name: FoodType::Potato.into(),
            amount: constants::MAX_FOOD_AMOUNT,
        };
        self.world.write_model(@potatoes);
    }

    #[inline(always)]
    fn init_player_food(mut self: Store) {
        self.new_apples();
        self.new_bananas();
        self.new_cherries();
        self.new_burguers();
        self.new_cake_chocolates();
        self.new_cake_strawberries();
        self.new_cheeses();
        self.new_chickens();
        self.new_eggs();
        self.new_fish();
        self.new_french_fries();
        self.new_blue_berries();
        self.new_beefs();
        self.new_pizzas();
        self.new_corns();
        self.new_potatoes();
    }


    #[inline(always)]
    fn new_beast_stats(mut self: Store, beast_id: u32) {
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

    #[inline(always)]
    fn new_beast_status(mut self: Store, beast_id: u32) {
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

    #[inline(always)]
    fn new_beast(mut self: Store, beast_id: u32, specie: u32, beast_type: u32) {
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
