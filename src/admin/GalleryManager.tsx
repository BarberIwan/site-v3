import { useEffect, useState, useRef } from 'react';
import { galleryApi } from '../services/api';
import { Upload, Trash2, ImageIcon } from 'lucide-react';

interface GalleryImage {
  id: number;
  title: string;
  description: string;
  image_path: string;
  sort_order: number;
}

export default function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const data = await galleryApi.getAll();
      if (data) setImages(data);
    } catch (error) {
      console.error('Error loading images:', error);
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
    formData.append('title', file.name);

    try {
      await galleryApi.upload(formData);
      loadImages();
    } catch (error) {
      console.error('Error uploading:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Weet je zeker dat je deze foto wilt verwijderen?')) return;

    try {
      await galleryApi.delete(id);
      loadImages();
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
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-sans">Galerij</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-4xl text-white">Foto\'s Beheren</h1>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn-cta animate-cta-pulse text-black font-sans text-xs tracking-widest uppercase px-6 py-3 rounded-sm flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploaden...' : 'Foto Uploaden'}
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
      ) : images.length === 0 ? (
        <div className="border border-white/10 bg-[#080808] p-12 text-center">
          <ImageIcon className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40 font-sans mb-2">Nog geen foto\'s</p>
          <p className="text-white/20 text-sm font-sans">Upload je eerste foto</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="border border-white/10 bg-[#080808] overflow-hidden group">
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={`${API_URL}${image.image_path}`}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="opacity-0 group-hover:opacity-100 bg-red-500/80 text-white p-2 rounded-sm hover:bg-red-500 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-white/60 text-xs font-sans truncate">{image.title}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
