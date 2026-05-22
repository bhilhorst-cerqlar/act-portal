import { useState } from 'react';
import type { CertFilter, TimePeriod } from '../types';
import { entities } from '../data/mockData';
import EntitySection from '../components/Dashboard/EntitySection';

const certFilters: CertFilter[] = ['All', 'GoO', 'I-REC', 'REC'];
const timePeriods: TimePeriod[] = ['All time', '2026YTD', '2025', '2024'];

const Dashboard = () => {
  const [activeCert, setActiveCert] = useState<CertFilter>('All');
  const [activePeriod, setActivePeriod] = useState<TimePeriod>('All time');

  const pillBase: React.CSSProperties = {
    padding: '6px 14px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
  };

  return (
    <div>
      {/* Top bar */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e2e2e2',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'nowrap',
        overflowX: 'auto',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#3c4950', margin: 0 }}>
          Dashboard
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'nowrap', flexShrink: 0 }}>
          {/* Cert type pills */}
          <div style={{ display: 'flex', background: '#f5f7fa', borderRadius: 24, padding: 3, gap: 2 }}>
            {certFilters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveCert(f)}
                style={{
                  ...pillBase,
                  background: activeCert === f ? '#1571f1' : 'transparent',
                  color: activeCert === f ? '#fff' : '#50616a',
                  boxShadow: activeCert === f ? '0 1px 4px rgba(21,113,241,0.3)' : 'none',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <div style={{ width: 1, height: 24, background: '#e2e2e2' }} />

          {/* Time period pills */}
          <div style={{ display: 'flex', gap: 4 }}>
            {timePeriods.map((p) => (
              <button
                key={p}
                onClick={() => setActivePeriod(p)}
                style={{
                  ...pillBase,
                  background: activePeriod === p ? '#fff' : 'transparent',
                  color: activePeriod === p ? '#1571f1' : '#50616a',
                  border: activePeriod === p ? '1px solid #1571f1' : '1px solid transparent',
                  boxShadow: activePeriod === p ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <div style={{ width: 1, height: 24, background: '#e2e2e2' }} />

          {/* Watchlist */}
          <button style={{
            ...pillBase,
            display: 'flex', alignItems: 'center', gap: 6,
            border: '1px solid #e2e2e2', background: '#fff', color: '#50616a',
          }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1l1.545 3.09L11.5 4.636l-2.5 2.41.59 3.454L6.5 8.75l-3.09 1.75.59-3.454-2.5-2.41 3.455-.545L6.5 1z"
                stroke="#c9a227" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
            </svg>
            Watchlist
          </button>

          {/* Settings */}
          <button style={{
            width: 34, height: 34, borderRadius: 6, border: '1px solid #e2e2e2',
            background: '#fff', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: '#667a85',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M8 1.5v1.2M8 13.3v1.2M1.5 8h1.2M13.3 8h1.2M3.4 3.4l.85.85M11.75 11.75l.85.85M3.4 12.6l.85-.85M11.75 4.25l.85-.85"
                stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Entity rows */}
      <div style={{ padding: '28px 32px' }}>
        {entities.map((entity) => (
          <EntitySection
            key={entity.name}
            entity={entity}
            activeCertFilter={activeCert}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
