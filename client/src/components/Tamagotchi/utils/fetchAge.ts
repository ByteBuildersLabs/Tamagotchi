import hexToDecimalArray from './hexToDecimalArray';

const fetchAge = async (account: any): Promise<number[] | undefined> => {
  try {
    const response = await account?.callContract({
      contractAddress: "0x7d5c17fbc753afe949b591c2cf2868dfa0b5bfa9d52a1c6f7e9712460049f15",
      entrypoint: "get_beast_age_with_address",
      calldata: [String(account?.address)],
    });
    return hexToDecimalArray(response);
  } catch (err) {
    console.error(err);
  }
};

export default fetchAge; 