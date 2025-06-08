import hexToDecimalArray from './hexToDecimalArray';

const fetchAge = async (account: any): Promise<number[] | undefined> => {
  try {
    const response = await account?.callContract({
      contractAddress: "0x58971d723d0100ae8393550f9166c9dad9b79799a48fc31f0d9684ef556dda9",
      entrypoint: "get_beast_age_with_address",
      calldata: [String(account?.address)],
    });
    return hexToDecimalArray(response);
  } catch (err) {
    console.error(err);
  }
};

export default fetchAge; 