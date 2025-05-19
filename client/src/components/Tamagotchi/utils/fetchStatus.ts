import hexToDecimalArray from './hexToDecimalArray';

const fetchStatus = async (account: any): Promise<number[] | undefined> => {
  try {
    const response = await account?.callContract({
      contractAddress: "0x58971d723d0100ae8393550f9166c9dad9b79799a48fc31f0d9684ef556dda9",
      entrypoint: "get_timestamp_based_status_with_address",
      calldata: [String(account?.address)],
    });
    return hexToDecimalArray(response);
  } catch (err) {
    console.error(err);
  }
};

export default fetchStatus; 