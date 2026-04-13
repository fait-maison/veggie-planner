import { tokens } from '../tokens';
import Button from '../components/Button';

const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const HistoriquePage = ({ history, setHistory, recipes, onRestorePlanning }) => {
  const deleteEntry = (id) => {
    setHistory(prev => prev.filter(e => e.id !== id));
  };

  const restoreEntry = (entry) => {
    // Filtre les recettes archivées pour ne garder que celles encore présentes dans la bibliothèque
    const currentIds = new Set(recipes.map(r => r.id));
    const restorable = entry.recipes.filter(r => currentIds.has(r.id));
    onRestorePlanning(restorable);
  };

  return (
    <main style={{ maxWidth: '700px', margin: '0 auto', padding: tokens.spacing.xl }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: tokens.spacing.xl,
      }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '600', color: tokens.colors.bark, margin: 0, letterSpacing: '-0.5px' }}>
            Historique
          </h1>
          <p style={{ fontSize: '14px', color: tokens.colors.gray400, margin: `${tokens.spacing.xs} 0 0 0` }}>
            {history.length} semaine{history.length !== 1 ? 's' : ''} archivée{history.length !== 1 ? 's' : ''}
          </p>
        </div>
        {history.length > 0 && (
          <Button variant="ghost" onClick={() => setHistory([])}>Tout effacer</Button>
        )}
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: `${tokens.spacing.xxl} 0` }}>
          <div style={{ fontSize: '48px', marginBottom: tokens.spacing.md }}>📅</div>
          <p style={{ color: tokens.colors.gray400, fontSize: '15px', margin: 0 }}>
            Aucune semaine archivée pour l'instant.<br />
            Utilisez "Archiver cette semaine" depuis le Planning.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
          {history.map(entry => {
            const currentIds = new Set(recipes.map(r => r.id));
            const available = entry.recipes.filter(r => currentIds.has(r.id));
            const missing = entry.recipes.length - available.length;

            return (
              <div
                key={entry.id}
                style={{
                  backgroundColor: tokens.colors.white,
                  borderRadius: tokens.radius.md,
                  border: `1px solid ${tokens.colors.sand}`,
                  boxShadow: tokens.shadow.sm,
                  overflow: 'hidden',
                }}
              >
                {/* En-tête de la carte */}
                <div style={{
                  padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
                  borderBottom: `1px solid ${tokens.colors.sand}`,
                  backgroundColor: tokens.colors.sageLight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: tokens.colors.sageDark }}>
                      {formatDate(entry.date)}
                    </span>
                    <span style={{ fontSize: '12px', color: tokens.colors.gray400, marginLeft: tokens.spacing.sm }}>
                      {entry.recipes.length} plat{entry.recipes.length !== 1 ? 's' : ''}
                      {missing > 0 && (
                        <span style={{ color: tokens.colors.terracotta }}>
                          {' '}· {missing} recette{missing !== 1 ? 's' : ''} supprimée{missing !== 1 ? 's' : ''}
                        </span>
                      )}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    title="Supprimer cette entrée"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: tokens.colors.gray400,
                      cursor: 'pointer',
                      fontSize: '18px',
                      lineHeight: 1,
                      padding: `0 0 0 ${tokens.spacing.sm}`,
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Liste des recettes */}
                <div style={{ padding: `${tokens.spacing.sm} ${tokens.spacing.lg}` }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: tokens.spacing.sm, marginBottom: tokens.spacing.md }}>
                    {entry.recipes.map(r => {
                      const exists = currentIds.has(r.id);
                      return (
                        <span
                          key={r.id}
                          style={{
                            fontSize: '13px',
                            color: exists ? tokens.colors.gray800 : tokens.colors.gray400,
                            backgroundColor: exists ? tokens.colors.gray100 : 'transparent',
                            borderRadius: tokens.radius.sm,
                            padding: '3px 10px',
                            textDecoration: exists ? 'none' : 'line-through',
                          }}
                        >
                          {r.name}
                        </span>
                      );
                    })}
                  </div>
                  <Button
                    onClick={() => restoreEntry(entry)}
                    disabled={available.length === 0}
                    style={{ width: '100%' }}
                  >
                    Reprendre ce planning →
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default HistoriquePage;
