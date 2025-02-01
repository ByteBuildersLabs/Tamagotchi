mod test_random {
    use babybeasts::utils::random::{RandomImpl, Random};
    use starknet::get_caller_address;

    fn VRF_ADDRESS() -> starknet::ContractAddress {
        // For sepolia or mainnet address should be 0x051fea4450da9d6aee758bdeba88b2f665bcbf549d2c61421aa724e9ac0ced8f
        starknet::contract_address_const::<0x0>()
    }

    #[test]
    fn test_random() {
        let mut random = RandomImpl::new(VRF_ADDRESS());

        assert(random.next_seed() != random.next_seed(), 'Different seeds');
        assert(random.bool() != random.bool(), 'Different bools');
        assert(random.felt() != random.felt(), 'Different felts');
        assert(random.occurs(50) != random.occurs(50), 'Different occurs');

        let number = random.between::<u8>(0, 100);
        assert(number >= 0 && number <= 100, 'Number is not in range');
    }
}
