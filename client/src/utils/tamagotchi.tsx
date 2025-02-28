function hexToDecimal(hexArray: string[] | undefined) {
    if (!hexArray) return 
    return hexArray.map(hexString => parseInt(hexString, 16));
  }

const fetchStatus = async (account:any) => {
    try {
        const response = await account?.callContract({
          contractAddress: "0x535446c53848f4d19ea9b71d4d9215f646b0696c7fb75dd055533bbfc3bc579",
          entrypoint: "get_timestamp_based_status_with_address",
          calldata: [String(account?.address)],
        });
        return hexToDecimal(response);
      } catch (err) {
        console.log(err)
      }
};

export { fetchStatus };
