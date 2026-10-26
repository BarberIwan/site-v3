import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import AdminApp from './AdminApp';

// Het beheer draait los van de publieke site op /admin/ en wordt alleen daar
// geladen, zodat het niet in de bundel van de bezoekers zit.
export function mountAdmin(el: HTMLElement) {
  createRoot(el).render(
    <StrictMode>
      <HashRouter>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </HashRouter>
    </StrictMode>,
  );
}
