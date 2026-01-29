import React, { useState } from 'react';

/**
 * MAQUETTE - Application Liste de Courses Végétarienne
 * Version POC - Janvier 2026
 * 
 * Design System:
 * - Palette: tons naturels/terreux (à affiner avec codes hexa définitifs)
 * - Typo: minimaliste sans-serif (Inter)
 * - Desktop-first
 */

// ============================================
// DESIGN TOKENS
// ============================================
const tokens = {
  colors: {
    // Couleurs principales (à personnaliser)
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
  }
};

// ============================================
// DONNÉES DE DÉMONSTRATION
// ============================================
const demoRecipes = [
  { id: 1, name: 'Curry de pois chiches aux épinards', source: 'Pick Up Limes', favorite: false },
  { id: 2, name: 'Buddha bowl au tofu grillé', source: 'Rainbow Plant Life', favorite: true },
  { id: 3, name: 'Gratin de courge butternut', source: 'Manuel', favorite: true },
  { id: 4, name: 'Soupe de lentilles corail', source: 'Pick Up Limes', favorite: false },
  { id: 5, name: 'Pad thaï végétarien', source: 'Rainbow Plant Life', favorite: true },
  { id: 6, name: 'Risotto aux champignons', source: 'Manuel', favorite: false },
];

const demoRecurring = [
  { id: 1, name: 'Yaourts nature', checked: true },
  { id: 2, name: 'Œufs bio x12', checked: true },
  { id: 3, name: 'Pain au levain', checked: true },
  { id: 4, name: 'Lait d\'avoine', checked: false },
];

const demoSources = [
  { id: 1, name: 'Pick Up Limes', url: 'https://www.pickuplimes.com' },
  { id: 2, name: 'Rainbow Plant Life', url: 'https://rainbowplantlife.com' },
];

const demoStores = [
  { id: 1, name: 'Maraîcher du marché de Wazemmes', items: ['Carottes', 'Poireaux', 'Courge butternut'] },
  { id: 2, name: 'Asie Nord', items: ['Tofu', 'Nouilles de riz', 'Lait de coco'] },
  { id: 3, name: 'Day by day', items: ['Lentilles corail', 'Pois chiches', 'Riz basmati'] },
  { id: 4, name: 'Naturalia', items: ['Yaourts nature', 'Crème fraîche'] },
];

// ============================================
// COMPOSANTS RÉUTILISABLES
// ============================================

const Button = ({ children, variant = 'primary', onClick, style = {} }) => {
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
    cursor: 'pointer',
    transition: 'all 0.15s ease',
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
    <button onClick={onClick} style={{ ...baseStyle, ...variants[variant], ...style }}>
      {children}
    </button>
  );
};

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

