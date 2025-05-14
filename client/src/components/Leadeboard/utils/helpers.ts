import { addAddressPadding } from "starknet";
import type { Beast, Player } from '../../../types/components';

export const isUserRow = (userAddress: string, address: string): boolean => 
  userAddress ? addAddressPadding(address) === userAddress : false;

export const findPlayerBeast = (
  allBeasts: Beast[], 
  playerAddress: string
): Beast | null => {
  const beast = allBeasts.find(beast => 
    addAddressPadding(beast.player) === addAddressPadding(playerAddress)
  );
  return beast || null;
};

export const sortBeastsByAge = (beasts: Beast[]): Beast[] => {
  return [...beasts]
    .map(beast => ({
      ...beast,
      userName: beast.userName || '',
      name: beast.name || undefined
    }))
    .sort((a, b) => {
      const ageDiff = (b?.age || 0) - (a?.age || 0);
      if (ageDiff !== 0) return ageDiff;
      return parseInt(a?.birth_date || '0', 16) - parseInt(b?.birth_date || '0', 16);
    });
};

export const sortPlayersByPoints = (players: Player[]): Player[] => {
  return [...players]
    .map(player => ({
      ...player,
      userName: player.userName || undefined
    }))
    .sort((a, b) => (b?.total_points || 0) - (a?.total_points || 0));
}; 