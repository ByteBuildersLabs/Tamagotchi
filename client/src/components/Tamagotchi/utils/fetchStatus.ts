import hexToDecimalArray from './hexToDecimalArray';

const fetchStatus = async (account: any): Promise<number[] | undefined> => {
  try {
    const response = await account?.callContract({
      contractAddress: "0x2482225c547d9aad680bfac6ba926df6d4b6cc5109b00aa171daff5f4075bc4",
      entrypoint: "get_timestamp_based_status_with_address",
      calldata: [String(account?.address)],
    });
    return hexToDecimalArray(response);
  } catch (err) {
    console.error(err);
  }
};

export default fetchStatus; 