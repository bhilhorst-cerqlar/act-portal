import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import type { Entity, MonthlyPoint } from '../../types';

interface EntityChartProps {
  entity: Entity;
  data: MonthlyPoint[];
}

// SVG IDs must not contain spaces or special chars
const toId = (name: string) => name.replace(/[^a-z0-9]/gi, '_');

const formatMwh = (v: number) =>
  v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v);

const formatEur = (v: number) =>
  v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e2e2',
      borderRadius: 8,
      padding: '10px 14px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      fontSize: 13,
    }}>
      <div style={{ fontWeight: 600, color: '#3c4950', marginBottom: 6 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
          <span style={{ color: '#667a85' }}>{p.name}:</span>
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

const EntityChart = ({ entity, data }: EntityChartProps) => {
  const id = toId(entity.name);
  const mwhGradId = `mwh_${id}`;
  const eurGradId  = `eur_${id}`;

  return (
  <div style={{ marginBottom: 32 }}>
    <h2 style={{ fontSize: 16, fontWeight: 600, color: '#3c4950', marginBottom: 16 }}>
      {entity.name}
    </h2>
    <div style={{
      background: '#fff',
      borderRadius: 12,
      border: '1px solid #e2e2e2',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      padding: '20px 24px 12px',
    }}>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={mwhGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#4ECDC4" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id={eurGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#FF6B9D" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#FF6B9D" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2e2e2"
            vertical={false}
          />

          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#919191' }}
            axisLine={false}
            tickLine={false}
            interval={2}
          />

          {/* Left axis — MWh */}
          <YAxis
            yAxisId="left"
            tickFormatter={formatMwh}
            tick={{ fontSize: 11, fill: '#4ECDC4' }}
            axisLine={false}
            tickLine={false}
            width={40}
          />

          {/* Right axis — € */}
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={formatEur}
            tick={{ fontSize: 11, fill: '#FF6B9D' }}
            axisLine={false}
            tickLine={false}
            width={44}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ fontSize: 12, color: '#667a85' }}>
                {value === 'mwh' ? 'Volume (MWh)' : 'Value (€)'}
              </span>
            )}
            wrapperStyle={{ paddingTop: 8 }}
          />

          <Area
            yAxisId="left"
            type="monotone"
            dataKey="mwh"
            name="mwh"
            stroke="#4ECDC4"
            strokeWidth={2}
            fill={`url(#${mwhGradId})`}
            dot={{ r: 3, fill: '#fff', stroke: '#4ECDC4', strokeWidth: 2 }}
            activeDot={{ r: 5, fill: '#fff', stroke: '#4ECDC4', strokeWidth: 2 }}
          />

          <Area
            yAxisId="right"
            type="monotone"
            dataKey="eur"
            name="eur"
            stroke="#FF6B9D"
            strokeWidth={2}
            fill={`url(#${eurGradId})`}
            dot={{ r: 3, fill: '#fff', stroke: '#FF6B9D', strokeWidth: 2 }}
            activeDot={{ r: 5, fill: '#fff', stroke: '#FF6B9D', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
  );
};

export default EntityChart;
