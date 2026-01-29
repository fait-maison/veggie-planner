import React, { useState, useEffect } from 'react';

/**
 * APPLICATION LISTE DE COURSES VÉGÉTARIENNE - MVP Phase 1
 * 
 * Fonctionnalités :
 * - Planning de 7-10 repas
 * - Suggestions simulées de recettes de saison
 * - Bibliothèque de recettes favorites (ajout manuel)
 * - Génération automatique de liste d'ingrédients
 * - Produits récurrents
 * - Stockage localStorage
 */

// ============================================
// DESIGN TOKENS
// ============================================
const tokens = {
  colors: {
    // Palette principale - tons naturels
    sage: '#7C9A6E',
    sageDark: '#5A7A4A',
    sageLight: '#E3EBE0',
    sageMuted: '#A8C49A',
    
    cream: '#FDFBF7',
    sand: '#E8E2D6',
    sandDark: '#D4CAB8',
    
    terracotta: '#C4856C',
    terracottaLight: '#F5E6E0',
    
    bark: '#4A3F35',
    barkLight: '#7A6B5A',
    barkMuted: '#9A8B7A',
    
    // Neutres
    white: '#FFFFFF',
    gray50: '#FAFAF9',
    gray100: '#F5F5F4',
    gray200: '#E7E5E4',
    gray300: '#D6D3D1',
    gray400: '#A8A29E',
    gray500: '#78716C',
    gray600: '#57534E',
    gray700: '#44403C',
    gray800: '#292524',
    
    // États
    success: '#6B9B5A',
    warning: '#D4A853',
    error: '#C45B4A',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },
  radius: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  shadow: {
    sm: '0 1px 2px rgba(74, 63, 53, 0.04)',
    md: '0 4px 12px rgba(74, 63, 53, 0.08)',
    lg: '0 12px 32px rgba(74, 63, 53, 0.12)',
    inner: 'inset 0 2px 4px rgba(74, 63, 53, 0.04)',
  },
  font: {
    sans: "'DM Sans', system-ui, -apple-system, sans-serif",
    display: "'Fraunces', Georgia, serif",
  }
};

// ============================================
// DONNÉES DE DÉMONSTRATION - RECETTES DE SAISON (HIVER)
// ============================================
const initialRecipes = [
  // Suggestions IA simulées - Hiver à Lille
  {
    id: 'r1',
    name: 'Dahl crémeux aux lentilles corail et courge',
    ingredients: ['Lentilles corail', 'Courge butternut', 'Lait de coco', 'Oignon', 'Ail', 'Gingembre', 'Curcuma', 'Cumin', 'Coriandre fraîche'],
    protein: 'Lentilles corail',
    season: 'hiver',
    source: 'suggestion',
    favorite: false,
  },
  {
    id: 'r2',
    name: 'Gratin de poireaux au comté et œufs pochés',
    ingredients: ['Poireaux', 'Comté râpé', 'Œufs', 'Crème fraîche', 'Muscade', 'Pain de mie'],
    protein: 'Œufs, Comté',
    season: 'hiver',
    source: 'suggestion',
    favorite: false,
  },
  {
    id: 'r3',
    name: 'Buddha bowl d\'hiver au tofu grillé',
    ingredients: ['Tofu ferme', 'Quinoa', 'Chou rouge', 'Carotte', 'Betterave crue', 'Avocat', 'Graines de sésame', 'Sauce tahini'],
    protein: 'Tofu',
    season: 'hiver',
    source: 'suggestion',
    favorite: false,
  },
  {
    id: 'r4',
    name: 'Soupe de pois cassés fumée',
    ingredients: ['Pois cassés', 'Carotte', 'Céleri', 'Oignon', 'Paprika fumé', 'Laurier', 'Croûtons'],
    protein: 'Pois cassés',
    season: 'hiver',
    source: 'suggestion',
    favorite: false,
  },
  {
    id: 'r5',
    name: 'Curry de chou-fleur et pois chiches',
    ingredients: ['Pois chiches', 'Chou-fleur', 'Tomates concassées', 'Oignon', 'Ail', 'Garam masala', 'Lait de coco', 'Riz basmati'],
    protein: 'Pois chiches',
    season: 'hiver',
    source: 'suggestion',
    favorite: false,
  },
  {
    id: 'r6',
    name: 'Tartiflette végétarienne au reblochon',
    ingredients: ['Pommes de terre', 'Reblochon', 'Oignon', 'Lardons de tofu fumé', 'Crème fraîche', 'Vin blanc'],
    protein: 'Reblochon, Tofu fumé',
    season: 'hiver',
    source: 'suggestion',
    favorite: false,
  },
  {
    id: 'r7',
    name: 'Risotto champignons et parmesan',
    ingredients: ['Riz arborio', 'Champignons de Paris', 'Parmesan', 'Échalote', 'Vin blanc', 'Bouillon de légumes', 'Beurre', 'Persil'],
    protein: 'Parmesan',
    season: 'hiver',
    source: 'suggestion',
    favorite: false,
  },
  {
    id: 'r8',
    name: 'Chili sin carne aux haricots rouges',
    ingredients: ['Haricots rouges', 'Protéines de soja texturées', 'Tomates concassées', 'Poivron', 'Oignon', 'Ail', 'Cumin', 'Paprika', 'Chocolat noir'],
    protein: 'Haricots rouges, PST',
    season: 'hiver',
    source: 'suggestion',
    favorite: false,
  },
  {
    id: 'r9',
    name: 'Omelette aux champignons et fines herbes',
    ingredients: ['Œufs', 'Champignons', 'Ciboulette', 'Persil', 'Beurre', 'Salade verte'],
    protein: 'Œufs',
    season: 'hiver',
    source: 'suggestion',
    favorite: false,
  },
  {
    id: 'r10',
    name: 'Soupe miso au tofu soyeux',
    ingredients: ['Tofu soyeux', 'Pâte miso', 'Algue wakame', 'Champignons shiitake', 'Oignon vert', 'Nouilles udon'],
    protein: 'Tofu soyeux',
    season: 'hiver',
    source: 'suggestion',
    favorite: false,
  },
  {
    id: 'r11',
    name: 'Gratin de pâtes aux épinards et ricotta',
    ingredients: ['Pâtes', 'Épinards', 'Ricotta', 'Mozzarella', 'Ail', 'Muscade', 'Parmesan'],
    protein: 'Ricotta, Mozzarella',
    season: 'hiver',
    source: 'suggestion',
    favorite: false,
  },
  {
    id: 'r12',
    name: 'Falafels maison et sauce yaourt',
    ingredients: ['Pois chiches secs', 'Persil', 'Coriandre', 'Oignon', 'Ail', 'Cumin', 'Pain pita', 'Yaourt grec', 'Concombre'],
    protein: 'Pois chiches, Yaourt',
    season: 'hiver',
    source: 'suggestion',
    favorite: false,
  },
];

