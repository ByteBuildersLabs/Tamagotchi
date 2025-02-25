import { useAccount } from '@starknet-react/core';
import { useState, useEffect } from 'react';

function hexToDecimal(hexArray: string[] | undefined) {
  if (!hexArray) return 
  return hexArray.map(hexString => parseInt(hexString, 16));
}

export const useBeastsStatus = () => {
  const { account } = useAccount();
  const [beastStatus, setStatus] = useState<any>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await account?.callContract({
          contractAddress: "0x535446c53848f4d19ea9b71d4d9215f646b0696c7fb75dd055533bbfc3bc579",
          entrypoint: "get_timestamp_based_status_with_address",
          calldata: [String(account?.address)],
        });
        setStatus(hexToDecimal(response));
      } catch (err) {
        console.log(err)
      }
    };

    fetchStatus();
  }, [account]);

 

  return { beastStatus };
};
