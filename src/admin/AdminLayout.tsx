import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Image,
  Instagram,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/content', label: 'Content', icon: FileText },
  { path: '/admin/gallery', label: 'Galerij', icon: Image },
  { path: '/admin/instagram', label: 'Instagram', icon: Instagram },
  { path: '/admin/settings', label: 'Instellingen', icon: Settings },
];

export default function AdminLayout({ children, onLogout }: { children: React.ReactNode; onLogout: () => void }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-72 bg-[#080808] border-r border-white/10 z-50 transform transition-transform duration-300 lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3">
                <img src="/logo.png" alt="Barber Iwan" className="h-12 w-auto" />
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-white/60 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-white/40 text-xs mt-2 font-sans">Content Management</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-sans transition-all ${
                    isActive
                      ? 'bg-gold/10 text-gold border-l-2 border-gold'
                      : 'text-white/60 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={onLogout}
              className="flex items-center gap-3 px-4 py-3 text-white/40 hover:text-red-400 transition-colors text-sm font-sans w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>Uitloggen</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white/60 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-gold text-xs tracking-widest uppercase font-sans">Admin</span>
        </div>

        <div className="p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