const initialRecurring = [
  { id: 'rec1', name: 'Yaourts nature', checked: true },
  { id: 'rec2', name: 'Œufs bio x12', checked: true },
  { id: 'rec3', name: 'Pain au levain', checked: true },
  { id: 'rec4', name: 'Lait d\'avoine', checked: true },
  { id: 'rec5', name: 'Beurre', checked: false },
  { id: 'rec6', name: 'Fromage râpé', checked: false },
];

// ============================================
// HOOKS PERSONNALISÉS
// ============================================
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erreur lecture localStorage pour ${key}:`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erreur écriture localStorage pour ${key}:`, error);
    }
  };

  return [storedValue, setValue];
};

// ============================================
// COMPOSANTS UI DE BASE
// ============================================
const Button = ({ children, variant = 'primary', size = 'md', onClick, disabled, style = {}, ...props }) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.sm,
    border: 'none',
    fontFamily: tokens.font.sans,
    fontWeight: '500',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.5 : 1,
  };

  const sizes = {
    sm: { padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`, fontSize: '13px', borderRadius: tokens.radius.sm },
    md: { padding: `${tokens.spacing.sm} ${tokens.spacing.md}`, fontSize: '14px', borderRadius: tokens.radius.md },
    lg: { padding: `${tokens.spacing.md} ${tokens.spacing.lg}`, fontSize: '15px', borderRadius: tokens.radius.md },
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
    outline: {
      backgroundColor: 'transparent',
      border: `1.5px solid ${tokens.colors.gray300}`,
      color: tokens.colors.gray600,
    },
    danger: {
      backgroundColor: tokens.colors.terracottaLight,
      color: tokens.colors.error,
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...baseStyle, ...sizes[size], ...variants[variant], ...style }}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, selected = false, hoverable = false, onClick, style = {} }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: tokens.colors.white,
        borderRadius: tokens.radius.lg,
        padding: tokens.spacing.lg,
        cursor: onClick ? 'pointer' : 'default',
        border: selected 
          ? `2px solid ${tokens.colors.sage}` 
          : `1px solid ${isHovered && hoverable ? tokens.colors.sandDark : tokens.colors.sand}`,
        boxShadow: selected ? tokens.shadow.md : (isHovered && hoverable ? tokens.shadow.md : tokens.shadow.sm),
        transition: 'all 0.2s ease',
        transform: isHovered && hoverable ? 'translateY(-2px)' : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Panel = ({ title, subtitle, children, action, icon }) => (
  <div style={{
    backgroundColor: tokens.colors.white,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
    border: `1px solid ${tokens.colors.sand}`,
    boxShadow: tokens.shadow.sm,
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: subtitle ? tokens.spacing.xs : tokens.spacing.md,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm }}>
        {icon && <span style={{ fontSize: '18px' }}>{icon}</span>}
        <h2 style={{
          fontSize: '15px',
          fontWeight: '600',
          color: tokens.colors.bark,
          margin: 0,
          fontFamily: tokens.font.sans,
        }}>
          {title}
        </h2>
      </div>
      {action}
    </div>
    {subtitle && (
      <p style={{
        fontSize: '13px',
        color: tokens.colors.gray500,
        margin: `0 0 ${tokens.spacing.md} 0`,
        lineHeight: '1.5',
      }}>
        {subtitle}
      </p>
    )}
    {children}
  </div>
);

const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: { backgroundColor: tokens.colors.gray100, color: tokens.colors.gray600 },
    sage: { backgroundColor: tokens.colors.sageLight, color: tokens.colors.sageDark },
    terracotta: { backgroundColor: tokens.colors.terracottaLight, color: tokens.colors.terracotta },
  };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
      borderRadius: tokens.radius.full,
      fontSize: '11px',
      fontWeight: '500',
      ...variants[variant],
    }}>
      {children}
    </span>
  );
};

const Input = ({ value, onChange, placeholder, style = {}, ...props }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={{
      width: '100%',
      padding: tokens.spacing.sm,
      border: `1.5px solid ${tokens.colors.gray200}`,
      borderRadius: tokens.radius.md,
      fontSize: '14px',
      fontFamily: tokens.font.sans,
      color: tokens.colors.gray800,
      backgroundColor: tokens.colors.white,
      transition: 'border-color 0.2s ease',
      outline: 'none',
      ...style,
    }}
    onFocus={(e) => e.target.style.borderColor = tokens.colors.sage}
    onBlur={(e) => e.target.style.borderColor = tokens.colors.gray200}
    {...props}
  />
);

const Checkbox = ({ checked, onChange, label }) => (
  <label style={{
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    cursor: 'pointer',
    userSelect: 'none',
  }}>
    <div style={{
      width: '18px',
      height: '18px',
      borderRadius: tokens.radius.xs,
      border: checked ? 'none' : `2px solid ${tokens.colors.gray300}`,
      backgroundColor: checked ? tokens.colors.sage : tokens.colors.white,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.15s ease',
      flexShrink: 0,
    }}>
      {checked && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      style={{ display: 'none' }}
    />
    <span style={{
      fontSize: '14px',
      color: checked ? tokens.colors.gray800 : tokens.colors.gray600,
    }}>
      {label}
    </span>
  </label>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: tokens.spacing.lg,
    }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: tokens.colors.white,
          borderRadius: tokens.radius.xl,
          padding: tokens.spacing.xl,
          maxWidth: '500px',
          width: '100%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: tokens.shadow.lg,
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: tokens.spacing.lg,
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: tokens.colors.bark,
            margin: 0,
            fontFamily: tokens.font.display,
          }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: tokens.radius.full,
              border: 'none',
              backgroundColor: tokens.colors.gray100,
              color: tokens.colors.gray500,
              cursor: 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ============================================
// HEADER
// ============================================
const Header = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { key: 'planning', label: 'Planning', icon: '📋' },
    { key: 'recettes', label: 'Recettes', icon: '📖' },
    { key: 'courses', label: 'Liste', icon: '🛒' },
  ];

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
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.md }}>
          <div style={{
            width: '42px',
            height: '42px',
            background: `linear-gradient(135deg, ${tokens.colors.sage} 0%, ${tokens.colors.sageDark} 100%)`,
            borderRadius: tokens.radius.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: tokens.shadow.sm,
          }}>
            <span style={{ fontSize: '22px' }}>🥬</span>
          </div>
          <div>
            <span style={{
              fontSize: '18px',
              fontWeight: '600',
              color: tokens.colors.bark,
              fontFamily: tokens.font.display,
              letterSpacing: '-0.3px',
            }}>
              Veggie Planner
            </span>
            <div style={{
              fontSize: '11px',
              color: tokens.colors.gray400,
              marginTop: '2px',
            }}>
              Saison : Hiver 🌨️
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{
          display: 'flex',
          gap: tokens.spacing.xs,
          backgroundColor: tokens.colors.gray50,
          padding: tokens.spacing.xs,
          borderRadius: tokens.radius.lg,
        }}>
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setCurrentPage(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: tokens.spacing.xs,
                padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                backgroundColor: currentPage === item.key ? tokens.colors.white : 'transparent',
                color: currentPage === item.key ? tokens.colors.bark : tokens.colors.gray500,
                border: 'none',
                borderRadius: tokens.radius.md,
                fontSize: '14px',
                fontWeight: currentPage === item.key ? '500' : '400',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: currentPage === item.key ? tokens.shadow.sm : 'none',
                fontFamily: tokens.font.sans,
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div style={{ width: '180px', textAlign: 'right' }}>
          <Badge variant="sage">7 plats cette semaine</Badge>
        </div>
      </div>
    </header>
  );
};

// ============================================
// PAGE PLANNING
// ============================================
const PlanningPage = ({ 
  recipes, 
  setRecipes, 
  selectedMeals, 
  setSelectedMeals, 
  recurring, 
  setRecurring,
  setCurrentPage 
}) => {
  const [activeTab, setActiveTab] = useState('suggestions');
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [showAddRecurringModal, setShowAddRecurringModal] = useState(false);

  const toggleMeal = (recipe) => {
    const exists = selectedMeals.find(m => m.id === recipe.id);
    if (exists) {
      setSelectedMeals(selectedMeals.filter(m => m.id !== recipe.id));
    } else if (selectedMeals.length < 10) {
      setSelectedMeals([...selectedMeals, { 
        id: recipe.id, 
        name: recipe.name,
        ingredients: recipe.ingredients 
      }]);
    }
  };

  const toggleFavorite = (recipeId, e) => {
    e.stopPropagation();
    setRecipes(recipes.map(r => 
      r.id === recipeId ? { ...r, favorite: !r.favorite } : r
    ));
  };

  const isSelected = (id) => selectedMeals.some(m => m.id === id);

  const filteredRecipes = activeTab === 'favorites' 
    ? recipes.filter(r => r.favorite)
    : recipes;

  const generateShoppingList = () => {
    setCurrentPage('courses');
  };

  return (
    <main style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: tokens.spacing.xl,
      display: 'grid',
      gridTemplateColumns: '1fr 360px',
      gap: tokens.spacing.xl,
      minHeight: 'calc(100vh - 80px)',
    }}>
      {/* Colonne gauche - Suggestions */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: tokens.spacing.lg,
        }}>
          <div>
            <h1 style={{
              fontSize: '26px',
              fontWeight: '600',
              color: tokens.colors.bark,
              margin: 0,
              fontFamily: tokens.font.display,
              letterSpacing: '-0.5px',
            }}>
              Suggestions de la semaine
            </h1>
            <p style={{
              fontSize: '14px',
              color: tokens.colors.gray500,
              margin: `${tokens.spacing.xs} 0 0 0`,
            }}>
              Recettes végétariennes de saison avec protéines
            </p>
          </div>
        </div>

        {/* Onglets */}
        <div style={{
          display: 'flex',
          gap: tokens.spacing.sm,
          marginBottom: tokens.spacing.lg,
        }}>
          {[
            { key: 'suggestions', label: 'Toutes les recettes', count: recipes.length },
            { key: 'favorites', label: 'Mes favoris', count: recipes.filter(r => r.favorite).length },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: tokens.spacing.sm,
                padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                backgroundColor: activeTab === tab.key ? tokens.colors.bark : tokens.colors.gray100,
                color: activeTab === tab.key ? tokens.colors.white : tokens.colors.gray600,
                border: 'none',
                borderRadius: tokens.radius.full,
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontFamily: tokens.font.sans,
              }}
            >
              {tab.label}
              <span style={{
                backgroundColor: activeTab === tab.key ? 'rgba(255,255,255,0.2)' : tokens.colors.gray200,
                padding: `2px ${tokens.spacing.xs}`,
                borderRadius: tokens.radius.full,
                fontSize: '11px',
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Grille de recettes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: tokens.spacing.md,
        }}>
          {filteredRecipes.map(recipe => (
            <Card
              key={recipe.id}
              selected={isSelected(recipe.id)}
              hoverable
              onClick={() => toggleMeal(recipe)}
              style={{ position: 'relative' }}
            >
              {/* Indicateur de sélection */}
              <div style={{
                position: 'absolute',
                top: tokens.spacing.md,
                right: tokens.spacing.md,
                display: 'flex',
                gap: tokens.spacing.xs,
              }}>
                <button
                  onClick={(e) => toggleFavorite(recipe.id, e)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: tokens.radius.full,
                    border: 'none',
                    backgroundColor: recipe.favorite ? tokens.colors.terracottaLight : tokens.colors.gray100,
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {recipe.favorite ? '❤️' : '🤍'}
                </button>
                {isSelected(recipe.id) && (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    backgroundColor: tokens.colors.sage,
                    borderRadius: tokens.radius.full,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: tokens.colors.white,
                    fontSize: '14px',
                  }}>
                    ✓
                  </div>
                )}
              </div>

              <h3 style={{
                fontSize: '15px',
                fontWeight: '500',
                color: tokens.colors.bark,
                margin: 0,
                paddingRight: '70px',
                lineHeight: '1.4',
                fontFamily: tokens.font.sans,
              }}>
                {recipe.name}
              </h3>

              <div style={{
                marginTop: tokens.spacing.md,
              }}>
                <Badge variant="sage">🫘 {recipe.protein}</Badge>
              </div>

              <div style={{
                marginTop: tokens.spacing.md,
                paddingTop: tokens.spacing.md,
                borderTop: `1px solid ${tokens.colors.gray100}`,
                fontSize: '12px',
                color: tokens.colors.gray400,
                display: 'flex',
                flexWrap: 'wrap',
                gap: tokens.spacing.xs,
              }}>
                {recipe.ingredients.slice(0, 4).map((ing, i) => (
                  <span key={i} style={{
                    backgroundColor: tokens.colors.gray50,
                    padding: `2px ${tokens.spacing.xs}`,
                    borderRadius: tokens.radius.xs,
                  }}>
                    {ing}
                  </span>
                ))}
                {recipe.ingredients.length > 4 && (
                  <span style={{
                    color: tokens.colors.gray400,
                  }}>
                    +{recipe.ingredients.length - 4}
                  </span>
                )}
              </div>
            </Card>
          ))}

          {/* Bouton ajouter */}
          <Card
            hoverable
            onClick={() => setShowAddRecipeModal(true)}
            style={{
              border: `2px dashed ${tokens.colors.gray200}`,
              backgroundColor: tokens.colors.gray50,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '180px',
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: tokens.radius.full,
              backgroundColor: tokens.colors.white,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: tokens.colors.gray400,
              marginBottom: tokens.spacing.sm,
            }}>
              +
            </div>
            <span style={{
              fontSize: '14px',
              color: tokens.colors.gray500,
              fontWeight: '500',
            }}>
              Ajouter une recette
            </span>
          </Card>
        </div>
      </div>

      {/* Colonne droite - Récap */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.lg }}>
        {/* Ma sélection */}
        <Panel 
          title="Ma sélection" 
          icon="📝"
          subtitle={`${selectedMeals.length}/10 plats pour la semaine`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
            {selectedMeals.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: tokens.spacing.xl,
                color: tokens.colors.gray400,
              }}>
                <div style={{ fontSize: '32px', marginBottom: tokens.spacing.sm }}>🍽️</div>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  Cliquez sur les recettes pour les ajouter
                </p>
              </div>
            ) : (
              selectedMeals.map((meal, index) => (
                <div
                  key={meal.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: tokens.spacing.sm,
                    padding: tokens.spacing.sm,
                    backgroundColor: tokens.colors.sageLight,
                    borderRadius: tokens.radius.md,
                  }}
                >
                  <span style={{
                    width: '22px',
                    height: '22px',
                    backgroundColor: tokens.colors.sage,
                    color: tokens.colors.white,
                    borderRadius: tokens.radius.full,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '600',
                    flexShrink: 0,
                  }}>
                    {index + 1}
                  </span>
                  <span style={{ 
                    flex: 1, 
                    fontSize: '13px', 
                    color: tokens.colors.bark,
                    lineHeight: '1.3',
                  }}>
                    {meal.name}
                  </span>
                  <button
                    onClick={() => setSelectedMeals(selectedMeals.filter(m => m.id !== meal.id))}
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: tokens.radius.full,
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: tokens.colors.sageDark,
                      cursor: 'pointer',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          {selectedMeals.length > 0 && (
            <Button 
              onClick={generateShoppingList}
              style={{ width: '100%', marginTop: tokens.spacing.lg }}
            >
              Voir la liste de courses →
            </Button>
          )}
        </Panel>

        {/* Produits récurrents */}
        <Panel 
          title="Produits récurrents" 
          icon="🔄"
          action={
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowAddRecurringModal(true)}
            >
              + Ajouter
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
            {recurring.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: tokens.spacing.sm,
                  backgroundColor: item.checked ? tokens.colors.sageLight : tokens.colors.gray50,
                  borderRadius: tokens.radius.md,
                  transition: 'all 0.15s ease',
                }}
              >
                <Checkbox
                  checked={item.checked}
                  onChange={() => setRecurring(recurring.map(i => 
                    i.id === item.id ? { ...i, checked: !i.checked } : i
                  ))}
                  label={item.name}
                />
                <button
                  onClick={() => setRecurring(recurring.filter(i => i.id !== item.id))}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: tokens.colors.gray400,
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: tokens.spacing.xs,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </Panel>

        {/* Info saisonnalité */}
        <div style={{
          background: `linear-gradient(135deg, ${tokens.colors.sageLight} 0%, ${tokens.colors.sand} 100%)`,
          borderRadius: tokens.radius.lg,
          padding: tokens.spacing.lg,
          border: `1px solid ${tokens.colors.sandDark}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm, marginBottom: tokens.spacing.sm }}>
            <span style={{ fontSize: '20px' }}>🥕</span>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: tokens.colors.bark, 
              margin: 0,
              fontFamily: tokens.font.sans,
            }}>
              Légumes de saison
            </h3>
          </div>
          <p style={{ 
            fontSize: '13px', 
            color: tokens.colors.barkLight, 
            margin: 0, 
            lineHeight: '1.6' 
          }}>
            Courge, poireau, chou, carotte, betterave, céleri, endive, mâche, navet...
          </p>
        </div>
      </div>

      {/* Modal ajout recette */}
      <AddRecipeModal
        isOpen={showAddRecipeModal}
        onClose={() => setShowAddRecipeModal(false)}
        onAdd={(recipe) => {
          setRecipes([...recipes, recipe]);
          setShowAddRecipeModal(false);
        }}
      />

      {/* Modal ajout produit récurrent */}
      <AddRecurringModal
        isOpen={showAddRecurringModal}
        onClose={() => setShowAddRecurringModal(false)}
        onAdd={(item) => {
          setRecurring([...recurring, item]);
          setShowAddRecurringModal(false);
        }}
      />
    </main>
  );
};

