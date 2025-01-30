use cartridge_vrf::{IVrfProviderDispatcher, IVrfProviderDispatcherTrait, Source};
use core::poseidon::poseidon_hash_span;
use starknet::{get_contract_address, get_caller_address, ContractAddress, TxInfo};

#[derive(Copy, Drop, Serde)]
struct Random {
    seed: felt252,
    nonce: usize,
    vrf_provider_address: ContractAddress
}

#[generate_trait]
impl RandomImpl of RandomTrait {
    fn new(vrf_provider_address: ContractAddress) -> Random {
        let tx_info: TxInfo = starknet::get_tx_info().unbox();
        if vrf_provider_address.is_zero() {
            assert!(tx_info.chain_id.is_zero() || tx_info.chain_id == 'KATANA', "VRF provider address must be set");
        }

        let initial_seed = pedersen::pedersen(
            starknet::get_tx_info().unbox().transaction_hash,
            get_contract_address().into()
        );
        Random { seed: initial_seed, nonce: 0, vrf_provider_address }
    }

    fn next_seed(ref self: Random) -> felt252 {
        if self.vrf_provider_address.is_zero() {
            // For testnet we use a pseudo-random seed
            self.nonce += 1;
            self.seed = pedersen::pedersen(self.seed, self.nonce.into());
        } else {
            let vrf_provider = IVrfProviderDispatcher { contract_address: self.vrf_provider_address };
            let random_value: felt252 = vrf_provider.consume_random(Source::Nonce(get_caller_address()));
            self.seed = random_value;
        }
        self.seed
    }

    /// Returns a random boolean value.
    fn bool(ref self: Random) -> bool {
        let seed: u256 = self.next_seed().into();
        seed.low % 2 == 0
    }

    /// Returns a random felt value.
    fn felt(ref self: Random) -> felt252 {
        let tx_hash = starknet::get_tx_info().unbox().transaction_hash;
        let seed = self.next_seed();
        pedersen::pedersen(tx_hash, seed)
    }

    fn occurs(ref self: Random, likelihood: u8) -> bool {
        if likelihood == 0 {
            return false;
        }

        let result = self.between::<u8>(0, 100);
        result <= likelihood
    }

    fn between<T, +Into<T, u128>, +Into<T, u256>, +TryInto<u128, T>, +PartialOrd<T>, +Zeroable<T>, +Copy<T>, +Drop<T>>(
        ref self: Random, min: T, max: T
    ) -> T {
        let seed: u256 = self.next_seed().into();

        if min >= max {
            return Zeroable::zero();
        };

        let range: u128 = max.into() - min.into() + 1;
        let rand = (seed.low % range) + min.into();
        rand.try_into().unwrap()
    }
}
