import { tokens } from '../tokens';

const Card = ({ children, selected = false, onClick, style = {} }) => (
  <div
    onClick={onClick}
    style={{
      backgroundColor: tokens.colors.white,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.lg,
      cursor: onClick ? 'pointer' : 'default',
      border: selected ? `2px solid ${tokens.colors.sage}` : `1px solid ${tokens.colors.sand}`,
      boxShadow: selected ? tokens.shadow.md : tokens.shadow.sm,
      transition: 'all 0.2s ease',
      ...style,
    }}
  >
    {children}
  </div>
);

export default Card;
