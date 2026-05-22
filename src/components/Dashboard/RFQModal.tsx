import { useState, useEffect, useRef } from 'react';

interface RFQModalProps {
  entityName: string;
  onClose: () => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: 8,
  border: '1px solid #dde3ea',
  background: '#f0f3f7',
  fontSize: 14,
  color: '#3c4950',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s ease, background 0.15s ease',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 14,
  fontWeight: 600,
  color: '#2c3a42',
  marginBottom: 8,
};

const RFQModal = ({ entityName, onClose }: RFQModalProps) => {
  const [contract, setContract] = useState('');
  const [side, setSide] = useState('');
  const [volume, setVolume] = useState('');
  const [rfqPrice, setRfqPrice] = useState('');
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus first input on open; close on Escape
  useEffect(() => {
    firstInputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to API
    onClose();
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: 'pointer',
    appearance: 'none',
    paddingRight: 36,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23919191' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    color: side ? '#3c4950' : '#9aacb8',
  };

  return (
    /* Backdrop */
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(30, 40, 50, 0.45)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 24,
      }}
    >
      {/* Modal card */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#f5f7fa',
          borderRadius: 16,
          width: '100%',
          maxWidth: 560,
          boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '28px 32px 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1e2d38', letterSpacing: '-0.3px' }}>
              RFQ Details
            </h2>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#9aacb8',
                padding: 4,
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#3c4950')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#9aacb8')}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <p style={{ margin: '0 0 24px', fontSize: 13, color: '#667a85' }}>{entityName}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '0 32px 32px' }}>

          {/* Contract */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Contract</label>
            <input
              ref={firstInputRef}
              type="text"
              value={contract}
              onChange={(e) => setContract(e.target.value)}
              placeholder="e.g. EUROPE_WIND"
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#1571f1';
                e.currentTarget.style.background = '#fff';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#dde3ea';
                e.currentTarget.style.background = '#f0f3f7';
              }}
            />
          </div>

          {/* Buy/Sell + Volume */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>Buy/Sell</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={side}
                  onChange={(e) => setSide(e.target.value)}
                  style={selectStyle}
                >
                  <option value="" disabled hidden>Select side (optional)</option>
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Volume</label>
              <input
                type="number"
                min="0"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder="Optional"
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#1571f1';
                  e.currentTarget.style.background = '#fff';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#dde3ea';
                  e.currentTarget.style.background = '#f0f3f7';
                }}
              />
            </div>
          </div>

          {/* RFQ Price + Current Market Price */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
            <div>
              <label style={labelStyle}>RFQ Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={rfqPrice}
                onChange={(e) => setRfqPrice(e.target.value)}
                placeholder="Optional"
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#1571f1';
                  e.currentTarget.style.background = '#fff';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#dde3ea';
                  e.currentTarget.style.background = '#f0f3f7';
                }}
              />
            </div>
            <div>
              <label style={labelStyle}>Current Market Price</label>
              <input
                type="text"
                value="0.00"
                readOnly
                style={{
                  ...inputStyle,
                  color: '#9aacb8',
                  cursor: 'not-allowed',
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 22px',
                borderRadius: 8,
                border: '1px solid #dde3ea',
                background: '#fff',
                color: '#3c4950',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = '#f5f7fa')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = '#fff')}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 22px',
                borderRadius: 8,
                border: 'none',
                background: '#5b8dee',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = '#1571f1')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = '#5b8dee')}
            >
              Submit RFQ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RFQModal;
