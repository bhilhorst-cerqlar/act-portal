import type { Entity, Trade, MonthlyPoint } from '../types';

// ── Entities (top 5 Siemens entities by contracted MWh) ──────────────────────
// Source: prd_export_act_only.json — ACT SELL trades → customer BUY perspective
// contracted = total obligation MWh
// paid       = total € value of DELIVERED obligations
// payable    = total € value of NOT_DELIVERED obligations

export const entities: Entity[] = [
  {
    name: 'Siemens Energy Global GmbH & Co. KG',
    target:     { value: 291326, unit: 'MWh' },
    contracted: { value: 291326, unit: 'MWh' },
    paid:       { value: 554257, unit: '€' },
    payable:    { value: 543400, unit: '€' },
  },
  {
    name: 'Siemens Aktiengesellschaft',
    target:     { value: 11795, unit: 'MWh' },
    contracted: { value: 11795, unit: 'MWh' },
    paid:       { value: 20641, unit: '€' },
    payable:    { value: 0,     unit: '€' },
  },
  {
    name: 'Siemens Healthcare Diagnostics',
    target:     { value: 9140, unit: 'MWh' },
    contracted: { value: 9140, unit: 'MWh' },
    paid:       { value: 15995, unit: '€' },
    payable:    { value: 0,    unit: '€' },
  },
  {
    name: 'Siemens Zrt.',
    target:     { value: 7952, unit: 'MWh' },
    contracted: { value: 7952, unit: 'MWh' },
    paid:       { value: 12922, unit: '€' },
    payable:    { value: 0,    unit: '€' },
  },
  {
    name: 'Siemens Healthineers AG',
    target:     { value: 4962, unit: 'MWh' },
    contracted: { value: 4962, unit: 'MWh' },
    paid:       { value: 8684, unit: '€' },
    payable:    { value: 0,   unit: '€' },
  },
];

// ── Monthly chart data (Jan 2024 – Dec 2026, 36 months) ──────────────────────
// Volume and value are spread evenly across each trade's production period.

type MonthMap = Record<string, { mwh: number; eur: number }>;

function buildMonthMap(): MonthMap {
  const map: MonthMap = {};
  for (let y = 2024; y <= 2026; y++)
    for (let m = 1; m <= 12; m++)
      map[`${y}-${String(m).padStart(2, '0')}`] = { mwh: 0, eur: 0 };
  return map;
}

function addToMap(map: MonthMap, from: string, to: string, mwh: number, eur: number) {
  const [fy, fm] = from.split('-').map(Number);
  const [ty, tm] = to.split('-').map(Number);
  const months: [number, number][] = [];
  let y = fy, m = fm;
  while (y < ty || (y === ty && m <= tm)) {
    months.push([y, m]);
    if (++m > 12) { m = 1; y++; }
  }
  const valid = months.filter(([yr]) => yr >= 2024 && yr <= 2026);
  if (!valid.length) return;
  const mwhPM = mwh / months.length; // spread over full production period
  const eurPM = eur / months.length;
  for (const [yr, mo] of valid) {
    const key = `${yr}-${String(mo).padStart(2, '0')}`;
    if (map[key]) { map[key].mwh += mwhPM; map[key].eur += eurPM; }
  }
}

const MONTH_LABELS: Record<string, string> = {
  '01':'Jan','02':'Feb','03':'Mar','04':'Apr','05':'May','06':'Jun',
  '07':'Jul','08':'Aug','09':'Sep','10':'Oct','11':'Nov','12':'Dec',
};
function mapToSeries(map: MonthMap): MonthlyPoint[] {
  return Object.entries(map).map(([key, v]) => {
    const [y, mo] = key.split('-');
    return {
      month: `${MONTH_LABELS[mo]} ${y.slice(2)}`,
      mwh:   Math.round(v.mwh),
      eur:   Math.round(v.eur),
    };
  });
}

// Siemens Energy Global GmbH & Co. KG
const energyMap = buildMonthMap();
addToMap(energyMap, '2024-01', '2024-12',   3486,  12027);  // IBDF4Q – DELIVERED
addToMap(energyMap, '2024-01', '2024-12',   1840,   5980);  // VSCS2S – DELIVERED
addToMap(energyMap, '2025-01', '2025-12', 143000, 536250);  // QJ6CI7 – DELIVERED
addToMap(energyMap, '2026-01', '2026-12', 143000, 543400);  // 65AWEJ – NOT DELIVERED

// Siemens Aktiengesellschaft
const aktMap = buildMonthMap();
addToMap(aktMap, '2024-09', '2025-12', 11795, 20641);       // 11IULF – DELIVERED

// Siemens Healthcare Diagnostics
const hcMap = buildMonthMap();
addToMap(hcMap, '2024-10', '2025-12',  9140, 15995);        // N9SU8Y – DELIVERED

// Siemens Zrt.
const zrtMap = buildMonthMap();
addToMap(zrtMap, '2025-08', '2025-12', 3426,  5996);        // 2W77QX – DELIVERED
addToMap(zrtMap, '2025-07', '2025-07', 2538,  4442);        // 3LEVDA – DELIVERED
addToMap(zrtMap, '2025-06', '2025-06', 1801,  2251);        // 6I858M – DELIVERED
addToMap(zrtMap, '2025-07', '2025-07',  187,   234);        // MCJUMO – DELIVERED

// Siemens Healthineers AG
const heiMap = buildMonthMap();
addToMap(heiMap, '2024-09', '2025-12', 4962, 8684);         // KD3GDU – DELIVERED

