/**
 * Design Tokens - Veggie Planner
 * Tokens de design extraits de la maquette
 */

export const tokens = {
  colors: {
    // Couleurs principales
    sage: '#8B9A7D',
    sageDark: '#6B7A5D',
    sageLight: '#E8EDE5',
    cream: '#FAF8F5',
    sand: '#E8E2D9',
    terracotta: '#C4A484',
    bark: '#5C4D3C',
    barkLight: '#8B7355',
    // Neutres
    white: '#FFFFFF',
    gray100: '#F5F5F4',
    gray200: '#E7E5E4',
    gray400: '#A8A29E',
    gray600: '#57534E',
    gray800: '#292524',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '16px',
  },
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.05)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)',
  },
};

// Export des tokens individuels pour faciliter l'utilisation
export const colors = tokens.colors;
export const spacing = tokens.spacing;
export const radius = tokens.radius;
export const shadow = tokens.shadow;
