import { useState } from 'react';
import { tokens } from '../tokens';
import Button from '../components/Button';
import Card from '../components/Card';

// ---- Styles partagés ----

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

const iconButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
  padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
  borderRadius: tokens.radius.sm,
  lineHeight: 1,
  color: tokens.colors.gray600,
};

// ---- Modal ajout / édition ----

const EnseigneModal = ({ enseigne, onClose, onSave }) => {
  const [name, setName] = useState(enseigne?.name ?? '');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({ ...(enseigne ?? {}), name: name.trim() });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter') handleSubmit();
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
        maxWidth: '400px',
        boxShadow: tokens.shadow.lg,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: tokens.spacing.lg,
        }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: tokens.colors.bark }}>
            {enseigne ? 'Modifier l\'enseigne' : 'Nouvelle enseigne'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', color: tokens.colors.gray400, cursor: 'pointer', lineHeight: 1 }}>
            ×
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: tokens.colors.gray600,
              marginBottom: tokens.spacing.xs,
            }}>
              Nom de l'enseigne *
            </label>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex : Maraîcher Wazemmes"
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', gap: tokens.spacing.sm, justifyContent: 'flex-end', marginTop: tokens.spacing.sm }}>
            <Button variant="ghost" onClick={onClose}>Annuler</Button>
            <Button onClick={handleSubmit} disabled={!name.trim()}>
              {enseigne ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---- Page principale ----

const EnseignesPage = ({ enseignes, setEnseignes }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingEnseigne, setEditingEnseigne] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const moveUp = (index) => {
    if (index === 0) return;
    setEnseignes(prev => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const moveDown = (index) => {
    if (index === enseignes.length - 1) return;
    setEnseignes(prev => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  const handleDelete = (id) => {
    setEnseignes(prev => prev.filter(e => e.id !== id));
    setConfirmDeleteId(null);
  };

  const handleSave = (data) => {
    if (data.id) {
      setEnseignes(prev => prev.map(e => e.id === data.id ? data : e));
    } else {
      setEnseignes(prev => [...prev, { ...data, id: Date.now() }]);
    }
    setShowModal(false);
    setEditingEnseigne(null);
  };

  return (
    <main style={{ maxWidth: '600px', margin: '0 auto', padding: tokens.spacing.xl }}>
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
            Mes enseignes
          </h1>
          <p style={{ fontSize: '14px', color: tokens.colors.gray400, margin: `${tokens.spacing.xs} 0 0 0` }}>
            {enseignes.length} enseigne{enseignes.length !== 1 ? 's' : ''} — associez vos articles depuis la page Courses
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>+ Nouvelle enseigne</Button>
      </div>

      {/* Liste */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
        {enseignes.map((enseigne, index) => (
          <Card key={enseigne.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.md }}>
              {/* Réordonnancement */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0 }}>
                <button
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  title="Monter"
                  style={{ ...iconButtonStyle, fontSize: '12px', padding: '2px 6px', opacity: index === 0 ? 0.3 : 1 }}
                >
                  ▲
                </button>
                <button
                  onClick={() => moveDown(index)}
                  disabled={index === enseignes.length - 1}
                  title="Descendre"
                  style={{ ...iconButtonStyle, fontSize: '12px', padding: '2px 6px', opacity: index === enseignes.length - 1 ? 0.3 : 1 }}
                >
                  ▼
                </button>
              </div>

              {/* Numéro */}
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: tokens.colors.sageLight,
                color: tokens.colors.sageDark,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: '600',
                flexShrink: 0,
              }}>
                {index + 1}
              </div>

              {/* Nom */}
              <div style={{ flex: 1, fontSize: '15px', fontWeight: '500', color: tokens.colors.bark }}>
                {enseigne.name}
              </div>

              {/* Actions */}
              {confirmDeleteId === enseigne.id ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.xs, flexShrink: 0 }}>
                  <span style={{ fontSize: '13px', color: tokens.colors.gray600 }}>Supprimer ?</span>
                  <button onClick={() => handleDelete(enseigne.id)} style={{ ...iconButtonStyle, color: '#C0392B' }}>Oui</button>
                  <button onClick={() => setConfirmDeleteId(null)} style={iconButtonStyle}>Non</button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: tokens.spacing.xs, flexShrink: 0 }}>
                  <button onClick={() => setEditingEnseigne(enseigne)} title="Modifier" style={iconButtonStyle}>✏️</button>
                  <button onClick={() => setConfirmDeleteId(enseigne.id)} title="Supprimer" style={iconButtonStyle}>🗑️</button>
                </div>
              )}
            </div>
          </Card>
        ))}

        {enseignes.length === 0 && (
          <div style={{ textAlign: 'center', padding: tokens.spacing.xxl, color: tokens.colors.gray400 }}>
            <div style={{ fontSize: '48px', marginBottom: tokens.spacing.md }}>🏪</div>
            <p style={{ margin: 0, fontSize: '15px' }}>Aucune enseigne configurée</p>
            <p style={{ margin: `${tokens.spacing.sm} 0 0 0`, fontSize: '13px' }}>
              Ajoutez vos magasins habituels, puis assignez vos articles depuis la page Courses.
            </p>
          </div>
        )}
      </div>

      {(showModal || editingEnseigne) && (
        <EnseigneModal
          enseigne={editingEnseigne}
          onClose={() => { setShowModal(false); setEditingEnseigne(null); }}
          onSave={handleSave}
        />
      )}
    </main>
  );
};

export default EnseignesPage;
