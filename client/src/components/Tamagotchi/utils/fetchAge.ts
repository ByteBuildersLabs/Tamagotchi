import hexToDecimalArray from './hexToDecimalArray';

const fetchAge = async (account: any): Promise<number[] | undefined> => {
  try {
    const response = await account?.callContract({
      contractAddress: "0x5f40f5c23253d2f4d22849880c89483df6a7f22a3f3b2fa4c88d0476a27d5de",
      entrypoint: "get_beast_age_with_address",
      calldata: [String(account?.address)],
    });
    return hexToDecimalArray(response);
  } catch (err) {
    console.error(err);
  }
};

export default fetchAge; 