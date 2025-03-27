function hexToDecimalArray(hexArray: string[] | undefined) {
  if (!hexArray) return 
  return hexArray.map(hexString => parseInt(hexString, 16));
}

const getBirthDate = (hexBirthDate:any) => {
  const birthDate = parseInt(String(hexBirthDate), 16);
  const transformedDate = new Date(birthDate * 1000);
  const localTimeOffset = transformedDate.getTimezoneOffset() * 60000;
  const localDate = new Date(transformedDate.getTime() - localTimeOffset);
  return {
    year: localDate.getUTCFullYear(),
    month: localDate.getUTCMonth() + 1,
    day: localDate.getUTCDate(),
    hours: localDate.getUTCHours(),
    minutes: localDate.getUTCMinutes(),
    seconds: localDate.getUTCSeconds(),
    timezone: "GMT-0600 (hora estándar central)"
  };
}

const fetchStatus = async (account:any) => {
    try {
        const response = await account?.callContract({
          contractAddress: "0x79f55c679bb76b18e8e12f0b0f490de3079101eea8b5785171bd76f1af12e24",
          entrypoint: "get_timestamp_based_status_with_address",
          calldata: [String(account?.address)],
        });
        return hexToDecimalArray(response);
      } catch (err) {
        console.log(err)
      }
};

export { fetchStatus, getBirthDate };
