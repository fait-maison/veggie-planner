import { useState } from 'react';
import Header from './components/Header';
import PlanningPage from './pages/PlanningPage';
import { tokens } from './tokens';

function App() {
  const [currentPage, setCurrentPage] = useState('Planning');

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: tokens.colors.cream,
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      color: tokens.colors.gray800,
    }}>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {currentPage === 'Planning' && <PlanningPage />}

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
