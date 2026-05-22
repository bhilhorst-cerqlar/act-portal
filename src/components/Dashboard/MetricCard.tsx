import { Link } from 'react-router-dom';
import { formatNumber } from '../../utils/format';

interface MetricCardProps {
  label: 'TARGET' | 'CONTRACTED' | 'PAID' | 'PAYABLE';
  value: number;
  unit: 'MWh' | '€';
  to: string;
}

const cardConfig = {
  TARGET: {
    bg: '#eef9f5',
    border: '#468d76',
    textColor: '#468d76',
  },
  CONTRACTED: {
    bg: '#eef3fd',
    border: '#1571f1',
    textColor: '#1571f1',
  },
  PAID: {
    bg: '#fdf8ee',
    border: '#c9a227',
    textColor: '#c9a227',
  },
  PAYABLE: {
    bg: '#fdeef0',
    border: '#e05a6b',
    textColor: '#e05a6b',
  },
};

const MetricCard = ({ label, value, unit, to }: MetricCardProps) => {
  const config = cardConfig[label];

  return (
    <Link
      to={to}
      style={{
        textDecoration: 'none',
        display: 'block',
        borderRadius: 12,
      }}
    >
    <div
      className="metric-card"
      style={{
        background: config.bg,
        borderRadius: 12,
        padding: 20,
        borderBottom: `3px solid ${config.border}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        cursor: 'pointer',
        transition: 'box-shadow 0.15s ease, transform 0.15s ease',
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
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: '#50616a',
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: '#3c4950',
            letterSpacing: '-0.5px',
            lineHeight: 1.1,
          }}
        >
          {formatNumber(value, unit)}
        </span>
        <span
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: '#667a85',
          }}
        >
          {unit}
        </span>
      </div>
    </div>
    </Link>
  );
};

export default MetricCard;