// ============================================
// HEADER
// ============================================
const Header = ({ currentPage, setCurrentPage }) => (
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
          [Nom de l'app]
        </span>
      </div>
      
      <nav style={{ display: 'flex', gap: tokens.spacing.xs }}>
        {['Planning', 'Recettes', 'Courses', 'Enseignes'].map((item) => (
          <button
            key={item}
            onClick={() => setCurrentPage(item)}
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

      <Button variant="secondary">
        Terminer cette liste
      </Button>
    </div>
  </header>
);

// ============================================
// PAGE PLANNING
// ============================================
const PlanningPage = ({ selectedMeals, setSelectedMeals, recurring, setRecurring }) => {
  const [activeTab, setActiveTab] = useState('suggestions');

  const toggleMeal = (recipe) => {
    const exists = selectedMeals.find(m => m.id === recipe.id);
    if (exists) {
      setSelectedMeals(selectedMeals.filter(m => m.id !== recipe.id));
    } else {
      setSelectedMeals([...selectedMeals, { id: recipe.id, name: recipe.name }]);
    }
  };

  const isSelected = (id) => selectedMeals.some(m => m.id === id);

  return (
    <main style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: tokens.spacing.xl,
      display: 'grid',
      gridTemplateColumns: '1fr 380px',
      gap: tokens.spacing.xl,
    }}>
      {/* Colonne gauche - Suggestions */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: tokens.spacing.lg,
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: tokens.colors.bark,
            margin: 0,
            letterSpacing: '-0.5px',
          }}>
            Suggestions
          </h1>
          <Button>
            <span>✨</span>
            Nouvelles suggestions
          </Button>
        </div>

        {/* Onglets */}
        <div style={{
          display: 'flex',
          gap: tokens.spacing.xs,
          marginBottom: tokens.spacing.lg,
          borderBottom: `1px solid ${tokens.colors.sand}`,
          paddingBottom: tokens.spacing.sm,
        }}>
          {[
            { key: 'suggestions', label: 'Suggestions IA', icon: '✨' },
            { key: 'favorites', label: 'Mes favoris', icon: '❤️' },
            { key: 'history', label: 'Recettes passées', icon: '📅' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: tokens.spacing.xs,
                padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                backgroundColor: activeTab === tab.key ? tokens.colors.white : 'transparent',
                color: activeTab === tab.key ? tokens.colors.bark : tokens.colors.gray600,
                border: activeTab === tab.key ? `1px solid ${tokens.colors.sand}` : '1px solid transparent',
                borderBottom: activeTab === tab.key ? `1px solid ${tokens.colors.white}` : '1px solid transparent',
                borderRadius: `${tokens.radius.sm} ${tokens.radius.sm} 0 0`,
                marginBottom: '-1px',
                fontSize: '14px',
                fontWeight: activeTab === tab.key ? '500' : '400',
                cursor: 'pointer',
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grille de recettes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: tokens.spacing.md,
        }}>
          {demoRecipes.map(recipe => (
            <Card
              key={recipe.id}
              selected={isSelected(recipe.id)}
              onClick={() => toggleMeal(recipe)}
              style={{ position: 'relative' }}
            >
              {isSelected(recipe.id) && (
                <div style={{
                  position: 'absolute',
                  top: tokens.spacing.md,
                  right: tokens.spacing.md,
                  width: '24px',
                  height: '24px',
                  backgroundColor: tokens.colors.sage,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: tokens.colors.white,
                  fontSize: '14px',
                }}>
                  ✓
                </div>
              )}

              <h3 style={{
                fontSize: '16px',
                fontWeight: '500',
                color: tokens.colors.bark,
                margin: 0,
                paddingRight: isSelected(recipe.id) ? '32px' : 0,
                lineHeight: '1.4',
              }}>
                {recipe.name}
              </h3>

              <div style={{
                marginTop: tokens.spacing.md,
                paddingTop: tokens.spacing.md,
                borderTop: `1px solid ${tokens.colors.gray100}`,
                fontSize: '12px',
                color: tokens.colors.gray400,
              }}>
                Source : {recipe.source}
              </div>
            </Card>
          ))}
        </div>

        <Button variant="dashed" style={{ width: '100%', marginTop: tokens.spacing.md, padding: tokens.spacing.lg }}>
          <span style={{ fontSize: '18px' }}>+</span>
          Ajouter une recette manuellement
        </Button>
      </div>

      {/* Colonne droite - Récap */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.lg }}>
        {/* Ma liste */}
        <Panel title="Ma liste">
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
            {selectedMeals.length === 0 ? (
              <p style={{
                color: tokens.colors.gray400,
                fontSize: '14px',
                textAlign: 'center',
                padding: tokens.spacing.lg,
                margin: 0,
              }}>
                Cliquez sur les recettes pour les ajouter
              </p>
            ) : (
              selectedMeals.map((meal, index) => (
                <div
                  key={meal.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: tokens.spacing.sm,
                    padding: tokens.spacing.sm,
                    backgroundColor: tokens.colors.gray100,
                    borderRadius: tokens.radius.sm,
                  }}
                >
                  <span style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: tokens.colors.sage,
                    color: tokens.colors.white,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '600',
                    flexShrink: 0,
                  }}>
                    {index + 1}
                  </span>
                  <span style={{ flex: 1, fontSize: '13px', color: tokens.colors.gray800 }}>
                    {meal.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMeals(selectedMeals.filter(m => m.id !== meal.id));
                    }}
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: tokens.colors.gray400,
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          {selectedMeals.length > 0 && (
            <Button style={{ width: '100%', marginTop: tokens.spacing.lg }}>
              Générer la liste de courses →
            </Button>
          )}
        </Panel>

        {/* Produits récurrents */}
        <Panel title="Produits récurrents">
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
            {recurring.map(item => (
              <label
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: tokens.spacing.sm,
                  padding: tokens.spacing.sm,
                  backgroundColor: item.checked ? tokens.colors.sageLight : tokens.colors.gray100,
                  borderRadius: tokens.radius.sm,
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => setRecurring(recurring.map(i => 
                    i.id === item.id ? { ...i, checked: !i.checked } : i
                  ))}
                  style={{ width: '16px', height: '16px', accentColor: tokens.colors.sage }}
                />
                <span style={{
                  fontSize: '13px',
                  color: item.checked ? tokens.colors.bark : tokens.colors.gray600,
                }}>
                  {item.name}
                </span>
              </label>
            ))}
          </div>
          <Button variant="dashed" style={{ width: '100%', marginTop: tokens.spacing.md }}>
            + Ajouter un produit récurrent
          </Button>
        </Panel>

        {/* Inventaire */}
        <div style={{
          backgroundColor: tokens.colors.sand,
          borderRadius: tokens.radius.lg,
          padding: tokens.spacing.lg,
          border: `1px solid ${tokens.colors.terracotta}40`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm, marginBottom: tokens.spacing.sm }}>
            <span style={{ fontSize: '18px' }}>🏠</span>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: tokens.colors.bark, margin: 0 }}>
              Ce que j'ai déjà
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: tokens.colors.barkLight, margin: `0 0 ${tokens.spacing.md} 0`, lineHeight: '1.5' }}>
            Renseignez vos ingrédients disponibles pour éviter les doublons
          </p>
          <button style={{
            padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
            backgroundColor: tokens.colors.white,
            color: tokens.colors.bark,
            border: `1px solid ${tokens.colors.terracotta}`,
            borderRadius: tokens.radius.sm,
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
          }}>
            Mettre à jour l'inventaire
          </button>
        </div>
      </div>
    </main>
  );
};

