import { useState } from 'react';
import { tokens } from '../tokens';
import { demoRecipes } from '../data/demoData';
import Card from '../components/Card';
import Panel from '../components/Panel';
import Button from '../components/Button';

const PlanningPage = () => {
  const [selectedRecipes, setSelectedRecipes] = useState([]);

  const toggleRecipe = (recipe) => {
    const exists = selectedRecipes.find(r => r.id === recipe.id);
    if (exists) {
      setSelectedRecipes(selectedRecipes.filter(r => r.id !== recipe.id));
    } else {
      setSelectedRecipes([...selectedRecipes, recipe]);
    }
  };

  const removeRecipe = (recipeId) => {
    setSelectedRecipes(selectedRecipes.filter(r => r.id !== recipeId));
  };

  const isSelected = (id) => selectedRecipes.some(r => r.id === id);

  const handleGenerateShoppingList = () => {
    if (selectedRecipes.length >= 7) {
      // TODO: Implémenter la génération de la liste de courses
      console.log('Génération de la liste de courses pour', selectedRecipes.length, 'plats');
    }
  };

  return (
    <main style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: tokens.spacing.xl,
      display: 'grid',
      gridTemplateColumns: '1fr 380px',
      gridTemplateRows: 'auto 1fr',
      gap: tokens.spacing.xl,
      alignItems: 'start',
    }}>
      {/* Titre Suggestions */}
      <h1 style={{
        fontSize: '24px',
        fontWeight: '600',
        color: tokens.colors.bark,
        margin: 0,
        letterSpacing: '-0.5px',
      }}>
        Suggestions
      </h1>

      {/* Titre Ma liste */}
      <h1 style={{
        fontSize: '24px',
        fontWeight: '600',
        color: tokens.colors.bark,
        margin: 0,
        letterSpacing: '-0.5px',
      }}>
        Ma liste
      </h1>

      {/* Colonne principale - Grille de recettes */}
      <div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: tokens.spacing.md,
        }}>
          {demoRecipes.map(recipe => (
            <Card
              key={recipe.id}
              selected={isSelected(recipe.id)}
              onClick={() => toggleRecipe(recipe)}
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
                  fontWeight: '600',
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
                marginBottom: tokens.spacing.sm,
              }}>
                {recipe.name}
              </h3>

              <div style={{
                marginTop: tokens.spacing.sm,
                paddingTop: tokens.spacing.sm,
                borderTop: `1px solid ${tokens.colors.gray100}`,
              }}>
                <div style={{
                  fontSize: '13px',
                  color: tokens.colors.gray600,
                  marginBottom: tokens.spacing.xs,
                }}>
                  <strong style={{ color: tokens.colors.bark }}>Protéine :</strong> {recipe.protein}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: tokens.colors.gray400,
                }}>
                  Source : {recipe.source}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Colonne droite - Panneau latéral */}
      <div>
        <Panel>
          {/* Compteur */}
          {selectedRecipes.length > 0 && (
            <div style={{
              fontSize: '12px',
              color: tokens.colors.gray400,
              marginBottom: tokens.spacing.md,
              textAlign: 'center',
            }}>
              {selectedRecipes.length} {selectedRecipes.length === 1 ? 'plat sélectionné' : 'plats sélectionnés'}
            </div>
          )}

          {/* Liste des recettes sélectionnées */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
            {selectedRecipes.length === 0 ? (
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
              selectedRecipes.map((recipe, index) => (
                <div
                  key={recipe.id}
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
                    {recipe.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecipe(recipe.id);
                    }}
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: tokens.colors.gray400,
                      cursor: 'pointer',
                      fontSize: '14px',
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

          {/* Bouton générer la liste de courses */}
          {selectedRecipes.length > 0 && (
            <Button 
              onClick={handleGenerateShoppingList}
              disabled={selectedRecipes.length < 7}
              style={{ width: '100%', marginTop: tokens.spacing.lg }}
            >
              Générer la liste de courses →
            </Button>
          )}
        </Panel>
      </div>
    </main>
  );
};

export default PlanningPage;
