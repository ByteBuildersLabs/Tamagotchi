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
          contractAddress: "0x58b7067aba23d176d96cde4be201d3dc5c5bddd0d1b4a665584d206846a165d",
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
        contractAddress: "0x58b7067aba23d176d96cde4be201d3dc5c5bddd0d1b4a665584d206846a165d",
        entrypoint: "get_beast_age_with_address",
        calldata: [String(account?.address)],
      });
      return hexToDecimalArray(response);
    } catch (err) {
      console.log(err)
    }
};

const getDayPeriod = () => {
  const currentHours = new Date().getHours();
  if (currentHours >= 4 && currentHours < 7) return "sunrise";
  if (currentHours >= 7 && currentHours < 16) return "day";
  if (currentHours >= 16 && currentHours < 19) return "sunset";
  return "night";
};

export { fetchStatus, fetchAge, getBirthDate, getDayPeriod };
