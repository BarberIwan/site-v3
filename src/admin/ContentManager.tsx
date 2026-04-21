import { useEffect, useState } from 'react';
import { contentApi } from '../services/api';
import { Save, Check } from 'lucide-react';

interface ContentSection {
  id: number;
  section_key: string;
  title: string;
  subtitle: string;
  content: string;
  updated_at: string;
}

export default function ContentManager() {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [editing, setEditing] = useState<Record<string, { title: string; subtitle: string; content: string }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const data = await contentApi.getAll();
      if (data) {
        setSections(data);
        const edits: Record<string, any> = {};
        data.forEach((s: ContentSection) => {
          edits[s.section_key] = { title: s.title || '', subtitle: s.subtitle || '', content: s.content || '' };
        });
        setEditing(edits);
      }
    } catch (error) {
      console.error('Error loading sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (key: string) => {
    setSaving(key);
    setSaved(null);
    try {
      await contentApi.update(key, editing[key]);
      setSaved(key);
      setTimeout(() => setSaved(null), 2000);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(null);
    }
  };

  const sectionLabels: Record<string, { label: string; description: string }> = {
    hero_title: { label: 'Hero Titel', description: 'De hoofdtitel op de homepage' },
    about_text: { label: 'Over Mij Tekst', description: 'De tekst in de Over sectie' },
    quote_text: { label: 'Quote', description: 'De quote op de homepage' },
  };

  if (loading) {
    return <div className="text-white/40 font-sans">Laden...</div>;
  }

  return (
    <div>
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-px bg-gold" />
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-sans">Content</span>
        </div>
        <h1 className="font-serif text-4xl text-white">Teksten Bewerken</h1>
      </div>

      <div className="space-y-6">
        {sections.map((section) => {
          const label = sectionLabels[section.section_key] || { label: section.section_key, description: '' };
          const edit = editing[section.section_key] || { title: '', subtitle: '', content: '' };

          return (
            <div key={section.id} className="border border-white/10 bg-[#080808] p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-serif text-xl text-white">{label.label}</h2>
                  <p className="text-white/40 text-xs font-sans">{label.description}</p>
                </div>
                <button
                  onClick={() => handleSave(section.section_key)}
                  disabled={saving === section.section_key}
                  className={`flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase font-sans transition-all ${
                    saved === section.section_key
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'btn-cta text-black'
                  }`}
                >
                  {saved === section.section_key ? (
                    <>
                      <Check className="w-4 h-4" />
                      Opgeslagen
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {saving === section.section_key ? 'Opslaan...' : 'Opslaan'}
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-4">
                {section.section_key !== 'quote_text' && (
                  <>
                    <div>
                      <label className="block text-white/40 text-xs tracking-widest uppercase mb-2 font-sans">Titel</label>
                      <input
                        type="text"
                        value={edit.title}
                        onChange={(e) => setEditing({
                          ...editing,
                          [section.section_key]: { ...edit, title: e.target.value }
                        })}
                        className="w-full bg-[#0a0a0a] border border-white/20 text-white px-4 py-3 focus:border-gold focus:outline-none transition-colors font-sans text-sm"
                      />
                    </div>

                    {section.section_key === 'about_text' && (
                      <div>
                        <label className="block text-white/40 text-xs tracking-widest uppercase mb-2 font-sans">Subtitle</label>
                        <input
                          type="text"
                          value={edit.subtitle}
                          onChange={(e) => setEditing({
                            ...editing,
                            [section.section_key]: { ...edit, subtitle: e.target.value }
                          })}
                          className="w-full bg-[#0a0a0a] border border-white/20 text-white px-4 py-3 focus:border-gold focus:outline-none transition-colors font-sans text-sm"
                        />
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label className="block text-white/40 text-xs tracking-widest uppercase mb-2 font-sans">
                    {section.section_key === 'quote_text' ? 'Quote Tekst' : 'Content'}
                  </label>
                  <textarea
                    value={edit.content}
                    onChange={(e) => setEditing({
                      ...editing,
                      [section.section_key]: { ...edit, content: e.target.value }
                    })}
                    rows={section.section_key === 'quote_text' ? 3 : 5}
                    className="w-full bg-[#0a0a0a] border border-white/20 text-white px-4 py-3 focus:border-gold focus:outline-none transition-colors font-sans text-sm resize-vertical"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
