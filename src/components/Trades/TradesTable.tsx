import { useState, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { Trade, CertType, TradeStatus } from '../../types';
import { formatNumber, formatPrice, formatDate, TECHNOLOGY_LABELS } from '../../utils/format';
import { trades, entities } from '../../data/mockData';

type SortKey = Exclude<keyof Trade, 'technology'> | 'totalValue';
type SortDir = 'asc' | 'desc';

const certBadge: Record<CertType, { bg: string; color: string }> = {
  GoO: { bg: '#eef3fd', color: '#1571f1' },
  'I-REC': { bg: '#f0eeff', color: '#6b4ef6' },
  REC: { bg: '#eef9f5', color: '#468d76' },
};

const statusBadge: Record<TradeStatus, { bg: string; color: string }> = {
  'Delivered':     { bg: '#eef9f5', color: '#468d76' },
  'Not Delivered': { bg: '#fdf8ee', color: '#c9a227' },
};

const Badge = ({ label, style }: { label: string; style: { bg: string; color: string } }) => (
  <span
    style={{
      display: 'inline-block',
      padding: '3px 8px',
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 600,
      background: style.bg,
      color: style.color,
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </span>
);

const PAGE_SIZE = 25;

const SortIcon = ({ active, dir }: { active: boolean; dir: SortDir }) => (
  <span style={{ marginLeft: 4, color: active ? '#1571f1' : '#c0c0c0', fontSize: 11 }}>
    {active ? (dir === 'asc' ? '↑' : '↓') : '↕'}
  </span>
);

const TradesTable = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paramEntity = searchParams.get('entity') ?? '';
  const paramStatus = (searchParams.get('status') ?? 'All') as 'All' | TradeStatus;

  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState<string>(paramEntity);
  const [certFilter, setCertFilter] = useState<'All' | CertType>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | TradeStatus>(paramStatus);
  const [sortKey, setSortKey] = useState<SortKey>('tradeDate');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);

  const hasActiveFilters = entityFilter !== '' || certFilter !== 'All' || statusFilter !== 'All' || search.trim() !== '';

  const clearFilters = useCallback(() => {
    setSearch('');
    setEntityFilter('');
    setCertFilter('All');
    setStatusFilter('All');
    setPage(1);
    navigate('/trades', { replace: true });
  }, [navigate]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  const filtered = useMemo(() => {
    let result = trades;
    if (entityFilter) result = result.filter((t) => t.entity === entityFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) => t.id.toLowerCase().includes(q) || t.entity.toLowerCase().includes(q)
      );
    }
    if (certFilter !== 'All') result = result.filter((t) => t.certType === certFilter);
    if (statusFilter !== 'All') result = result.filter((t) => t.status === statusFilter);

    result = [...result].sort((a, b) => {
      let av: string | number;
      let bv: string | number;
      if (sortKey === 'totalValue') {
        av = a.volume * a.price;
        bv = b.volume * b.price;
      } else {
        av = a[sortKey as keyof Trade] as string | number;
        bv = b[sortKey as keyof Trade] as string | number;
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [search, entityFilter, certFilter, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const thStyle = (_key: SortKey): React.CSSProperties => ({
    padding: '10px 14px',
    textAlign: 'left',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: '#667a85',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    borderBottom: '2px solid #e2e2e2',
    background: '#f5f7fa',
  });

  const inputStyle: React.CSSProperties = {
    border: '1px solid #e2e2e2',
    borderRadius: 6,
    padding: '7px 12px',
    fontSize: 13,
    color: '#3c4950',
    background: '#fff',
    outline: 'none',
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: 'pointer',
    appearance: 'none',
    paddingRight: 28,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23919191' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
  };

  return (
    <div>
      {/* Active-filter breadcrumb + clear button */}
      {hasActiveFilters && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          <a
            href="/"
            style={{ fontSize: 13, color: '#1571f1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Dashboard
          </a>
          <span style={{ color: '#c0c0c0', fontSize: 13 }}>›</span>
          {entityFilter && (
            <span style={{ fontSize: 13, padding: '3px 10px', borderRadius: 6, background: '#eef3fd', color: '#1571f1', fontWeight: 500 }}>
              {entityFilter}
            </span>
          )}
          {statusFilter !== 'All' && (
            <span style={{
              fontSize: 13, padding: '3px 10px', borderRadius: 6, fontWeight: 500,
              ...(statusFilter === 'Delivered'
                ? { background: '#eef9f5', color: '#468d76' }
                : { background: '#fdf8ee', color: '#c9a227' }),
            }}>
              {statusFilter}
            </span>
          )}
          {certFilter !== 'All' && (
            <span style={{ fontSize: 13, padding: '3px 10px', borderRadius: 6, background: '#f5f7fa', color: '#50616a', fontWeight: 500 }}>
              {certFilter}
            </span>
          )}
          {search.trim() && (
            <span style={{ fontSize: 13, padding: '3px 10px', borderRadius: 6, background: '#f5f7fa', color: '#50616a', fontWeight: 500 }}>
              "{search.trim()}"
            </span>
          )}

          <button
            onClick={clearFilters}
            style={{
              marginLeft: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '3px 10px',
              borderRadius: 6,
              border: '1px solid #e2e2e2',
              background: '#fff',
              color: '#50616a',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Clear filters
          </button>
        </div>
      )}
      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 280 }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#919191' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10.5 10.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <input
            style={{ ...inputStyle, paddingLeft: 32, width: '100%' }}
            placeholder="Search by ID or entity…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <select
          style={selectStyle}
          value={entityFilter}
          onChange={(e) => { setEntityFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Entities</option>
          {entities.map((e) => (
            <option key={e.name} value={e.name}>{e.name}</option>
          ))}
        </select>

        <select
          style={selectStyle}
          value={certFilter}
          onChange={(e) => { setCertFilter(e.target.value as typeof certFilter); setPage(1); }}
        >
          <option value="All">All Types</option>
          <option value="GoO">GoO</option>
          <option value="I-REC">I-REC</option>
          <option value="REC">REC</option>
        </select>

        <select
          style={selectStyle}
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPage(1); }}
        >
          <option value="All">All Statuses</option>
          <option value="Delivered">Delivered</option>
          <option value="Not Delivered">Not Delivered</option>
        </select>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: '#667a85' }}>
            Showing <strong style={{ color: '#3c4950' }}>{filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}</strong>–<strong style={{ color: '#3c4950' }}>{Math.min(page * PAGE_SIZE, filtered.length)}</strong> of <strong style={{ color: '#3c4950' }}>{filtered.length}</strong> trades
          </span>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              borderRadius: 6,
              border: '1px solid #e2e2e2',
              background: '#fff',
              cursor: 'pointer',
              fontSize: 13,
              color: '#50616a',
              fontWeight: 500,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v10M3 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e2e2', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {(
                  [
                    { key: 'id', label: 'Trade ID' },
                    { key: 'entity', label: 'Entity' },
                    { key: 'certType', label: 'Cert Type' },
                    { key: 'volume', label: 'Volume (MWh)' },
                    { key: 'price', label: 'Price (€/MWh)' },
                    { key: 'totalValue', label: 'Total Value (€)' },
                    { key: 'tradeDate', label: 'Trade Date' },
                    { key: 'deliveryPeriod', label: 'Delivery Period' },
                    { key: 'status', label: 'Status' },
                    { key: 'country', label: 'Country' },
                  ] as { key: SortKey; label: string }[]
                ).map((col) => (
                  <th key={col.key} style={thStyle(col.key)} onClick={() => handleSort(col.key)}>
                    {col.label}
                    <SortIcon active={sortKey === col.key} dir={sortDir} />
                  </th>
                ))}
                <th style={{ ...thStyle('id'), cursor: 'default' }}>Technology</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: 'center', padding: '48px 24px', color: '#919191' }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
                    <div style={{ fontWeight: 500, color: '#50616a', fontSize: 14 }}>No trades found</div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your search or filters</div>
                  </td>
                </tr>
              ) : (
                paginated.map((trade, i) => (
                  <tr
                    key={trade.id}
                    style={{
                      borderBottom: i < paginated.length - 1 ? '1px solid #f0f0f0' : 'none',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f7fa')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '11px 14px', color: '#1571f1', fontWeight: 500, whiteSpace: 'nowrap' }}>
                      {trade.id}
                    </td>
                    <td style={{ padding: '11px 14px', color: '#3c4950', whiteSpace: 'nowrap' }}>
                      {trade.entity}
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      <Badge label={trade.certType} style={certBadge[trade.certType]} />
                    </td>
                    <td style={{ padding: '11px 14px', color: '#3c4950', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {formatNumber(trade.volume, 'MWh')}
                    </td>
                    <td style={{ padding: '11px 14px', color: '#3c4950', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {formatPrice(trade.price)}
                    </td>
                    <td style={{ padding: '11px 14px', color: '#3c4950', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
                      {formatNumber(Math.round(trade.volume * trade.price), '€')}
                    </td>
                    <td style={{ padding: '11px 14px', color: '#50616a', whiteSpace: 'nowrap' }}>
                      {formatDate(trade.tradeDate)}
                    </td>
                    <td style={{ padding: '11px 14px', color: '#50616a', whiteSpace: 'nowrap' }}>
                      {trade.deliveryPeriod}
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      <Badge label={trade.status} style={statusBadge[trade.status]} />
                    </td>
                    <td style={{ padding: '11px 14px', color: '#50616a', whiteSpace: 'nowrap' }}>
                      {trade.countryFlag} {trade.country}
                    </td>
                    <td style={{ padding: '11px 14px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {trade.technology.map((code) => (
                          <span
                            key={code}
                            title={TECHNOLOGY_LABELS[code] ?? code}
                            style={{
                              display: 'inline-block',
                              padding: '2px 7px',
                              borderRadius: 5,
                              fontSize: 11,
                              fontWeight: 600,
                              background: '#f0f4ff',
                              color: '#3a5abf',
                              cursor: 'default',
                              letterSpacing: '0.02em',
                            }}
                          >
                            {code}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderTop: '1px solid #e2e2e2',
              background: '#fafafa',
            }}
          >
            <span style={{ fontSize: 13, color: '#667a85' }}>
              Page {page} of {totalPages}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  border: '1px solid #e2e2e2',
                  background: page === 1 ? '#f5f7fa' : '#fff',
                  color: page === 1 ? '#919191' : '#3c4950',
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                ← Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  border: '1px solid #e2e2e2',
                  background: page === totalPages ? '#f5f7fa' : '#fff',
                  color: page === totalPages ? '#919191' : '#3c4950',
                  cursor: page === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradesTable;