// ============================================
// MODAL AJOUT RECETTE
// ============================================
const AddRecipeModal = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [protein, setProtein] = useState('');

  const handleSubmit = () => {
    if (name.trim() && ingredients.trim() && protein.trim()) {
      onAdd({
        id: `r${Date.now()}`,
        name: name.trim(),
        ingredients: ingredients.split(',').map(i => i.trim()).filter(Boolean),
        protein: protein.trim(),
        season: 'hiver',
        source: 'manuel',
        favorite: false,
      });
      setName('');
      setIngredients('');
      setProtein('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter une recette">
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '13px', 
            fontWeight: '500',
            color: tokens.colors.gray700,
            marginBottom: tokens.spacing.xs,
          }}>
            Nom de la recette *
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Curry de légumes au lait de coco"
          />
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '13px', 
            fontWeight: '500',
            color: tokens.colors.gray700,
            marginBottom: tokens.spacing.xs,
          }}>
            Ingrédients * <span style={{ fontWeight: '400', color: tokens.colors.gray400 }}>(séparés par des virgules)</span>
          </label>
          <Input
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Ex: Carottes, Lait de coco, Curry, Riz"
          />
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '13px', 
            fontWeight: '500',
            color: tokens.colors.gray700,
            marginBottom: tokens.spacing.xs,
          }}>
            Source de protéines *
          </label>
          <Input
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            placeholder="Ex: Pois chiches, Tofu, Œufs..."
          />
        </div>

        <div style={{ 
          display: 'flex', 
          gap: tokens.spacing.sm, 
          marginTop: tokens.spacing.md,
          justifyContent: 'flex-end',
        }}>
          <Button variant="ghost" onClick={onClose}>Annuler</Button>
          <Button 
            onClick={handleSubmit}
            disabled={!name.trim() || !ingredients.trim() || !protein.trim()}
          >
            Ajouter la recette
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// ============================================
// MODAL AJOUT PRODUIT RÉCURRENT
// ============================================
const AddRecurringModal = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onAdd({
        id: `rec${Date.now()}`,
        name: name.trim(),
        checked: true,
      });
      setName('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter un produit récurrent">
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '13px', 
            fontWeight: '500',
            color: tokens.colors.gray700,
            marginBottom: tokens.spacing.xs,
          }}>
            Nom du produit
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Yaourts nature, Pain..."
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        <p style={{ 
          fontSize: '13px', 
          color: tokens.colors.gray500, 
          margin: 0,
          lineHeight: '1.5',
        }}>
          Ce produit sera coché par défaut chaque semaine.
        </p>

        <div style={{ 
          display: 'flex', 
          gap: tokens.spacing.sm, 
          marginTop: tokens.spacing.sm,
          justifyContent: 'flex-end',
        }}>
          <Button variant="ghost" onClick={onClose}>Annuler</Button>
          <Button 
            onClick={handleSubmit}
            disabled={!name.trim()}
          >
            Ajouter
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// ============================================
// PAGE RECETTES
// ============================================
const RecettesPage = ({ recipes, setRecipes }) => {
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecipes = recipes.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.ingredients.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleFavorite = (recipeId) => {
    setRecipes(recipes.map(r => 
      r.id === recipeId ? { ...r, favorite: !r.favorite } : r
    ));
  };

  const deleteRecipe = (recipeId) => {
    if (window.confirm('Supprimer cette recette ?')) {
      setRecipes(recipes.filter(r => r.id !== recipeId));
    }
  };

  return (
    <main style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: tokens.spacing.xl,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: tokens.spacing.xl,
      }}>
        <div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: tokens.colors.bark,
            margin: 0,
            fontFamily: tokens.font.display,
          }}>
            Ma bibliothèque de recettes
          </h1>
          <p style={{
            fontSize: '14px',
            color: tokens.colors.gray500,
            margin: `${tokens.spacing.xs} 0 0 0`,
          }}>
            {recipes.length} recettes enregistrées
          </p>
        </div>
        <Button onClick={() => setShowAddRecipeModal(true)}>
          + Nouvelle recette
        </Button>
      </div>

      {/* Recherche */}
      <div style={{ marginBottom: tokens.spacing.lg }}>
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Rechercher une recette ou un ingrédient..."
          style={{ maxWidth: '400px' }}
        />
      </div>

      {/* Liste des recettes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
        {filteredRecipes.map(recipe => (
          <Card key={recipe.id} style={{ padding: tokens.spacing.md }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: tokens.spacing.md,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm }}>
                  <h3 style={{
                    fontSize: '15px',
                    fontWeight: '500',
                    color: tokens.colors.bark,
                    margin: 0,
                  }}>
                    {recipe.name}
                  </h3>
                  {recipe.source === 'manuel' && (
                    <Badge>Manuel</Badge>
                  )}
                </div>
                <div style={{
                  marginTop: tokens.spacing.sm,
                  fontSize: '13px',
                  color: tokens.colors.gray500,
                }}>
                  <span style={{ color: tokens.colors.sage, fontWeight: '500' }}>
                    🫘 {recipe.protein}
                  </span>
                  <span style={{ margin: `0 ${tokens.spacing.sm}` }}>•</span>
                  {recipe.ingredients.join(', ')}
                </div>
              </div>
              <div style={{ display: 'flex', gap: tokens.spacing.xs }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(recipe.id)}
                >
                  {recipe.favorite ? '❤️' : '🤍'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteRecipe(recipe.id)}
                  style={{ color: tokens.colors.gray400 }}
                >
                  🗑️
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filteredRecipes.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: tokens.spacing.xxl,
            color: tokens.colors.gray400,
          }}>
            <div style={{ fontSize: '48px', marginBottom: tokens.spacing.md }}>📖</div>
            <p style={{ margin: 0 }}>
              {searchTerm ? 'Aucune recette trouvée' : 'Aucune recette enregistrée'}
            </p>
          </div>
        )}
      </div>

      {/* Modal ajout recette */}
      <AddRecipeModal
        isOpen={showAddRecipeModal}
        onClose={() => setShowAddRecipeModal(false)}
        onAdd={(recipe) => {
          setRecipes([...recipes, recipe]);
          setShowAddRecipeModal(false);
        }}
      />
    </main>
  );
};

