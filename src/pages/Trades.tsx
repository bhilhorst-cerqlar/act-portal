import TradesTable from '../components/Trades/TradesTable';

const Trades = () => (
  <div>
    {/* Top bar */}
    <div
      style={{
        background: '#fff',
        borderBottom: '1px solid #e2e2e2',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 600, color: '#3c4950', margin: 0 }}>
        Trades
      </h1>
    </div>

    <div style={{ padding: '28px 32px' }}>
      <TradesTable />
    </div>
  </div>
);

export default Trades;
