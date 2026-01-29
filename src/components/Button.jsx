import { tokens } from '../tokens';

const Button = ({ children, variant = 'primary', onClick, disabled = false, style = {} }) => {
  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.sm,
    padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
    border: 'none',
    borderRadius: tokens.radius.sm,
    fontSize: '14px',
    fontWeight: '500',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s ease',
    opacity: disabled ? 0.5 : 1,
  };

  const variants = {
    primary: {
      backgroundColor: tokens.colors.sage,
      color: tokens.colors.white,
    },
    secondary: {
      backgroundColor: tokens.colors.sageLight,
      color: tokens.colors.sageDark,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: tokens.colors.gray600,
    },
    dashed: {
      backgroundColor: 'transparent',
      border: `1px dashed ${tokens.colors.gray200}`,
      color: tokens.colors.gray400,
    },
  };

  return (
    <button 
      onClick={disabled ? undefined : onClick} 
      disabled={disabled}
      style={{ ...baseStyle, ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
};

export default Button;
