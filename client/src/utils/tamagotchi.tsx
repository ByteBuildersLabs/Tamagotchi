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
    hours: String(localDate.getUTCHours()).padStart(2, '0'),
    minutes: String(localDate.getUTCMinutes()).padStart(2, '0'),
    seconds: localDate.getUTCSeconds(),
    timezone: "GMT-0600 (hora estándar central)"
  };
}

const fetchStatus = async (account:any) => {
    try {
        const response = await account?.callContract({
          contractAddress: "0x693e68bfee0f06686656e94ed524a080dec35d211a021e08e8481c14096026e",
          entrypoint: "get_timestamp_based_status_with_address",
          calldata: [String(account?.address)],
        });
        return hexToDecimalArray(response);
      } catch (err) {
        console.log(err)
      }
};

const fetchAge = async (account:any) => {
  try {
      const response = await account?.callContract({
        contractAddress: "0x693e68bfee0f06686656e94ed524a080dec35d211a021e08e8481c14096026e",
        entrypoint: "get_beast_age_with_address",
        calldata: [String(account?.address)],
      });
      return hexToDecimalArray(response);
    } catch (err) {
      console.log(err)
    }
};

export { fetchStatus, fetchAge, getBirthDate };
