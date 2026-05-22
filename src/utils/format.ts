export const formatNumber = (value: number, _unit?: 'MWh' | '€'): string => {
  const formatted = value.toLocaleString('de-DE', { maximumFractionDigits: 0 });
  return formatted;
};

export const formatPrice = (value: number): string => {
  return value.toFixed(2).replace('.', ',');
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};
