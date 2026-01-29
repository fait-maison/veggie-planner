import { tokens } from '../tokens';

const Header = ({ currentPage, setCurrentPage }) => {
  const navItems = ['Planning', 'Recettes', 'Courses', 'Enseignes'];

  return (
    <header style={{
      backgroundColor: tokens.colors.white,
      borderBottom: `1px solid ${tokens.colors.sand}`,
      padding: `${tokens.spacing.md} ${tokens.spacing.xl}`,
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo et titre */}
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.md }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: tokens.colors.sage,
            borderRadius: tokens.radius.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: '20px' }}>🌱</span>
          </div>
          <span style={{
            fontSize: '20px',
            fontWeight: '600',
            color: tokens.colors.bark,
            letterSpacing: '-0.5px',
          }}>
            Veggie Planner
          </span>
        </div>
        
        {/* Navigation */}
        <nav style={{ display: 'flex', gap: tokens.spacing.xs }}>
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setCurrentPage && setCurrentPage(item)}
              style={{
                padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                backgroundColor: currentPage === item ? tokens.colors.sageLight : 'transparent',
                color: currentPage === item ? tokens.colors.sageDark : tokens.colors.gray600,
                border: 'none',
                borderRadius: tokens.radius.sm,
                fontSize: '14px',
                fontWeight: currentPage === item ? '500' : '400',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
