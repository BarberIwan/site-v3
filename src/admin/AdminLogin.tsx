import { useState } from 'react';
import { authApi } from '../services/api';
import { Lock, User, ArrowRight } from 'lucide-react';

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authApi.login(username, password);
      if (result && result.token) {
        localStorage.setItem('admin_token', result.token);
        localStorage.setItem('admin_user', result.username);
        onLogin();
      }
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Inloggen mislukt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a84a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative w-full max-w-md mx-4">
        {/* Card */}
        <div className="border border-gold/30 bg-gradient-to-br from-[#0d0d0d] to-[#080808] p-8 md:p-12 relative overflow-hidden">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-gold" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gold" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-gold" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-gold" />

          {/* Logo */}
          <div className="text-center mb-10">
            <img src="/logo.png" alt="Barber Iwan" className="h-20 w-auto mx-auto mb-6" />
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-8 h-px bg-gold" />
              <span className="text-gold text-xs tracking-[0.3em] uppercase font-sans">Admin Panel</span>
              <div className="w-8 h-px bg-gold" />
            </div>
            <h1 className="font-serif text-2xl text-white">Content Management</h1>
          </div>

          {error && (
            <div className="mb-6 p-4 border border-red-500/30 bg-red-500/10 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/60 text-xs tracking-widest uppercase mb-2 font-sans">
                Gebruikersnaam
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/20 text-white pl-12 pr-4 py-4 focus:border-gold focus:outline-none transition-colors font-sans text-sm"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white/60 text-xs tracking-widest uppercase mb-2 font-sans">
                Wachtwoord
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/20 text-white pl-12 pr-4 py-4 focus:border-gold focus:outline-none transition-colors font-sans text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-cta animate-cta-pulse text-black font-sans text-sm tracking-[0.2em] uppercase py-4 rounded-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Bezig...' : 'Inloggen'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
