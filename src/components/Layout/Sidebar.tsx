import { NavLink, useLocation } from 'react-router-dom';
import actLogo from '../../assets/act_logo.png';

const ACTLogo = () => (
  <img src={actLogo} alt="ACT Group" style={{ height: 32, width: 'auto', display: 'block' }} />
);

const navItems = [
  {
    to: '/',
    label: 'Dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
        <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
        <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    to: '/trades',
    label: 'Trades',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside
      className="fixed left-0 top-0 h-full flex flex-col"
      style={{
        width: 220,
        background: '#ffffff',
        borderRight: '1px solid #e2e2e2',
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '20px 16px 8px' }}>
        <ACTLogo />
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: '#919191',
            textTransform: 'uppercase',
            marginTop: 4,
            paddingLeft: 2,
          }}
        >
          Customer Portal
        </div>
      </div>

      <div style={{ borderBottom: '1px solid #e2e2e2', margin: '12px 0' }} />

      {/* Nav */}
      <nav className="flex-1" style={{ padding: '0 8px' }}>
        {navItems.map((item) => {
          const isActive =
            item.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 6,
                marginBottom: 2,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#1571f1' : '#50616a',
                background: isActive ? '#eef3fd' : 'transparent',
                borderLeft: isActive ? '3px solid #1571f1' : '3px solid transparent',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ color: isActive ? '#1571f1' : '#919191', flexShrink: 0 }}>
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ borderTop: '1px solid #e2e2e2', padding: '12px 8px' }}>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            padding: '9px 12px',
            borderRadius: 6,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: 14,
            color: '#50616a',
            marginBottom: 4,
          }}
        >
          <span style={{ color: '#919191' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 7v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8" cy="5" r="0.75" fill="currentColor" />
            </svg>
          </span>
          Help
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 12px',
            borderRadius: 6,
            background: '#f5f7fa',
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: '#1571f1',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            SA
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#3c4950', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Siemens AG
            </div>
            <div style={{ fontSize: 11, color: '#919191' }}>Administrator</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
