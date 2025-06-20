import hexToDecimalArray from './hexToDecimalArray';

const fetchAge = async (account: any): Promise<number[] | undefined> => {
  console.info('account age', String(account?.address));
  try {
    const response = await account?.callContract({
      contractAddress: "0x782425ff2132a84992b9e9e497c1305a7e48f6cf3928fd93b7e44ed8efea2ad",
      entrypoint: "get_beast_age_with_address",
      calldata: [String(account?.address)],
    });
    return hexToDecimalArray(response);
  } catch (err) {
    console.error(err);
  }
};

export default fetchAge; 