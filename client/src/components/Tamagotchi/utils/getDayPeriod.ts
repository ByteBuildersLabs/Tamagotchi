const getDayPeriod = (): 'sunrise' | 'day' | 'sunset' | 'night' => {
  const currentHours = new Date().getHours();
  if (currentHours >= 4 && currentHours < 7) return "sunrise";
  if (currentHours >= 7 && currentHours < 16) return "day";
  if (currentHours >= 16 && currentHours < 19) return "sunset";
  return "night";
};

export default getDayPeriod; 