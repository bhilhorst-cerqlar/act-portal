export interface MetricValue {
  value: number;
  unit: 'MWh' | '€';
}

export interface Entity {
  name: string;
  target: MetricValue;
  contracted: MetricValue;
  paid: MetricValue;
  payable: MetricValue;
}

export type CertType = 'GoO' | 'I-REC' | 'REC';
export type TradeStatus = 'Paid' | 'Payable' | 'Contracted';
export type CertFilter = 'All' | CertType;
export type TimePeriod = 'All time' | '2026YTD' | '2025' | '2024';

export interface MonthlyPoint {
  month: string;
  mwh: number;
  eur: number;
}

export interface Trade {
  id: string;
  entity: string;
  certType: CertType;
  volume: number;
  price: number;
  tradeDate: string;
  deliveryPeriod: string;
  status: TradeStatus;
  country: string;
  countryFlag: string;
}
