function hexToDecimal(hexArray: string[] | undefined) {
    if (!hexArray) return 
    return hexArray.map(hexString => parseInt(hexString, 16));
  }

const fetchStatus = async (account:any) => {
    try {
        const response = await account?.callContract({
          contractAddress: "0x626b14c4131c6019c80edeea6225f97ed46863e8e0c7dbc9cc8e1e10f450883",
          entrypoint: "get_timestamp_based_status_with_address",
          calldata: [String(account?.address)],
        });
        return hexToDecimal(response);
      } catch (err) {
        console.log(err)
      }
};

export { fetchStatus };
