import hexToDecimalArray from './hexToDecimalArray';

const fetchStatus = async (account: any): Promise<number[] | undefined> => {
  try {
    const response = await account?.callContract({
      contractAddress: "0x9ab404df9549cff7771d2404d1a4c18e04b75027c78a2c7eb43547ad76c021",
      entrypoint: "get_timestamp_based_status_with_address",
      calldata: [String(account?.address)],
    });
    return hexToDecimalArray(response);
  } catch (err) {
    console.error(err);
  }
};

export default fetchStatus; 