export const entityChartData: Record<string, MonthlyPoint[]> = {
  'Siemens Energy Global GmbH & Co. KG': mapToSeries(energyMap),
  'Siemens Aktiengesellschaft':           mapToSeries(aktMap),
  'Siemens Healthcare Diagnostics':       mapToSeries(hcMap),
  'Siemens Zrt.':                         mapToSeries(zrtMap),
  'Siemens Healthineers AG':              mapToSeries(heiMap),
};

// ── Trades ────────────────────────────────────────────────────────────────────
// All trades are BUY from Siemens' perspective (ACT side = SELL).
// deliveryPeriod = obligation production range (formatted from obligation_production_from/to)
// status         = delivery_state mapped to 'Delivered' | 'Not Delivered'
// country        = go_issuing_country (single) or 'EU Mix' (multi-country)

export const trades: Trade[] = [
  {
    id: 'QJ6CI7',
    entity: 'Siemens Energy Global GmbH & Co. KG',
    certType: 'GoO',
    technology: ['T01', 'T02'],
    volume: 143000,
    price: 3.75,
    tradeDate: '2024-01-31',
    deliveryPeriod: 'Jan 2025 – Dec 2025',
    status: 'Delivered',
    country: 'EU Mix',
    countryFlag: '🇪🇺',
  },
  {
    id: '65AWEJ',
    entity: 'Siemens Energy Global GmbH & Co. KG',
    certType: 'GoO',
    technology: ['T01', 'T02'],
    volume: 143000,
    price: 3.80,
    tradeDate: '2024-02-01',
    deliveryPeriod: 'Jan 2026 – Dec 2026',
    status: 'Not Delivered',
    country: 'EU Mix',
    countryFlag: '🇪🇺',
  },
  {
    id: 'IBDF4Q',
    entity: 'Siemens Energy Global GmbH & Co. KG',
    certType: 'GoO',
    technology: ['T01', 'T02'],
    volume: 3486,
    price: 3.45,
    tradeDate: '2025-10-24',
    deliveryPeriod: 'Jan 2024 – Dec 2024',
    status: 'Delivered',
    country: 'EU Mix',
    countryFlag: '🇪🇺',
  },
  {
    id: 'VSCS2S',
    entity: 'Siemens Energy Global GmbH & Co. KG',
    certType: 'GoO',
    technology: ['T01', 'T02'],
    volume: 1840,
    price: 3.25,
    tradeDate: '2025-10-24',
    deliveryPeriod: 'Jan 2024 – Dec 2024',
    status: 'Delivered',
    country: 'EU Mix',
    countryFlag: '🇪🇺',
  },
  {
    id: '11IULF',
    entity: 'Siemens Aktiengesellschaft',
    certType: 'GoO',
    technology: ['T01', 'T02'],
    volume: 11795,
    price: 1.75,
    tradeDate: '2025-09-11',
    deliveryPeriod: 'Sep 2024 – Dec 2025',
    status: 'Delivered',
    country: 'EU Mix',
    countryFlag: '🇪🇺',
  },
  {
    id: 'N9SU8Y',
    entity: 'Siemens Healthcare Diagnostics',
    certType: 'GoO',
    technology: ['T01', 'T02'],
    volume: 9140,
    price: 1.75,
    tradeDate: '2025-10-02',
    deliveryPeriod: 'Oct 2024 – Dec 2025',
    status: 'Delivered',
    country: 'EU Mix',
    countryFlag: '🇪🇺',
  },
  {
    id: 'KD3GDU',
    entity: 'Siemens Healthineers AG',
    certType: 'GoO',
    technology: ['T01', 'T02'],
    volume: 4962,
    price: 1.75,
    tradeDate: '2025-09-11',
    deliveryPeriod: 'Sep 2024 – Dec 2025',
    status: 'Delivered',
    country: 'EU Mix',
    countryFlag: '🇪🇺',
  },
  {
    id: '2W77QX',
    entity: 'Siemens Zrt.',
    certType: 'GoO',
    technology: ['T01', 'T02'],
    volume: 3426,
    price: 1.75,
    tradeDate: '2026-02-18',
    deliveryPeriod: 'Aug 2025 – Dec 2025',
    status: 'Delivered',
    country: 'Hungary',
    countryFlag: '🇭🇺',
  },
  {
    id: '3LEVDA',
    entity: 'Siemens Zrt.',
    certType: 'GoO',
    technology: ['T01', 'T02'],
    volume: 2538,
    price: 1.75,
    tradeDate: '2026-02-18',
    deliveryPeriod: 'Jul 2025 – Jul 2025',
    status: 'Delivered',
    country: 'Hungary',
    countryFlag: '🇭🇺',
  },
  {
    id: '6I858M',
    entity: 'Siemens Zrt.',
    certType: 'GoO',
    technology: ['T01', 'T02'],
    volume: 1801,
    price: 1.25,
    tradeDate: '2026-02-18',
    deliveryPeriod: 'Jun 2025 – Jun 2025',
    status: 'Delivered',
    country: 'Hungary',
    countryFlag: '🇭🇺',
  },
  {
    id: 'MCJUMO',
    entity: 'Siemens Zrt.',
    certType: 'GoO',
    technology: ['T01', 'T02'],
    volume: 187,
    price: 1.25,
    tradeDate: '2026-02-18',
    deliveryPeriod: 'Jul 2025 – Jul 2025',
    status: 'Delivered',
    country: 'Hungary',
    countryFlag: '🇭🇺',
  },
];
