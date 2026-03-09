import { useState } from 'react';
import { tokens } from '../tokens';
import { generateShoppingList } from '../utils/generateShoppingList';
import Button from '../components/Button';
import useLocalStorage from '../hooks/useLocalStorage';

const normalize = (s) => s.trim().toLowerCase();

const CoursesPage = ({ selectedRecipes, recurringItems, setRecurringItems }) => {
  const allIngredients = generateShoppingList(selectedRecipes);

  // Filtre les ingrédients déjà présents dans les récurrents
  const recurringNames = recurringItems.map(r => normalize(r.name));
  const ingredients = allIngredients.filter(i => !recurringNames.includes(normalize(i)));

  const [checkedItems, setCheckedItems] = useLocalStorage('veggie-checked',
    Object.fromEntries(recurringItems.map(r => [`recurring-${r.id}`, true]))
  );
  const [additionalItems, setAdditionalItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newRecurring, setNewRecurring] = useState('');

  const allItemKeys = [
    ...ingredients.map(i => `ingredient-${i}`),
    ...recurringItems.map(r => `recurring-${r.id}`),
    ...additionalItems.map(i => `additional-${i}`),
  ];
  const checkedCount = allItemKeys.filter(k => checkedItems[k]).length;

  const toggleCheck = (key) => {
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const addItem = () => {
    const trimmed = newItem.trim();
    if (!trimmed) return;
    const n = normalize(trimmed);
    const isDuplicate =
      ingredients.some(i => normalize(i) === n) ||
      additionalItems.some(i => normalize(i) === n) ||
      recurringNames.includes(n);
    if (!isDuplicate) {
      setAdditionalItems(prev => [...prev, trimmed]);
    }
    setNewItem('');
  };

  const removeAdditional = (item) => {
    setAdditionalItems(prev => prev.filter(i => i !== item));
  };

  const addRecurring = () => {
    const trimmed = newRecurring.trim();
    if (!trimmed) return;
    const n = normalize(trimmed);
    const isDuplicate = recurringNames.includes(n);
    if (!isDuplicate) {
      setRecurringItems(prev => [...prev, { id: Date.now(), name: trimmed }]);
    }
    setNewRecurring('');
  };

  const removeRecurring = (id) => {
    setRecurringItems(prev => prev.filter(r => r.id !== id));
    setCheckedItems(prev => { const next = { ...prev }; delete next[`recurring-${id}`]; return next; });
  };

  if (selectedRecipes.length === 0 && recurringItems.length === 0) {
    return (
      <main style={{ maxWidth: '700px', margin: '0 auto', padding: tokens.spacing.xl, textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: tokens.spacing.lg }}>🛒</div>
        <p style={{ color: tokens.colors.gray400, fontSize: '16px', margin: 0 }}>
          Sélectionnez des plats dans le Planning<br />pour générer votre liste de courses.
        </p>
      </main>
    );
  }

  const leftCount = ingredients.length + additionalItems.length;

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: tokens.spacing.xl }}>
      {/* En-tête */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: tokens.spacing.xl,
      }}>
        <div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: tokens.colors.bark,
            margin: 0,
            letterSpacing: '-0.5px',
          }}>
            Liste de courses
          </h1>
          <p style={{ fontSize: '14px', color: tokens.colors.gray400, margin: `${tokens.spacing.xs} 0 0 0` }}>
            {checkedCount}/{allItemKeys.length} articles cochés · {selectedRecipes.length} plat{selectedRecipes.length !== 1 ? 's' : ''}
          </p>
        </div>
        {checkedCount > 0 && (
          <Button variant="ghost" onClick={() => setCheckedItems(
            Object.fromEntries(recurringItems.map(r => [`recurring-${r.id}`, false]))
          )}>
            Tout décocher
          </Button>
        )}
      </div>

      {/* Deux colonnes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: tokens.spacing.lg, alignItems: 'start' }}>

        {/* Colonne gauche : ingrédients des recettes + ajout manuel */}
        <Section title="Ingrédients des recettes" count={leftCount}>
          {ingredients.map(item => (
            <IngredientRow
              key={item}
              item={item}
              checked={!!checkedItems[`ingredient-${item}`]}
              onToggle={() => toggleCheck(`ingredient-${item}`)}
            />
          ))}
          {additionalItems.map(item => (
            <IngredientRow
              key={item}
              item={item}
              checked={!!checkedItems[`additional-${item}`]}
              onToggle={() => toggleCheck(`additional-${item}`)}
              onRemove={() => removeAdditional(item)}
            />
          ))}
          <div style={{ padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`, borderTop: `1px solid ${tokens.colors.sand}` }}>
            <div style={{ display: 'flex', gap: tokens.spacing.sm }}>
              <input
                type="text"
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addItem()}
                placeholder="Ajouter un article…"
                style={inputStyle}
              />
              <Button onClick={addItem} disabled={!newItem.trim()}>
                Ajouter
              </Button>
            </div>
          </div>
        </Section>

        {/* Colonne droite : produits récurrents */}
        <Section
          title="Produits récurrents"
          count={recurringItems.length}
          badge={{ text: 'Chaque semaine', color: tokens.colors.terracotta }}
        >
          {recurringItems.map(item => (
            <IngredientRow
              key={item.id}
              item={item.name}
              checked={!!checkedItems[`recurring-${item.id}`]}
              onToggle={() => toggleCheck(`recurring-${item.id}`)}
              onRemove={() => removeRecurring(item.id)}
            />
          ))}
          <div style={{ padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`, borderTop: `1px solid ${tokens.colors.sand}` }}>
            <div style={{ display: 'flex', gap: tokens.spacing.sm }}>
              <input
                type="text"
                value={newRecurring}
                onChange={e => setNewRecurring(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addRecurring()}
                placeholder="Ajouter un produit récurrent…"
                style={inputStyle}
              />
              <Button onClick={addRecurring} disabled={!newRecurring.trim()}>
                Ajouter
              </Button>
            </div>
          </div>
        </Section>

      </div>
    </main>
  );
};

