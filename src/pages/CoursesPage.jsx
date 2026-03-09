import { useState } from 'react';
import { tokens } from '../tokens';
import { generateShoppingList } from '../utils/generateShoppingList';
import { distributeByEnseigne } from '../utils/distributeByEnseigne';
import Button from '../components/Button';
import useLocalStorage from '../hooks/useLocalStorage';

const normalize = (s) => s.trim().toLowerCase();

const CoursesPage = ({ selectedRecipes, recurringItems, setRecurringItems, enseignes = [] }) => {
  const allIngredients = generateShoppingList(selectedRecipes);

  const recurringNames = recurringItems.map(r => normalize(r.name));
  const ingredients = allIngredients.filter(i => !recurringNames.includes(normalize(i)));

  const [checkedItems, setCheckedItems] = useLocalStorage('veggie-checked',
    Object.fromEntries(recurringItems.map(r => [`recurring-${r.id}`, true]))
  );
  const [itemEnseigneMap, setItemEnseigneMap] = useLocalStorage('veggie-item-enseigne', {});
  const [additionalItems, setAdditionalItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newRecurring, setNewRecurring] = useState('');
  const [dragOverId, setDragOverId] = useState(null); // 'left-{enseigneId}' | 'right-{enseigneId}'

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
    if (!isDuplicate) setAdditionalItems(prev => [...prev, trimmed]);
    setNewItem('');
  };

  const removeAdditional = (item) => {
    setAdditionalItems(prev => prev.filter(i => i !== item));
  };

  const addRecurring = () => {
    const trimmed = newRecurring.trim();
    if (!trimmed) return;
    const n = normalize(trimmed);
    if (!recurringNames.includes(n)) {
      setRecurringItems(prev => [...prev, { id: Date.now(), name: trimmed }]);
    }
    setNewRecurring('');
  };

  const removeRecurring = (id) => {
    setRecurringItems(prev => prev.filter(r => r.id !== id));
    setCheckedItems(prev => { const next = { ...prev }; delete next[`recurring-${id}`]; return next; });
  };

  const assignItem = (itemName, enseigneId) => {
    setItemEnseigneMap(prev => {
      const next = { ...prev };
      if (enseigneId === 'unassigned') {
        delete next[normalize(itemName)];
      } else {
        next[normalize(itemName)] = enseigneId;
      }
      return next;
    });
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

  const leftItems = [...ingredients, ...additionalItems];
  const leftDist = distributeByEnseigne(leftItems, enseignes, itemEnseigneMap);
  const rightItems = recurringItems.map(r => r.name);
  const rightDist = distributeByEnseigne(rightItems, enseignes, itemEnseigneMap);

  // Toutes les enseignes sont toujours visibles (drop targets), "Non assigné" seulement si non-vide
  const leftSections = [
    ...enseignes.map(e => ({ id: e.id, name: e.name, items: leftDist[e.id] ?? [] })),
    ...(leftDist.unassigned.length > 0 ? [{ id: 'unassigned', name: 'Non assigné', items: leftDist.unassigned }] : []),
  ];

  const rightSections = [
    ...enseignes.map(e => ({ id: e.id, name: e.name, items: rightDist[e.id] ?? [] })),
    ...(rightDist.unassigned.length > 0 ? [{ id: 'unassigned', name: 'Non assigné', items: rightDist.unassigned }] : []),
  ];

  const leftCount = leftItems.length;

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
          <h1 style={{ fontSize: '26px', fontWeight: '600', color: tokens.colors.bark, margin: 0, letterSpacing: '-0.5px' }}>
            Liste de courses
          </h1>
          <p style={{ fontSize: '14px', color: tokens.colors.gray400, margin: `${tokens.spacing.xs} 0 0 0` }}>
            {checkedCount}/{allItemKeys.length} articles cochés · {selectedRecipes.length} plat{selectedRecipes.length !== 1 ? 's' : ''}
            {enseignes.length > 0 && <span> · glissez les articles pour les assigner à une enseigne</span>}
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

        {/* Colonne gauche : ingrédients */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
          <div style={{
            fontSize: '13px',
            fontWeight: '600',
            color: tokens.colors.gray600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: tokens.spacing.xs,
          }}>
            Ingrédients des recettes
            <span style={{ marginLeft: tokens.spacing.sm, fontWeight: '400', color: tokens.colors.gray400 }}>
              {leftCount} articles
            </span>
          </div>

          {leftSections.map(section => (
            <EnseigneSection
              key={`left-${section.id}`}
              sectionKey={`left-${section.id}`}
              title={section.name}
              isUnassigned={section.id === 'unassigned'}
              isEmpty={section.items.length === 0}
              dragOverId={dragOverId}
              onDragOver={() => setDragOverId(`left-${section.id}`)}
              onDragLeave={() => setDragOverId(null)}
              onDrop={(itemName) => { assignItem(itemName, section.id); setDragOverId(null); }}
            >
              {section.items.map(item => {
                const key = ingredients.includes(item) ? `ingredient-${item}` : `additional-${item}`;
                const isAdditional = additionalItems.includes(item);
                return (
                  <IngredientRow
                    key={item}
                    item={item}
                    checked={!!checkedItems[key]}
                    onToggle={() => toggleCheck(key)}
                    onRemove={isAdditional ? () => removeAdditional(item) : undefined}
                  />
                );
              })}
            </EnseigneSection>
          ))}

          {/* Ajout manuel */}
          <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.radius.md,
            border: `1px solid ${tokens.colors.sand}`,
            padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
          }}>
            <div style={{ display: 'flex', gap: tokens.spacing.sm }}>
              <input
                type="text"
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addItem()}
                placeholder="Ajouter un article…"
                style={inputStyle}
              />
              <Button onClick={addItem} disabled={!newItem.trim()}>Ajouter</Button>
            </div>
          </div>
        </div>

        {/* Colonne droite : récurrents */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
          <div style={{
            fontSize: '13px',
            fontWeight: '600',
            color: tokens.colors.gray600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: tokens.spacing.xs,
          }}>
            Produits récurrents
            <span style={{ marginLeft: tokens.spacing.sm, fontWeight: '400', color: tokens.colors.gray400 }}>
              {recurringItems.length} articles
            </span>
          </div>

          {rightSections.map(section => (
            <EnseigneSection
              key={`right-${section.id}`}
              sectionKey={`right-${section.id}`}
              title={section.name}
              isUnassigned={section.id === 'unassigned'}
              isEmpty={section.items.length === 0}
              dragOverId={dragOverId}
              onDragOver={() => setDragOverId(`right-${section.id}`)}
              onDragLeave={() => setDragOverId(null)}
              onDrop={(itemName) => { assignItem(itemName, section.id); setDragOverId(null); }}
            >
              {section.items.map(itemName => {
                const item = recurringItems.find(r => r.name === itemName);
                if (!item) return null;
                return (
                  <IngredientRow
                    key={item.id}
                    item={item.name}
                    checked={!!checkedItems[`recurring-${item.id}`]}
                    onToggle={() => toggleCheck(`recurring-${item.id}`)}
                    onRemove={() => removeRecurring(item.id)}
                  />
                );
              })}
            </EnseigneSection>
          ))}

          {/* Ajout récurrent */}
          <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.radius.md,
            border: `1px solid ${tokens.colors.sand}`,
            padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
          }}>
            <div style={{ display: 'flex', gap: tokens.spacing.sm }}>
              <input
                type="text"
                value={newRecurring}
                onChange={e => setNewRecurring(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addRecurring()}
                placeholder="Ajouter un produit récurrent…"
                style={inputStyle}
              />
              <Button onClick={addRecurring} disabled={!newRecurring.trim()}>Ajouter</Button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

// ---- Composants internes ----

const EnseigneSection = ({
  sectionKey, title, isUnassigned, isEmpty, children,
  dragOverId, onDragOver, onDragLeave, onDrop,
}) => {
  const isOver = dragOverId === sectionKey;

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); onDragOver(); }}
      onDragLeave={onDragLeave}
      onDrop={(e) => {
        e.preventDefault();
        const itemName = e.dataTransfer.getData('text/plain');
        if (itemName) onDrop(itemName);
      }}
      style={{
        backgroundColor: tokens.colors.white,
        borderRadius: tokens.radius.md,
        border: isOver
          ? `2px solid ${tokens.colors.sage}`
          : `1px solid ${isUnassigned ? tokens.colors.gray200 : tokens.colors.sand}`,
        overflow: 'hidden',
        transition: 'border-color 0.15s',
        boxShadow: isOver ? `0 0 0 3px ${tokens.colors.sageLight}` : tokens.shadow.sm,
      }}
    >
      <div style={{
        padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
        borderBottom: `1px solid ${tokens.colors.sand}`,
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing.sm,
        backgroundColor: isUnassigned ? tokens.colors.gray100 : tokens.colors.sageLight,
      }}>
        <span style={{
          fontWeight: '500',
          fontSize: '13px',
          color: isUnassigned ? tokens.colors.gray400 : tokens.colors.sageDark,
          flex: 1,
        }}>
          {title}
        </span>
      </div>
      <div style={{ padding: `${tokens.spacing.xs} 0` }}>
        {children}
        {isEmpty && (
          <div style={{
            padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
            fontSize: '12px',
            color: tokens.colors.gray400,
            fontStyle: 'italic',
            textAlign: 'center',
          }}>
            Glissez des articles ici
          </div>
        )}
      </div>
    </div>
  );
};

const IngredientRow = ({ item, checked, onToggle, onRemove }) => (
  <div
    draggable
    onDragStart={(e) => {
      e.dataTransfer.setData('text/plain', item);
      e.dataTransfer.effectAllowed = 'move';
    }}
    style={{
      display: 'flex',
      alignItems: 'center',
      opacity: checked ? 0.45 : 1,
      cursor: 'grab',
    }}
  >
    <div
      onClick={onToggle}
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing.md,
        padding: `9px ${tokens.spacing.lg}`,
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
