import { useEffect, useState } from 'react';
import { settingsApi } from '../services/api';
import { Save, Check, Phone, Clock, Instagram } from 'lucide-react';

interface Settings {
  [key: string]: string;
}

export default function SettingsManager() {
  const [settings, setSettings] = useState<Settings>({});
  const [editing, setEditing] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsApi.getAll();
      if (data) {
        setSettings(data);
        setEditing(data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      for (const [key, value] of Object.entries(editing)) {
        if (value !== settings[key]) {
          await settingsApi.update(key, value);
        }
      }
      setSettings({ ...editing });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  const settingGroups = [
    {
      title: 'Contactgegevens',
      icon: Phone,
      settings: [
        { key: 'phone', label: 'Telefoonnummer', type: 'text', placeholder: '06-27 40 36 07' },
        { key: 'email', label: 'E-mailadres', type: 'email', placeholder: 'info@barberiwan.nl' },
        { key: 'address', label: 'Adres', type: 'text', placeholder: 'Almere' },
      ]
    },
    {
      title: 'Social Media',
      icon: Instagram,
      settings: [
        { key: 'instagram', label: 'Instagram URL', type: 'url', placeholder: 'https://www.instagram.com/barberiwan/' },
      ]
    },
    {
      title: 'Openingstijden',
      icon: Clock,
      settings: [
        { key: 'opening_hours_tue_fri', label: 'Dinsdag - Vrijdag', type: 'text', placeholder: '09:00 - 17:00' },
        { key: 'opening_hours_sat', label: 'Zaterdag', type: 'text', placeholder: '09:00 - 17:00' },
        { key: 'opening_hours_sun_mon', label: 'Zondag & Maandag', type: 'text', placeholder: 'Gesloten' },
      ]
    }
  ];

  if (loading) {
    return <div className="text-white/40 font-sans">Laden...</div>;
  }

  return (
    <div>
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-px bg-gold" />
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-sans">Instellingen</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-4xl text-white">Instellingen</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-6 py-3 text-xs tracking-widest uppercase font-sans transition-all ${
              saved
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'btn-cta text-black'
            }`}
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                Opgeslagen
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {saving ? 'Opslaan...' : 'Alles Opslaan'}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {settingGroups.map((group) => {
          const Icon = group.icon;
          return (
            <div key={group.title} className="border border-white/10 bg-[#080808] p-6">
              <div className="flex items-center gap-3 mb-6">
                <Icon className="w-5 h-5 text-gold" />
                <h2 className="font-serif text-xl text-white">{group.title}</h2>
              </div>

              <div className="space-y-4">
                {group.settings.map((setting) => (
                  <div key={setting.key}>
                    <label className="block text-white/40 text-xs tracking-widest uppercase mb-2 font-sans">
                      {setting.label}
                    </label>
                    <input
                      type={setting.type}
                      value={editing[setting.key] || ''}
                      onChange={(e) => setEditing({ ...editing, [setting.key]: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/20 text-white px-4 py-3 focus:border-gold focus:outline-none transition-colors font-sans text-sm"
                      placeholder={setting.placeholder}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