// ---- Composants internes ----

const Section = ({ title, count, badge, children }) => (
  <div style={{
    backgroundColor: tokens.colors.white,
    borderRadius: tokens.radius.md,
    boxShadow: tokens.shadow.sm,
    border: `1px solid ${tokens.colors.sand}`,
    overflow: 'hidden',
  }}>
    <div style={{
      padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
      borderBottom: `1px solid ${tokens.colors.sand}`,
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.sm,
    }}>
      <span style={{ fontWeight: '500', color: tokens.colors.bark, fontSize: '15px', flex: 1 }}>
        {title}
      </span>
      {badge && (
        <span style={{
          fontSize: '11px',
          backgroundColor: `${badge.color}22`,
          color: badge.color,
          padding: '2px 8px',
          borderRadius: '99px',
          fontWeight: '500',
        }}>
          {badge.text}
        </span>
      )}
      {count !== undefined && (
        <span style={{ fontSize: '13px', color: tokens.colors.gray400 }}>{count} articles</span>
      )}
    </div>
    <div style={{ padding: `${tokens.spacing.sm} 0` }}>{children}</div>
  </div>
);

const IngredientRow = ({ item, checked, onToggle, onRemove }) => (
  <div style={{ display: 'flex', alignItems: 'center', opacity: checked ? 0.45 : 1 }}>
    <div
      onClick={onToggle}
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing.md,
        padding: `10px ${tokens.spacing.lg}`,
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <div style={{
        width: '18px',
        height: '18px',
        borderRadius: '4px',
        border: checked ? 'none' : `2px solid ${tokens.colors.gray400}`,
        backgroundColor: checked ? tokens.colors.sage : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.15s',
      }}>
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span style={{
        fontSize: '14px',
        color: tokens.colors.gray800,
        textDecoration: checked ? 'line-through' : 'none',
      }}>
        {item}
      </span>
    </div>
    {onRemove && (
      <button
        onClick={onRemove}
        title="Supprimer"
        style={{
          background: 'none',
          border: 'none',
          color: tokens.colors.gray400,
          cursor: 'pointer',
          fontSize: '16px',
          padding: `0 ${tokens.spacing.md}`,
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        ×
      </button>
    )}
  </div>
);

const inputStyle = {
  flex: 1,
  padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
  borderRadius: tokens.radius.sm,
  border: `1px solid ${tokens.colors.sand}`,
  fontSize: '14px',
  color: tokens.colors.gray800,
  backgroundColor: tokens.colors.cream,
  outline: 'none',
};

export default CoursesPage;
