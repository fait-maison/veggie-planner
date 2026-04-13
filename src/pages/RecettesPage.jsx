import { useState } from 'react';
import { tokens } from '../tokens';
import Card from '../components/Card';
import Button from '../components/Button';

// ---- Modal d'ajout de recette ----

const AddRecipeModal = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [url, setUrl] = useState('');
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSource, setImportSource] = useState('Manuel');

  const canSubmit = name.trim() && ingredients.trim();

  const handleImport = async () => {
    if (!url.trim()) return;
    setImporting(true);
    setImportError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Erreur lors de l\'import');
      setName(data.name);
      setIngredients(data.ingredients.join(', '));
      setImportSource('Import');
    } catch (e) {
      setImportError(e.message);
    } finally {
      setImporting(false);
    }
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onAdd({
      id: Date.now(),
      name: name.trim(),
      ingredients: ingredients.split(',').map(i => i.trim()).filter(Boolean),
      source: importSource,
      favorite: false,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: tokens.spacing.lg,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        backgroundColor: tokens.colors.white,
        borderRadius: tokens.radius.lg,
        padding: tokens.spacing.xl,
        width: '100%',
        maxWidth: '480px',
        boxShadow: tokens.shadow.lg,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: tokens.spacing.lg,
        }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: tokens.colors.bark }}>
            Nouvelle recette
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              color: tokens.colors.gray400,
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
          <Field label="Importer depuis une URL (optionnel)">
            <div style={{ display: 'flex', gap: tokens.spacing.sm }}>
              <input
                value={url}
                onChange={e => { setUrl(e.target.value); setImportError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleImport()}
                placeholder="https://www.pickuplimes.com/recipe/…"
                style={{ ...inputStyle, flex: 1 }}
              />
              <Button variant="ghost" onClick={handleImport} disabled={importing || !url.trim()}>
                {importing ? '…' : 'Importer'}
              </Button>
            </div>
            {importError && (
              <p style={{ margin: `${tokens.spacing.xs} 0 0`, fontSize: '12px', color: '#C0392B' }}>
                {importError}
              </p>
            )}
          </Field>

          <Field label="Nom de la recette *">
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex : Curry de légumes au lait de coco"
              style={inputStyle}
            />
          </Field>

          <Field label="Ingrédients * (séparés par des virgules)">
            <input
              value={ingredients}
              onChange={e => setIngredients(e.target.value)}
              placeholder="Ex : Carottes, Lait de coco, Curry, Riz"
              style={inputStyle}
            />
          </Field>

          <div style={{ display: 'flex', gap: tokens.spacing.sm, justifyContent: 'flex-end', marginTop: tokens.spacing.sm }}>
            <Button variant="ghost" onClick={onClose}>Annuler</Button>
            <Button onClick={handleSubmit} disabled={!canSubmit}>
              Ajouter la recette
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div>
    <label style={{
      display: 'block',
      fontSize: '13px',
      fontWeight: '500',
      color: tokens.colors.gray600,
      marginBottom: tokens.spacing.xs,
    }}>
      {label}
    </label>
    {children}
  </div>
);

const inputStyle = {
  width: '100%',
  padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
  borderRadius: tokens.radius.sm,
  border: `1px solid ${tokens.colors.sand}`,
  fontSize: '14px',
  color: tokens.colors.gray800,
  backgroundColor: tokens.colors.cream,
  outline: 'none',
  boxSizing: 'border-box',
};

// ---- Modal d'édition de recette ----

const EditRecipeModal = ({ recipe, onClose, onSave }) => {
  const [ingredients, setIngredients] = useState((recipe.ingredients || []).join(', '));

  const canSubmit = ingredients.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSave({
      ...recipe,
      ingredients: ingredients.split(',').map(i => i.trim()).filter(Boolean),
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: tokens.spacing.lg,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        backgroundColor: tokens.colors.white,
        borderRadius: tokens.radius.lg,
        padding: tokens.spacing.xl,
        width: '100%',
        maxWidth: '480px',
        boxShadow: tokens.shadow.lg,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: tokens.spacing.lg,
        }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: tokens.colors.bark }}>
            Modifier les ingrédients
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '20px', color: tokens.colors.gray400, cursor: 'pointer', lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: tokens.colors.bark }}>
            {recipe.name}
          </p>

          <Field label="Ingrédients (séparés par des virgules)">
            <textarea
              autoFocus
              value={ingredients}
              onChange={e => setIngredients(e.target.value)}
              placeholder="Ex : Carottes, Lait de coco, Curry, Riz"
              rows={5}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.5' }}
            />
          </Field>

          <div style={{ display: 'flex', gap: tokens.spacing.sm, justifyContent: 'flex-end', marginTop: tokens.spacing.sm }}>
            <Button variant="ghost" onClick={onClose}>Annuler</Button>
            <Button onClick={handleSubmit} disabled={!canSubmit}>
              Enregistrer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---- Page principale ----

