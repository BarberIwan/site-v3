import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import db from './database';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'barberiwan-secret-key-2024';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// ===== AUTH ROUTES =====

// Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Change password
app.post('/api/auth/change-password', authenticateToken, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.userId) as any;

    const validPassword = bcrypt.compareSync(currentPassword, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, req.user.userId);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== CONTENT SECTIONS ROUTES =====

// Get all content sections
app.get('/api/content', (req, res) => {
  try {
    const sections = db.prepare('SELECT * FROM content_sections ORDER BY section_key').all();
    res.json(sections);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single content section
app.get('/api/content/:key', (req, res) => {
  try {
    const section = db.prepare('SELECT * FROM content_sections WHERE section_key = ?').get(req.params.key);
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }
    res.json(section);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update content section (admin only)
app.put('/api/content/:key', authenticateToken, (req, res) => {
  try {
    const { title, subtitle, content } = req.body;
    db.prepare('UPDATE content_sections SET title = ?, subtitle = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE section_key = ?')
      .run(title, subtitle, content, req.params.key);

    const updated = db.prepare('SELECT * FROM content_sections WHERE section_key = ?').get(req.params.key);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== GALLERY ROUTES =====

// Get all gallery images
app.get('/api/gallery', (req, res) => {
  try {
    const images = db.prepare('SELECT * FROM gallery_images ORDER BY sort_order').all();
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add gallery image
app.post('/api/gallery', authenticateToken, upload.single('image'), (req, res) => {
  try {
    const { title, description } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    
    const result = db.prepare('INSERT INTO gallery_images (title, description, image_path, sort_order) VALUES (?, ?, ?, ?)')
      .run(title, description, imagePath, 0);

    const image = db.prepare('SELECT * FROM gallery_images WHERE id = ?').get(result.lastInsertRowid);
    res.json(image);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete gallery image
app.delete('/api/gallery/:id', authenticateToken, (req, res) => {
  try {
    const image = db.prepare('SELECT * FROM gallery_images WHERE id = ?').get(req.params.id) as any;
    
    if (image && image.image_path) {
      const filePath = path.join(__dirname, '..', image.image_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    db.prepare('DELETE FROM gallery_images WHERE id = ?').run(req.params.id);
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== INSTAGRAM FEED ROUTES =====

// Get all Instagram feed items
app.get('/api/instagram', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM instagram_feed ORDER BY sort_order').all();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add Instagram feed item
app.post('/api/instagram', authenticateToken, upload.single('image'), (req, res) => {
  try {
    const { caption, link } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    
    const result = db.prepare('INSERT INTO instagram_feed (image_path, caption, link, sort_order) VALUES (?, ?, ?, ?)')
      .run(imagePath, caption, link, 0);

    const item = db.prepare('SELECT * FROM instagram_feed WHERE id = ?').get(result.lastInsertRowid);
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete Instagram feed item
app.delete('/api/instagram/:id', authenticateToken, (req, res) => {
  try {
    const item = db.prepare('SELECT * FROM instagram_feed WHERE id = ?').get(req.params.id) as any;
    
    if (item && item.image_path) {
      const filePath = path.join(__dirname, '..', item.image_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    db.prepare('DELETE FROM instagram_feed WHERE id = ?').run(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== SITE SETTINGS ROUTES =====

// Get all settings
app.get('/api/settings', (req, res) => {
  try {
    const settings = db.prepare('SELECT * FROM site_settings').all() as any[];
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.setting_key] = s.setting_value;
    });
    res.json(settingsMap);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update setting (admin only)
app.put('/api/settings/:key', authenticateToken, (req, res) => {
  try {
    const { value } = req.body;
    db.prepare('INSERT OR REPLACE INTO site_settings (setting_key, setting_value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)')
      .run(req.params.key, value);

    res.json({ key: req.params.key, value });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== DASHBOARD STATS =====

app.get('/api/admin/stats', authenticateToken, (req, res) => {
  try {
    const galleryCount = db.prepare('SELECT COUNT(*) as count FROM gallery_images').get() as any;
    const instagramCount = db.prepare('SELECT COUNT(*) as count FROM instagram_feed').get() as any;
    const contentCount = db.prepare('SELECT COUNT(*) as count FROM content_sections').get() as any;
    
    res.json({
      galleryImages: galleryCount.count,
      instagramPosts: instagramCount.count,
      contentSections: contentCount.count
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Barber Iwan CMS Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
