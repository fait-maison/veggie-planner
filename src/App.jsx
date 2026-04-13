import { useState } from 'react';
import Header from './components/Header';
import PlanningPage from './pages/PlanningPage';
import CoursesPage from './pages/CoursesPage';
import RecettesPage from './pages/RecettesPage';
import EnseignesPage from './pages/EnseignesPage';
import HistoriquePage from './pages/HistoriquePage';
import { tokens } from './tokens';
import useLocalStorage from './hooks/useLocalStorage';
import { demoRecipes } from './data/demoData';
import { defaultEnseignes } from './data/defaultEnseignes';

function App() {
  const [currentPage, setCurrentPage] = useState('Planning');
  const [selectedRecipes, setSelectedRecipes] = useLocalStorage('veggie-selected', []);
  const [recipes, setRecipes] = useLocalStorage('veggie-recipes', demoRecipes);
  const [recurringItems, setRecurringItems] = useLocalStorage('veggie-recurring', [
    { id: 1, name: 'Yaourts nature' },
    { id: 2, name: 'Œufs bio x12' },
    { id: 3, name: 'Pain au levain' },
    { id: 4, name: 'Lait d\'avoine' },
  ]);
  const [enseignes, setEnseignes] = useLocalStorage('veggie-enseignes', defaultEnseignes);
  const [pantry, setPantry] = useLocalStorage('veggie-pantry', []);
  const [history, setHistory] = useLocalStorage('veggie-history', []);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const archiveWeek = () => {
    if (selectedRecipes.length === 0) return;
    const entry = { id: Date.now(), date: new Date().toISOString(), recipes: selectedRecipes };
    setHistory(prev => [entry, ...prev]);
    showToast(`Semaine archivée — ${selectedRecipes.length} plat${selectedRecipes.length !== 1 ? 's' : ''}`);
  };

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
          recipes={recipes}
          selectedRecipes={selectedRecipes}
          setSelectedRecipes={setSelectedRecipes}
          onGenerateList={() => setCurrentPage('Courses')}
          onArchive={archiveWeek}
        />
      )}
      {currentPage === 'Courses' && (
        <CoursesPage
          selectedRecipes={selectedRecipes}
          recurringItems={recurringItems}
          setRecurringItems={setRecurringItems}
          enseignes={enseignes}
          setEnseignes={setEnseignes}
          pantry={pantry}
          setPantry={setPantry}
        />
      )}
      {currentPage === 'Recettes' && (
        <RecettesPage recipes={recipes} setRecipes={setRecipes} />
      )}
      {currentPage === 'Enseignes' && (
        <EnseignesPage enseignes={enseignes} setEnseignes={setEnseignes} />
      )}
      {currentPage === 'Historique' && (
        <HistoriquePage
          history={history}
          setHistory={setHistory}
          recipes={recipes}
          onRestorePlanning={(savedRecipes) => {
            setSelectedRecipes(savedRecipes);
            setCurrentPage('Planning');
          }}
        />
      )}

      {toast && (
        <div style={{
          position: 'fixed',
          bottom: tokens.spacing.xl,
          right: `max(${tokens.spacing.xl}, calc((100vw - 1400px) / 2 + ${tokens.spacing.xl}))`,
          backgroundColor: tokens.colors.bark,
          color: tokens.colors.white,
          padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
          borderRadius: tokens.radius.md,
          fontSize: '14px',
          boxShadow: tokens.shadow.lg,
          zIndex: 1000,
          pointerEvents: 'none',
        }}>
          {toast}
        </div>
      )}

      <footer style={{
        textAlign: 'center',
        padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
        color: tokens.colors.gray400,
        fontSize: '13px',
        borderTop: `1px solid ${tokens.colors.sand}`,
        marginTop: tokens.spacing.xxl,
      }}>
        Une application faite maison
      </footer>
    </div>
  );
}

export default App