const RecettesPage = ({ recipes, setRecipes }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = recipes.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.ingredients || []).some(i => i.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleFavorite = (id) => {
    setRecipes(prev => prev.map(r => r.id === id ? { ...r, favorite: !r.favorite } : r));
  };

  const deleteRecipe = (id) => {
    if (window.confirm('Supprimer cette recette définitivement ?')) {
      setRecipes(prev => prev.filter(r => r.id !== id));
    }
  };

  const addRecipe = (recipe) => {
    setRecipes(prev => [...prev, recipe]);
    setShowModal(false);
  };

  const updateRecipe = (updated) => {
    setRecipes(prev => prev.map(r => r.id === updated.id ? updated : r));
    setEditingRecipe(null);
  };

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: tokens.spacing.xl }}>
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
            Mes recettes
          </h1>
          <p style={{ fontSize: '14px', color: tokens.colors.gray400, margin: `${tokens.spacing.xs} 0 0 0` }}>
            {recipes.length} recette{recipes.length !== 1 ? 's' : ''} enregistrée{recipes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>+ Nouvelle recette</Button>
      </div>

      {/* Recherche */}
      <div style={{ marginBottom: tokens.spacing.lg }}>
        <input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Rechercher une recette ou un ingrédient…"
          style={{ ...inputStyle, maxWidth: '400px' }}
        />
      </div>

      {/* Liste */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
        {filtered.map(recipe => (
          <Card key={recipe.id}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: tokens.spacing.md,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm, flexWrap: 'wrap' }}>
                  <h3 style={{
                    fontSize: '15px',
                    fontWeight: '500',
                    color: tokens.colors.bark,
                    margin: 0,
                  }}>
                    {recipe.name}
                  </h3>
                  {(recipe.source === 'Manuel' || recipe.source === 'Import') && (
                    <span style={{
                      fontSize: '11px',
                      backgroundColor: recipe.source === 'Import' ? tokens.colors.sand : tokens.colors.sageLight,
                      color: recipe.source === 'Import' ? tokens.colors.barkLight : tokens.colors.sageDark,
                      padding: '2px 8px',
                      borderRadius: '99px',
                      fontWeight: '500',
                    }}>
                      {recipe.source}
                    </span>
                  )}
                </div>
                {recipe.ingredients?.length > 0 && (
                  <div style={{ marginTop: tokens.spacing.xs, fontSize: '13px', color: tokens.colors.gray400 }}>
                    <span style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'inline-block',
                      maxWidth: '500px',
                      verticalAlign: 'bottom',
                    }}>
                      {recipe.ingredients.join(', ')}
                    </span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: tokens.spacing.xs, flexShrink: 0 }}>
                <button
                  onClick={() => toggleFavorite(recipe.id)}
                  title={recipe.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  style={iconButtonStyle}
                >
                  {recipe.favorite ? '❤️' : '🤍'}
                </button>
                <button
                  onClick={() => setEditingRecipe(recipe)}
                  title="Modifier les ingrédients"
                  style={iconButtonStyle}
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteRecipe(recipe.id)}
                  title="Supprimer"
                  style={{ ...iconButtonStyle, color: tokens.colors.gray400 }}
                >
                  🗑️
                </button>
              </div>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: tokens.spacing.xxl, color: tokens.colors.gray400 }}>
            <div style={{ fontSize: '48px', marginBottom: tokens.spacing.md }}>📖</div>
            <p style={{ margin: 0, fontSize: '15px' }}>
              {searchTerm ? 'Aucune recette trouvée' : 'Aucune recette enregistrée'}
            </p>
          </div>
        )}
      </div>

      {showModal && <AddRecipeModal onClose={() => setShowModal(false)} onAdd={addRecipe} />}
      {editingRecipe && <EditRecipeModal recipe={editingRecipe} onClose={() => setEditingRecipe(null)} onSave={updateRecipe} />}
    </main>
  );
};

const iconButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '18px',
  padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
  borderRadius: tokens.radius.sm,
  lineHeight: 1,
};

export default RecettesPage;
