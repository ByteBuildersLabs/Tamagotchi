const hexToDecimalArray = (hexArray: string[] | undefined): number[] | undefined => {
  if (!hexArray) return undefined;
  return hexArray.map(hexString => parseInt(hexString, 16));
};

export default hexToDecimalArray; 