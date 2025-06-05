import hexToDecimalArray from './hexToDecimalArray';

const fetchStatus = async (account: any): Promise<number[] | undefined> => {
  try {
    const response = await account?.callContract({
      contractAddress: "0x51af5c277d07337a8ef50599173d4b0a10597f3c0b85acebfec4ce9b53a6509",
      entrypoint: "get_timestamp_based_status_with_address",
      calldata: [String(account?.address)],
    });
    return hexToDecimalArray(response);
  } catch (err) {
    console.error(err);
  }
};

export default fetchStatus; 