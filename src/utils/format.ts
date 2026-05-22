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

// AIB EECS GoO technology code descriptions
export const TECHNOLOGY_LABELS: Record<string, string> = {
  T01: 'Wind',
  T02: 'Solar / PV',
  T03: 'Geothermal',
  T04: 'Ocean',
  T05: 'Hydro',
  T06: 'Biomass & Biogas',
  T07: 'Other',
};