// ============================================
// PAGE COURSES
// ============================================
const CoursesPage = ({ selectedMeals, recurring }) => {
  const [checkedItems, setCheckedItems] = useState({});
  const [additionalItems, setAdditionalItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  // Générer la liste d'ingrédients depuis les plats sélectionnés
  const allIngredients = selectedMeals.reduce((acc, meal) => {
    if (meal.ingredients) {
      meal.ingredients.forEach(ing => {
        if (!acc.includes(ing)) {
          acc.push(ing);
        }
      });
    }
    return acc;
  }, []);

  // Produits récurrents cochés
  const recurringItems = recurring.filter(r => r.checked).map(r => r.name);

  const toggleCheck = (item) => {
    setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const addItem = () => {
    if (newItem.trim() && !additionalItems.includes(newItem.trim())) {
      setAdditionalItems([...additionalItems, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeAdditionalItem = (item) => {
    setAdditionalItems(additionalItems.filter(i => i !== item));
  };

  const totalItems = allIngredients.length + recurringItems.length + additionalItems.length;
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <main style={{
      maxWidth: '700px',
      margin: '0 auto',
      padding: tokens.spacing.xl,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: tokens.spacing.xl,
      }}>
        <div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: tokens.colors.bark,
            margin: 0,
            fontFamily: tokens.font.display,
          }}>
            Liste de courses
          </h1>
          <p style={{
            fontSize: '14px',
            color: tokens.colors.gray500,
            margin: `${tokens.spacing.xs} 0 0 0`,
          }}>
            {checkedCount}/{totalItems} articles cochés
          </p>
        </div>
        {totalItems > 0 && (
          <Button
            variant="outline"
            onClick={() => setCheckedItems({})}
          >
            Tout décocher
          </Button>
        )}
      </div>

      {selectedMeals.length === 0 && recurringItems.length === 0 && additionalItems.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: tokens.spacing.xxxl,
          color: tokens.colors.gray400,
        }}>
          <div style={{ fontSize: '64px', marginBottom: tokens.spacing.lg }}>🛒</div>
          <p style={{ margin: 0, fontSize: '16px' }}>
            Sélectionnez des plats dans le Planning<br />pour générer votre liste de courses
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.lg }}>
          {/* Ingrédients des recettes */}
          {allIngredients.length > 0 && (
            <Panel title="Ingrédients des recettes" icon="🥗" subtitle={`${allIngredients.length} articles`}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.xs }}>
                {allIngredients.map(item => (
                  <div
                    key={item}
                    onClick={() => toggleCheck(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: tokens.spacing.sm,
                      padding: tokens.spacing.sm,
                      backgroundColor: checkedItems[item] ? tokens.colors.gray50 : tokens.colors.white,
                      borderRadius: tokens.radius.md,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: tokens.radius.xs,
                      border: checkedItems[item] ? 'none' : `2px solid ${tokens.colors.gray300}`,
                      backgroundColor: checkedItems[item] ? tokens.colors.sage : tokens.colors.white,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {checkedItems[item] && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span style={{
                      fontSize: '14px',
                      color: checkedItems[item] ? tokens.colors.gray400 : tokens.colors.gray800,
                      textDecoration: checkedItems[item] ? 'line-through' : 'none',
                      flex: 1,
                    }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {/* Produits récurrents */}
          {recurringItems.length > 0 && (
            <Panel title="Produits récurrents" icon="🔄" subtitle={`${recurringItems.length} articles`}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.xs }}>
                {recurringItems.map(item => (
                  <div
                    key={item}
                    onClick={() => toggleCheck(`rec_${item}`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: tokens.spacing.sm,
                      padding: tokens.spacing.sm,
                      backgroundColor: checkedItems[`rec_${item}`] ? tokens.colors.gray50 : tokens.colors.white,
                      borderRadius: tokens.radius.md,
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: tokens.radius.xs,
                      border: checkedItems[`rec_${item}`] ? 'none' : `2px solid ${tokens.colors.gray300}`,
                      backgroundColor: checkedItems[`rec_${item}`] ? tokens.colors.sage : tokens.colors.white,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {checkedItems[`rec_${item}`] && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span style={{
                      fontSize: '14px',
                      color: checkedItems[`rec_${item}`] ? tokens.colors.gray400 : tokens.colors.gray800,
                      textDecoration: checkedItems[`rec_${item}`] ? 'line-through' : 'none',
                    }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {/* Articles supplémentaires */}
          <Panel title="Articles supplémentaires" icon="➕">
            <div style={{ display: 'flex', gap: tokens.spacing.sm, marginBottom: additionalItems.length > 0 ? tokens.spacing.md : 0 }}>
              <Input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Ajouter un article..."
                onKeyDown={(e) => e.key === 'Enter' && addItem()}
                style={{ flex: 1 }}
              />
              <Button onClick={addItem} disabled={!newItem.trim()}>
                Ajouter
              </Button>
            </div>
            
            {additionalItems.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.xs }}>
                {additionalItems.map(item => (
                  <div
                    key={item}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: tokens.spacing.sm,
                      padding: tokens.spacing.sm,
                      backgroundColor: checkedItems[`add_${item}`] ? tokens.colors.gray50 : tokens.colors.white,
                      borderRadius: tokens.radius.md,
                    }}
                  >
                    <div
                      onClick={() => toggleCheck(`add_${item}`)}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: tokens.radius.xs,
                        border: checkedItems[`add_${item}`] ? 'none' : `2px solid ${tokens.colors.gray300}`,
                        backgroundColor: checkedItems[`add_${item}`] ? tokens.colors.sage : tokens.colors.white,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      {checkedItems[`add_${item}`] && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span
                      onClick={() => toggleCheck(`add_${item}`)}
                      style={{
                        fontSize: '14px',
                        color: checkedItems[`add_${item}`] ? tokens.colors.gray400 : tokens.colors.gray800,
                        textDecoration: checkedItems[`add_${item}`] ? 'line-through' : 'none',
                        flex: 1,
                        cursor: 'pointer',
                      }}
                    >
                      {item}
                    </span>
                    <button
                      onClick={() => removeAdditionalItem(item)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: tokens.colors.gray400,
                        cursor: 'pointer',
                        padding: tokens.spacing.xs,
                        fontSize: '14px',
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      )}
    </main>
  );
};

// ============================================
// APP PRINCIPALE
// ============================================
export default function App() {
  const [currentPage, setCurrentPage] = useState('planning');
  
  // Données persistées avec localStorage
  const [recipes, setRecipes] = useLocalStorage('veggie-recipes', initialRecipes);
  const [selectedMeals, setSelectedMeals] = useLocalStorage('veggie-selected-meals', []);
  const [recurring, setRecurring] = useLocalStorage('veggie-recurring', initialRecurring);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: tokens.colors.cream,
      fontFamily: tokens.font.sans,
      color: tokens.colors.gray800,
    }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fraunces:wght@600&display=swap');
      `}</style>
      
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {currentPage === 'planning' && (
        <PlanningPage 
          recipes={recipes}
          setRecipes={setRecipes}
          selectedMeals={selectedMeals} 
          setSelectedMeals={setSelectedMeals}
          recurring={recurring}
          setRecurring={setRecurring}
          setCurrentPage={setCurrentPage}
        />
      )}
      {currentPage === 'recettes' && (
        <RecettesPage 
          recipes={recipes}
          setRecipes={setRecipes}
        />
      )}
      {currentPage === 'courses' && (
        <CoursesPage 
          selectedMeals={selectedMeals}
          recurring={recurring}
        />
      )}
    </div>
  );
}
