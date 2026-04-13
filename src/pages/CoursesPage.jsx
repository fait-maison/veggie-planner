import { useState } from 'react';
import { tokens } from '../tokens';
import { generateShoppingList } from '../utils/generateShoppingList';
import { distributeByEnseigne } from '../utils/distributeByEnseigne';
import Button from '../components/Button';
import useLocalStorage from '../hooks/useLocalStorage';

const normalize = (s) => s.trim().toLowerCase();

const CoursesPage = ({ selectedRecipes, recurringItems, setRecurringItems, enseignes = [], setEnseignes, pantry = [], setPantry }) => {
  const allIngredients = generateShoppingList(selectedRecipes, pantry);

  const recurringNames = recurringItems.map(r => normalize(r.name));
  const ingredients = allIngredients.filter(i => !recurringNames.includes(normalize(i)));

  const [checkedItems, setCheckedItems] = useLocalStorage('veggie-checked',
    Object.fromEntries(recurringItems.map(r => [`recurring-${r.id}`, true]))
  );
  const [additionalItems, setAdditionalItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newRecurring, setNewRecurring] = useState('');
  const [dragOverId, setDragOverId] = useState(null);
  const [newPantryItem, setNewPantryItem] = useState('');
  const [pantryOpen, setPantryOpen] = useState(true);

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

  const addPantryItem = () => {
    const trimmed = newPantryItem.trim();
    if (!trimmed) return;
    const n = normalize(trimmed);
    if (!pantry.some(p => normalize(p) === n)) {
      setPantry(prev => [...prev, trimmed]);
    }
    setNewPantryItem('');
  };

  const removePantryItem = (item) => {
    setPantry(prev => prev.filter(p => p !== item));
  };

  const assignItem = (itemName, enseigneId) => {
    const normalized = normalize(itemName);
    setEnseignes(prev => prev.map(e => {
      const filtered = (e.items ?? []).filter(i => normalize(i) !== normalized);
      if (e.id === enseigneId) return { ...e, items: [...filtered, itemName.trim()] };
      return filtered.length !== (e.items ?? []).length ? { ...e, items: filtered } : e;
    }));
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
  const recipeDist = distributeByEnseigne(leftItems, enseignes);
  const recurringDist = distributeByEnseigne(recurringItems.map(r => r.name), enseignes);

  const sections = enseignes.map(e => ({
    id: e.id,
    name: e.name,
    recipeItems: recipeDist[e.id] ?? [],
    recurringItems: (recurringDist[e.id] ?? [])
      .map(name => recurringItems.find(r => normalize(r.name) === normalize(name)))
      .filter(Boolean),
  }));

  const unassignedRecipe = recipeDist.unassigned ?? [];
  const unassignedRecurring = (recurringDist.unassigned ?? [])
    .map(name => recurringItems.find(r => normalize(r.name) === normalize(name)))
    .filter(Boolean);

  return (
    <main style={{ maxWidth: '700px', margin: '0 auto', padding: tokens.spacing.xl }}>
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
            {pantry.length > 0 && <span> · {pantry.length} ingrédient{pantry.length !== 1 ? 's' : ''} exclus</span>}
            {enseignes.length > 0 && unassignedRecipe.length > 0 && <span> · glissez les articles pour les assigner à une enseigne</span>}
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

      {/* Panel : Ce que j'ai déjà */}
      <div style={{
        backgroundColor: tokens.colors.white,
        borderRadius: tokens.radius.md,
        border: `1px solid ${tokens.colors.sand}`,
        marginBottom: tokens.spacing.lg,
        boxShadow: tokens.shadow.sm,
        overflow: 'hidden',
      }}>
        <button
          onClick={() => setPantryOpen(o => !o)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            borderBottom: pantryOpen ? `1px solid ${tokens.colors.sand}` : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: tokens.colors.gray600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Ce que j'ai déjà
            </span>
            {pantry.length > 0 && (
              <span style={{
                fontSize: '11px',
                fontWeight: '600',
                color: tokens.colors.white,
                backgroundColor: tokens.colors.terracotta,
                borderRadius: '10px',
                padding: '1px 7px',
              }}>
                {pantry.length}
              </span>
            )}
          </div>
          <span style={{ fontSize: '12px', color: tokens.colors.gray400, transform: pantryOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>▼</span>
        </button>

        {pantryOpen && (
          <div style={{ padding: tokens.spacing.md }}>
            <p style={{ fontSize: '13px', color: tokens.colors.gray400, margin: `0 0 ${tokens.spacing.sm} 0` }}>
              Ces ingrédients seront automatiquement exclus de votre liste de courses.
            </p>
            {pantry.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: tokens.spacing.sm, marginBottom: tokens.spacing.sm }}>
                {pantry.map(item => (
                  <div key={item} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: tokens.colors.sageLight,
                    borderRadius: tokens.radius.sm,
                    padding: '4px 10px',
                    fontSize: '13px',
                    color: tokens.colors.sageDark,
                  }}>
                    <span>{item}</span>
                    <button
                      onClick={() => removePantryItem(item)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: tokens.colors.sage, fontSize: '14px', lineHeight: 1, padding: '0 0 0 2px' }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: tokens.spacing.sm }}>
              <input
                type="text"
                value={newPantryItem}
                onChange={e => setNewPantryItem(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addPantryItem()}
                placeholder="Ex : tofu, lentilles…"
                style={inputStyle}
              />
              <Button onClick={addPantryItem} disabled={!newPantryItem.trim()}>Ajouter</Button>
              {pantry.length > 0 && (
                <Button variant="ghost" onClick={() => setPantry([])}>Tout vider</Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* À distribuer + Non assigné fusionnés */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm, marginBottom: tokens.spacing.lg }}>
        <EnseigneSection
          sectionKey="unassigned"
          title="À distribuer"
          isUnassigned={true}
          isEmpty={unassignedRecipe.length === 0 && unassignedRecurring.length === 0}
          dragOverId={dragOverId}
          onDragOver={() => setDragOverId('unassigned')}
          onDragLeave={() => setDragOverId(null)}
          onDrop={(itemName) => { assignItem(itemName, null); setDragOverId(null); }}
        >
          {unassignedRecipe.map(item => {
            const key = ingredients.includes(item) ? `ingredient-${item}` : `additional-${item}`;
            const isAdditional = additionalItems.includes(item);
            return (
              <IngredientRow
                key={item}
                item={item}
                type="recipe"
                checked={!!checkedItems[key]}
                onToggle={() => toggleCheck(key)}
                onRemove={isAdditional ? () => removeAdditional(item) : undefined}
              />
            );
          })}
          {unassignedRecurring.map(r => (
            <IngredientRow
              key={`recurring-${r.id}`}
              item={r.name}
              type="recurring"
              checked={!!checkedItems[`recurring-${r.id}`]}
              onToggle={() => toggleCheck(`recurring-${r.id}`)}
              onRemove={() => removeRecurring(r.id)}
            />
          ))}
        </EnseigneSection>

        <div style={{
          backgroundColor: tokens.colors.white,
          borderRadius: tokens.radius.md,
          border: `1px solid ${tokens.colors.sand}`,
          padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
        }}>
          <div style={{ display: 'flex', gap: tokens.spacing.sm, marginBottom: tokens.spacing.sm }}>
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

      {/* Sections par enseigne */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm, marginBottom: tokens.spacing.lg }}>
        {sections.map(s => (
          <EnseigneSection
            key={s.id}
            sectionKey={s.id}
            title={s.name}
            isEmpty={s.recipeItems.length === 0 && s.recurringItems.length === 0}
            dragOverId={dragOverId}
            onDragOver={() => setDragOverId(s.id)}
            onDragLeave={() => setDragOverId(null)}
            onDrop={(itemName) => { assignItem(itemName, s.id); setDragOverId(null); }}
          >
            {s.recipeItems.map(item => {
              const key = ingredients.includes(item) ? `ingredient-${item}` : `additional-${item}`;
              const isAdditional = additionalItems.includes(item);
              return (
                <IngredientRow
                  key={`recipe-${item}`}
                  item={item}
                  type="recipe"
                  checked={!!checkedItems[key]}
                  onToggle={() => toggleCheck(key)}
                  onRemove={isAdditional ? () => removeAdditional(item) : undefined}
                />
              );
            })}
            {s.recurringItems.map(r => (
              <IngredientRow
                key={`recurring-${r.id}`}
                item={r.name}
                type="recurring"
                checked={!!checkedItems[`recurring-${r.id}`]}
                onToggle={() => toggleCheck(`recurring-${r.id}`)}
                onRemove={() => removeRecurring(r.id)}
              />
            ))}
          </EnseigneSection>
        ))}
      </div>

    </main>
  );
};

// ---- Composants internes ----

const ItemBadge = ({ type }) => (
  <span style={{
    fontSize: '10px',
    fontWeight: '600',
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
    padding: '2px 6px',
    borderRadius: '999px',
    flexShrink: 0,
    backgroundColor: type === 'recipe' ? tokens.colors.sageLight : '#F5EDE6',
    color: type === 'recipe' ? tokens.colors.sageDark : tokens.colors.terracotta,
  }}>
    {type === 'recipe' ? 'recette' : 'récurrent'}
  </span>
);

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

const IngredientRow = ({ item, type, checked, onToggle, onRemove }) => (
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
        flex: 1,
      }}>
        {item}
      </span>
    </div>
    <div style={{ width: '80px', display: 'flex', justifyContent: 'flex-end', paddingRight: tokens.spacing.sm, flexShrink: 0 }}>
      {type && <ItemBadge type={type} />}
    </div>
    {onRemove ? (
      <button
        onClick={onRemove}
        title="Supprimer"
        style={{
          background: 'none',
          border: 'none',
          color: tokens.colors.gray400,
          cursor: 'pointer',
          fontSize: '16px',
          padding: 0,
          lineHeight: 1,
          width: '32px',
          flexShrink: 0,
          textAlign: 'center',
        }}
      >
        ×
      </button>
    ) : (
      <div style={{ width: '32px', flexShrink: 0 }} />
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