// ============================================
// PAGE RECETTES
// ============================================
const RecettesPage = () => {
  const [sources, setSources] = useState(demoSources);
  const [newUrl, setNewUrl] = useState('');

  return (
    <main style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: tokens.spacing.xl,
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: '600',
        color: tokens.colors.bark,
        margin: `0 0 ${tokens.spacing.xl} 0`,
        letterSpacing: '-0.5px',
      }}>
        Recettes
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: tokens.spacing.xl }}>
        {/* Liste des recettes */}
        <div>
          <Panel title="Toutes mes recettes" action={
            <Button variant="dashed" style={{ padding: `${tokens.spacing.xs} ${tokens.spacing.md}` }}>
              + Ajouter
            </Button>
          }>
            <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
              {demoRecipes.map(recipe => (
                <div
                  key={recipe.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: tokens.spacing.md,
                    backgroundColor: tokens.colors.gray100,
                    borderRadius: tokens.radius.sm,
                  }}
                >
                  <div>
                    <span style={{ fontSize: '14px', color: tokens.colors.gray800 }}>{recipe.name}</span>
                    <span style={{ fontSize: '12px', color: tokens.colors.gray400, marginLeft: tokens.spacing.sm }}>
                      — {recipe.source}
                    </span>
                  </div>
                  <button
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      fontSize: '16px',
                      cursor: 'pointer',
                      opacity: recipe.favorite ? 1 : 0.3,
                    }}
                  >
                    ❤️
                  </button>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Sources URL */}
        <div>
          <Panel title="Sources pour suggestions IA">
            <p style={{ fontSize: '13px', color: tokens.colors.gray600, margin: `0 0 ${tokens.spacing.md} 0` }}>
              L'IA utilisera ces sites pour vous proposer des recettes
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm, marginBottom: tokens.spacing.md }}>
              {sources.map(source => (
                <div
                  key={source.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: tokens.spacing.sm,
                    backgroundColor: tokens.colors.sageLight,
                    borderRadius: tokens.radius.sm,
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: tokens.colors.bark }}>{source.name}</div>
                    <div style={{ fontSize: '11px', color: tokens.colors.gray400 }}>{source.url}</div>
                  </div>
                  <button
                    onClick={() => setSources(sources.filter(s => s.id !== source.id))}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: tokens.colors.gray400,
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: tokens.spacing.sm }}>
              <input
                type="text"
                placeholder="https://..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                style={{
                  flex: 1,
                  padding: tokens.spacing.sm,
                  border: `1px solid ${tokens.colors.gray200}`,
                  borderRadius: tokens.radius.sm,
                  fontSize: '13px',
                }}
              />
              <Button>Ajouter</Button>
            </div>
          </Panel>
        </div>
      </div>
    </main>
  );
};

