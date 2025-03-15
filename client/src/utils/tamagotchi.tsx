function hexToDecimal(hexArray: string[] | undefined) {
    if (!hexArray) return 
    return hexArray.map(hexString => parseInt(hexString, 16));
  }

const fetchStatus = async (account:any) => {
    try {
        const response = await account?.callContract({
          contractAddress: "0x720d84833e281ce389a39ae44459036cf40d093e7a667721153c9e802d9d270",
          entrypoint: "get_timestamp_based_status_with_address",
          calldata: [String(account?.address)],
        });
        return hexToDecimal(response);
      } catch (err) {
        console.log(err)
      }
};

export { fetchStatus };
