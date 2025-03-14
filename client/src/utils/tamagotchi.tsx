function hexToDecimal(hexArray: string[] | undefined) {
    if (!hexArray) return 
    return hexArray.map(hexString => parseInt(hexString, 16));
  }

const fetchStatus = async (account:any) => {
    try {
        const response = await account?.callContract({
          contractAddress: "0x3459f5079a6defb83b5a3dac087ebc2b22e24c99b585c95eb2e2986c8a08f6c",
          entrypoint: "get_timestamp_based_status_with_address",
          calldata: [String(account?.address)],
        });
        return hexToDecimal(response);
      } catch (err) {
        console.log(err)
      }
};

export { fetchStatus };
