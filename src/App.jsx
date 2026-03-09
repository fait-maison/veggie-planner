import Header from './components/Header';
import PlanningPage from './pages/PlanningPage';
import CoursesPage from './pages/CoursesPage';
import RecettesPage from './pages/RecettesPage';
import { tokens } from './tokens';
import useLocalStorage from './hooks/useLocalStorage';
import { demoRecipes } from './data/demoData';

function App() {
  const [currentPage, setCurrentPage] = useState('Planning');
  const [selectedRecipes, setSelectedRecipes] = useLocalStorage('veggie-selected', []);
  const [recipes, setRecipes] = useLocalStorage('veggie-recipes', demoRecipes);

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
        />
      )}
      {currentPage === 'Courses' && (
        <CoursesPage selectedRecipes={selectedRecipes} />
      )}
      {currentPage === 'Recettes' && (
        <RecettesPage recipes={recipes} setRecipes={setRecipes} />
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
