function hexToDecimalArray(hexArray: string[] | undefined) {
  if (!hexArray) return 
  return hexArray.map(hexString => parseInt(hexString, 16));
}

const getBirthDate = (hexBirthDate:any) => {
  const birthDate = parseInt(String(hexBirthDate), 16)
  const transformedDate = new Date(birthDate * 1000);
  return {
    year: transformedDate.getUTCFullYear(),
    month: transformedDate.getUTCMonth() + 1,
    day: transformedDate.getUTCDate(),
    hours: transformedDate.getUTCHours(),
    minutes: transformedDate.getUTCMinutes(),
    seconds: transformedDate.getUTCSeconds(),
    timezone: "GMT-0600 (hora estándar central)"
  };
}

const fetchStatus = async (account:any) => {
    try {
        const response = await account?.callContract({
          contractAddress: "0x1dbf35a77144221e1c08812e06e000376b209cf8cc5bcdb4b2fba3fce59ef12",
          entrypoint: "get_timestamp_based_status_with_address",
          calldata: [String(account?.address)],
        });
        return hexToDecimalArray(response);
      } catch (err) {
        console.log(err)
      }
};

export { fetchStatus, getBirthDate };
