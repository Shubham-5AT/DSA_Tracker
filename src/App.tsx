import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { DsaTracker } from './pages/DsaTracker';
import { Roadmap } from './pages/Roadmap';
import { Revision } from './pages/Revision';
import { DailyRituals } from './pages/DailyRituals';
import { Settings } from './pages/Settings';
import { useProgressStore, applyTheme } from './store/useProgressStore';
import './App.css';

const App: React.FC = () => {
  const { theme } = useProgressStore();

  // Apply theme class on initial boot
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dsa" element={<DsaTracker />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="revision" element={<Revision />} />
          <Route path="daily" element={<DailyRituals />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
