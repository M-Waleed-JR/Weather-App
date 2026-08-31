export const getTemperatureColor = (temp) => {
  if (temp > 30) return '#ef4444'; // Red-500
  if (temp > 20) return '#f59e0b'; // Amber-500
  if (temp > 10) return '#10b981'; // Emerald-500
  return '#3b82f6'; // Blue-500
};

export const formatDay = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};
