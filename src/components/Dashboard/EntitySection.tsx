import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { Link } from 'react-router-dom';
import type { Entity, MonthlyPoint } from '../../types';
import { formatNumber } from '../../utils/format';
import { entityChartData } from '../../data/mockData';
import RFQModal from './RFQModal';

interface EntitySectionProps {
  entity: Entity;
  activeCertFilter: string;
}

// ── Metric card (compact 2×2 variant) ────────────────────────────────────────

const cardConfig = {
  TARGET:     { bg: '#eef9f5', border: '#468d76' },
  CONTRACTED: { bg: '#eef3fd', border: '#1571f1' },
  PAID:       { bg: '#fdf8ee', border: '#c9a227' },
  PAYABLE:    { bg: '#fdeef0', border: '#e05a6b' },
};

interface CardProps {
  label: 'TARGET' | 'CONTRACTED' | 'PAID' | 'PAYABLE';
  value: number;
  unit: 'MWh' | '€';
  to: string;
}

const MetricCard = ({ label, value, unit, to }: CardProps) => {
  const cfg = cardConfig[label];
  return (
    <Link to={to} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{
          background: cfg.bg,
          borderRadius: 10,
          padding: '14px 16px',
          borderBottom: `3px solid ${cfg.border}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          cursor: 'pointer',
          transition: 'box-shadow 0.15s ease, transform 0.15s ease',
          height: '100%',
          boxSizing: 'border-box',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#50616a', marginBottom: 6 }}>
          {label}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
          <span style={{ fontSize: 26, fontWeight: 600, color: '#3c4950', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
            {formatNumber(value)}
          </span>
          <span style={{ fontSize: 13, color: '#667a85' }}>{unit}</span>
        </div>
      </div>
    </Link>
  );
};

// ── Chart tooltip ─────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e2e2', borderRadius: 8,
      padding: '10px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 13,
    }}>
      <div style={{ fontWeight: 600, color: '#3c4950', marginBottom: 6 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
          <span style={{ color: '#667a85' }}>{p.dataKey === 'mwh' ? 'Volume' : 'Value'}:</span>
          <span style={{ fontWeight: 600, color: '#3c4950' }}>
            {p.dataKey === 'mwh'
              ? `${p.value.toLocaleString('de-DE')} MWh`
              : `€ ${p.value.toLocaleString('de-DE')}`}
          </span>
        </div>
      ))}
    </div>
  );
};

const toId = (name: string) => name.replace(/[^a-z0-9]/gi, '_');

// ── Entity row ────────────────────────────────────────────────────────────────

const EntitySection = ({ entity }: EntitySectionProps) => {
  const base  = `/trades?entity=${encodeURIComponent(entity.name)}`;
  const id    = toId(entity.name);
  const data: MonthlyPoint[] = entityChartData[entity.name] ?? [];
  const [rfqOpen, setRfqOpen] = useState(false);

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#3c4950', margin: 0 }}>
          {entity.name}
        </h2>
        <button
          onClick={() => setRfqOpen(true)}
          style={{
            padding: '6px 14px',
            borderRadius: 7,
            border: '1px solid #dde3ea',
            background: '#fff',
            color: '#3c4950',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'border-color 0.15s ease, background 0.15s ease',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#1571f1';
            (e.currentTarget as HTMLButtonElement).style.background = '#f5f8ff';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#dde3ea';
            (e.currentTarget as HTMLButtonElement).style.background = '#fff';
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          Create RFQ
        </button>
      </div>
      {rfqOpen && <RFQModal entityName={entity.name} onClose={() => setRfqOpen(false)} />}

      <div style={{
        display: 'flex',
        gap: 16,
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #e2e2e2',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        padding: 16,
        alignItems: 'stretch',
      }}>

        {/* ── 3×1 card column ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          width: 200,
          flexShrink: 0,
        }}>
          <MetricCard label="CONTRACTED" value={entity.contracted.value} unit={entity.contracted.unit} to={base} />
          <MetricCard label="PAID"       value={entity.paid.value}       unit={entity.paid.unit}       to={`${base}&status=Delivered`} />
          <MetricCard label="PAYABLE"    value={entity.payable.value}    unit={entity.payable.unit}    to={`${base}&status=Not+Delivered`} />
        </div>

        {/* ── Divider ── */}
        <div style={{ width: 1, background: '#e2e2e2', flexShrink: 0 }} />

        {/* ── Area chart ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={180}>
            <AreaChart data={data} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id={`mwh_${id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#4ECDC4" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id={`eur_${id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#FF6B9D" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#FF6B9D" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#efefef" vertical={false} />

              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#aaa' }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />

              <YAxis
                yAxisId="left"
                tickFormatter={v => v >= 1000 ? `${Math.round(v / 1000)}k` : String(v)}
                tick={{ fontSize: 10, fill: '#4ECDC4' }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={v => v >= 1000 ? `${Math.round(v / 1000)}k` : String(v)}
                tick={{ fontSize: 10, fill: '#FF6B9D' }}
                axisLine={false}
                tickLine={false}
                width={36}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                yAxisId="left"
                type="monotone"
                dataKey="mwh"
                stroke="#4ECDC4"
                strokeWidth={2}
                fill={`url(#mwh_${id})`}
                dot={{ r: 3, fill: '#fff', stroke: '#4ECDC4', strokeWidth: 1.5 }}
                activeDot={{ r: 4.5, fill: '#fff', stroke: '#4ECDC4', strokeWidth: 2 }}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="eur"
                stroke="#FF6B9D"
                strokeWidth={2}
                fill={`url(#eur_${id})`}
                dot={{ r: 3, fill: '#fff', stroke: '#FF6B9D', strokeWidth: 1.5 }}
                activeDot={{ r: 4.5, fill: '#fff', stroke: '#FF6B9D', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default EntitySection;
