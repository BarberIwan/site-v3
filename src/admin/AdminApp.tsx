import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import ContentManager from './ContentManager';
import GalleryManager from './GalleryManager';
import InstagramManager from './InstagramManager';
import SettingsManager from './SettingsManager';

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-gold font-sans text-sm tracking-widest uppercase">Laden...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <AdminLayout onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/content" element={<ContentManager />} />
        <Route path="/gallery" element={<GalleryManager />} />
        <Route path="/instagram" element={<InstagramManager />} />
        <Route path="/settings" element={<SettingsManager />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
}
