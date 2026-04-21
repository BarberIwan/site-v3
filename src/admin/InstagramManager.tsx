import { useEffect, useState, useRef } from 'react';
import { instagramApi } from '../services/api';
import { Upload, Trash2, Instagram } from 'lucide-react';

interface InstagramItem {
  id: number;
  image_path: string;
  caption: string;
  link: string;
  sort_order: number;
}

export default function InstagramManager() {
  const [items, setItems] = useState<InstagramItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await instagramApi.getAll();
      if (data) setItems(data);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('caption', file.name);
    formData.append('link', 'https://www.instagram.com/barberiwan/');

    try {
      await instagramApi.upload(formData);
      loadItems();
    } catch (error) {
      console.error('Error uploading:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Weet je zeker dat je deze post wilt verwijderen?')) return;

    try {
      await instagramApi.delete(id);
      loadItems();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  return (
    <div>
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-px bg-gold" />
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-sans">Instagram</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-4xl text-white">Instagram Feed</h1>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn-cta animate-cta-pulse text-black font-sans text-xs tracking-widest uppercase px-6 py-3 rounded-sm flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploaden...' : 'Foto Toevoegen'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-white/40 font-sans">Laden...</div>
      ) : items.length === 0 ? (
        <div className="border border-white/10 bg-[#080808] p-12 text-center">
          <Instagram className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40 font-sans mb-2">Nog geen Instagram posts</p>
          <p className="text-white/20 text-sm font-sans">Upload foto\'s voor de Instagram feed</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="border border-white/10 bg-[#080808] overflow-hidden group">
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={`${API_URL}${item.image_path}`}
                  alt={item.caption}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="opacity-0 group-hover:opacity-100 bg-red-500/80 text-white p-2 rounded-sm hover:bg-red-500 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-white/60 text-xs font-sans truncate">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
