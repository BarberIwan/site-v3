import { useEffect, useState } from 'react';
import { dashboardApi } from '../services/api';
import { Image, Instagram, FileText, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ galleryImages: 0, instagramPosts: 0, contentSections: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await dashboardApi.getStats();
      if (data) setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Galerij Foto\'s', value: stats.galleryImages, icon: Image, color: 'text-blue-400' },
    { label: 'Instagram Posts', value: stats.instagramPosts, icon: Instagram, color: 'text-pink-400' },
    { label: 'Content Secties', value: stats.contentSections, icon: FileText, color: 'text-green-400' },
  ];

  return (
    <div>
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-px bg-gold" />
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-sans">Overzicht</span>
        </div>
        <h1 className="font-serif text-4xl text-white">Dashboard</h1>
      </div>

      {loading ? (
        <div className="text-white/40 font-sans">Laden...</div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {statCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  className="border border-white/10 bg-[#080808] p-6 hover:border-gold/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`w-8 h-8 ${card.color}`} />
                    <TrendingUp className="w-5 h-5 text-white/20" />
                  </div>
                  <div className="font-serif text-4xl text-white mb-1">{card.value}</div>
                  <div className="text-white/40 text-xs tracking-widest uppercase font-sans">{card.label}</div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="border border-white/10 bg-[#080808] p-8">
            <h2 className="font-serif text-2xl text-white mb-6">Snelle Acties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="#/admin/content"
                className="flex items-center gap-4 p-4 border border-white/10 hover:border-gold/50 transition-all group"
              >
                <FileText className="w-6 h-6 text-gold" />
                <div>
                  <div className="text-white font-sans text-sm group-hover:text-gold transition-colors">Content Bewerken</div>
                  <div className="text-white/40 text-xs">Teksten aanpassen</div>
                </div>
              </a>
              <a
                href="#/admin/gallery"
                className="flex items-center gap-4 p-4 border border-white/10 hover:border-gold/50 transition-all group"
              >
                <Image className="w-6 h-6 text-gold" />
                <div>
                  <div className="text-white font-sans text-sm group-hover:text-gold transition-colors">Galerij Beheren</div>
                  <div className="text-white/40 text-xs">Foto\'s toevoegen/verwijderen</div>
                </div>
              </a>
              <a
                href="#/admin/instagram"
                className="flex items-center gap-4 p-4 border border-white/10 hover:border-gold/50 transition-all group"
              >
                <Instagram className="w-6 h-6 text-gold" />
                <div>
                  <div className="text-white font-sans text-sm group-hover:text-gold transition-colors">Instagram Feed</div>
                  <div className="text-white/40 text-xs">Instagram foto\'s beheren</div>
                </div>
              </a>
              <a
                href="#/admin/settings"
                className="flex items-center gap-4 p-4 border border-white/10 hover:border-gold/50 transition-all group"
              >
                <div className="w-6 h-6 rounded-full border border-gold flex items-center justify-center">
                  <div className="w-2 h-2 bg-gold rounded-full" />
                </div>
                <div>
                  <div className="text-white font-sans text-sm group-hover:text-gold transition-colors">Instellingen</div>
                  <div className="text-white/40 text-xs">Contactgegevens aanpassen</div>
                </div>
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
