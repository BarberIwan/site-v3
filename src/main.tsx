import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import Terms from './Terms.tsx';
import AdminApp from './admin/AdminApp.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </HashRouter>
  </StrictMode>
);