// ============================================
// PAGE COURSES
// ============================================
const CoursesPage = () => (
  <main style={{
    maxWidth: '1400px',
    margin: '0 auto',
    padding: tokens.spacing.xl,
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: tokens.spacing.xl,
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: '600',
        color: tokens.colors.bark,
        margin: 0,
        letterSpacing: '-0.5px',
      }}>
        Liste de courses
      </h1>
      <Button>
        📄 Exporter en PDF
      </Button>
    </div>

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: tokens.spacing.lg,
    }}>
      {demoStores.map(store => (
        <Panel key={store.id} title={store.name}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.xs }}>
            {store.items.map((item, i) => (
              <label
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: tokens.spacing.sm,
                  padding: tokens.spacing.sm,
                  backgroundColor: tokens.colors.gray100,
                  borderRadius: tokens.radius.sm,
                  cursor: 'pointer',
                }}
              >
                <input type="checkbox" style={{ accentColor: tokens.colors.sage }} />
                <span style={{ fontSize: '13px', color: tokens.colors.gray800 }}>{item}</span>
              </label>
            ))}
          </div>
          <Button variant="dashed" style={{ width: '100%', marginTop: tokens.spacing.sm, fontSize: '12px' }}>
            + Ajouter un article
          </Button>
        </Panel>
      ))}
    </div>
  </main>
);

// ============================================
// PAGE ENSEIGNES
// ============================================
const EnseignesPage = () => (
  <main style={{
    maxWidth: '800px',
    margin: '0 auto',
    padding: tokens.spacing.xl,
  }}>
    <h1 style={{
      fontSize: '24px',
      fontWeight: '600',
      color: tokens.colors.bark,
      margin: `0 0 ${tokens.spacing.xl} 0`,
      letterSpacing: '-0.5px',
    }}>
      Mes enseignes
    </h1>

    <Panel title="Liste des enseignes" action={
      <Button variant="dashed" style={{ padding: `${tokens.spacing.xs} ${tokens.spacing.md}` }}>
        + Ajouter
      </Button>
    }>
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
        {demoStores.map((store, index) => (
          <div
            key={store.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: tokens.spacing.md,
              padding: tokens.spacing.md,
              backgroundColor: tokens.colors.gray100,
              borderRadius: tokens.radius.sm,
            }}
          >
            <span style={{
              width: '24px',
              height: '24px',
              backgroundColor: tokens.colors.sage,
              color: tokens.colors.white,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '600',
            }}>
              {index + 1}
            </span>
            <span style={{ flex: 1, fontSize: '14px', color: tokens.colors.gray800 }}>{store.name}</span>
            <button style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: tokens.colors.gray400,
              cursor: 'pointer',
            }}>
              ✏️
            </button>
          </div>
        ))}
      </div>
    </Panel>
  </main>
);

// ============================================
// APP PRINCIPALE
// ============================================
export default function App() {
  const [currentPage, setCurrentPage] = useState('Planning');
  const [selectedMeals, setSelectedMeals] = useState([
    { id: 1, name: 'Curry de pois chiches aux épinards' },
    { id: 3, name: 'Gratin de courge butternut' },
  ]);
  const [recurring, setRecurring] = useState(demoRecurring);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: tokens.colors.cream,
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      color: tokens.colors.gray800,
    }}>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {currentPage === 'Planning' && (
        <PlanningPage 
          selectedMeals={selectedMeals} 
          setSelectedMeals={setSelectedMeals}
          recurring={recurring}
          setRecurring={setRecurring}
        />
      )}
      {currentPage === 'Recettes' && <RecettesPage />}
      {currentPage === 'Courses' && <CoursesPage />}
      {currentPage === 'Enseignes' && <EnseignesPage />}
    </div>
  );
}
