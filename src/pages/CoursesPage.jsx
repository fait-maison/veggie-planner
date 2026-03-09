import { useState } from 'react';
import { tokens } from '../tokens';
import { generateShoppingList } from '../utils/generateShoppingList';
import Button from '../components/Button';

const CoursesPage = ({ selectedRecipes }) => {
  const ingredients = generateShoppingList(selectedRecipes);
  const [checkedItems, setCheckedItems] = useState({});
  const [additionalItems, setAdditionalItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  const allItems = [...ingredients, ...additionalItems];
  const checkedCount = allItems.filter(item => checkedItems[item]).length;

  const toggleCheck = (item) => {
    setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const addItem = () => {
    const trimmed = newItem.trim();
    if (trimmed && !allItems.map(i => i.toLowerCase()).includes(trimmed.toLowerCase())) {
      setAdditionalItems(prev => [...prev, trimmed]);
      setNewItem('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addItem();
  };

  const removeAdditional = (item) => {
    setAdditionalItems(prev => prev.filter(i => i !== item));
  };

  if (selectedRecipes.length === 0) {
    return (
      <main style={{
        maxWidth: '700px',
        margin: '0 auto',
        padding: tokens.spacing.xl,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '64px', marginBottom: tokens.spacing.lg }}>🛒</div>
        <p style={{ color: tokens.colors.gray400, fontSize: '16px', margin: 0 }}>
          Sélectionnez des plats dans le Planning<br />pour générer votre liste de courses.
        </p>
      </main>
    );
  }

  return (
    <main style={{
      maxWidth: '700px',
      margin: '0 auto',
      padding: tokens.spacing.xl,
    }}>
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
          <p style={{
            fontSize: '14px',
            color: tokens.colors.gray400,
            margin: `${tokens.spacing.xs} 0 0 0`,
          }}>
            {checkedCount}/{allItems.length} articles cochés · {selectedRecipes.length} plats
          </p>
        </div>
        {checkedCount > 0 && (
          <Button variant="ghost" onClick={() => setCheckedItems({})}>
            Tout décocher
          </Button>
        )}
      </div>

      {/* Section ingrédients des recettes */}
      <div style={{
        backgroundColor: tokens.colors.white,
        borderRadius: tokens.radius.md,
        boxShadow: tokens.shadow.sm,
        border: `1px solid ${tokens.colors.sand}`,
        marginBottom: tokens.spacing.lg,
        overflow: 'hidden',
      }}>
        <div style={{
          padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
          borderBottom: `1px solid ${tokens.colors.sand}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontWeight: '500', color: tokens.colors.bark, fontSize: '15px' }}>
            Ingrédients des recettes
          </span>
          <span style={{ fontSize: '13px', color: tokens.colors.gray400 }}>
            {ingredients.length} articles
          </span>
        </div>
        <div style={{ padding: `${tokens.spacing.sm} 0` }}>
          {ingredients.map(item => (
            <IngredientRow
              key={item}
              item={item}
              checked={!!checkedItems[item]}
              onToggle={() => toggleCheck(item)}
            />
          ))}
        </div>
      </div>

      {/* Section ajout manuel */}
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
          fontWeight: '500',
          color: tokens.colors.bark,
          fontSize: '15px',
        }}>
          Ajouter un article
        </div>
        <div style={{ padding: tokens.spacing.md }}>
          <div style={{ display: 'flex', gap: tokens.spacing.sm }}>
            <input
              type="text"
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ex : Pain de campagne…"
              style={{
                flex: 1,
                padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                borderRadius: tokens.radius.sm,
                border: `1px solid ${tokens.colors.sand}`,
                fontSize: '14px',
                color: tokens.colors.gray800,
                backgroundColor: tokens.colors.cream,
                outline: 'none',
              }}
            />
            <Button onClick={addItem} disabled={!newItem.trim()}>
              Ajouter
            </Button>
          </div>
          {additionalItems.length > 0 && (
            <div style={{ marginTop: tokens.spacing.sm }}>
              {additionalItems.map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center' }}>
                  <IngredientRow
                    item={item}
                    checked={!!checkedItems[item]}
                    onToggle={() => toggleCheck(item)}
                    style={{ flex: 1 }}
                  />
                  <button
                    onClick={() => removeAdditional(item)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: tokens.colors.gray400,
                      cursor: 'pointer',
                      fontSize: '16px',
                      padding: `0 ${tokens.spacing.md}`,
                      lineHeight: 1,
                    }}
                    title="Supprimer"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

const IngredientRow = ({ item, checked, onToggle, style = {} }) => (
  <div
    onClick={onToggle}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.md,
      padding: `10px ${tokens.spacing.lg}`,
      cursor: 'pointer',
      userSelect: 'none',
      opacity: checked ? 0.45 : 1,
      ...style,
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
);

export default CoursesPage;
