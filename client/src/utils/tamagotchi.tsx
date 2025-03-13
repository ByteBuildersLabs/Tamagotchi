function hexToDecimal(hexArray: string[] | undefined) {
    if (!hexArray) return 
    return hexArray.map(hexString => parseInt(hexString, 16));
  }

const fetchStatus = async (account:any) => {
    try {
        const response = await account?.callContract({
          contractAddress: "0x2d714296564c29beeee7ca64a53268eb8b4f90978161e7e9f48e59d41c67cec",
          entrypoint: "get_timestamp_based_status_with_address",
          calldata: [String(account?.address)],
        });
        return hexToDecimal(response);
      } catch (err) {
        console.log(err)
      }
};

export { fetchStatus };
