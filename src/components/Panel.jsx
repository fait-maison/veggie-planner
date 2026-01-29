import { tokens } from '../tokens';

const Panel = ({ title, children, action }) => (
  <div style={{
    backgroundColor: tokens.colors.white,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
    border: `1px solid ${tokens.colors.sand}`,
    boxShadow: tokens.shadow.sm,
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: tokens.spacing.md,
    }}>
      <h2 style={{
        fontSize: '16px',
        fontWeight: '600',
        color: tokens.colors.bark,
        margin: 0,
      }}>
        {title}
      </h2>
      {action}
    </div>
    {children}
  </div>
);

export default Panel;
