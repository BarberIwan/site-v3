import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(__dirname, '../database/cms.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS content_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_key TEXT UNIQUE NOT NULL,
    title TEXT,
    subtitle TEXT,
    content TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS gallery_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    image_path TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS instagram_feed (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_path TEXT NOT NULL,
    caption TEXT,
    link TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Eerste beheerder alleen met een zelfgekozen wachtwoord uit ADMIN_PASSWORD;
// het oude vaste wachtwoord stond in deze openbare repo.
const defaultUser = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
if (!defaultUser) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminPassword && adminPassword.length >= 12) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run('admin', hashedPassword);
  } else {
    console.warn('Geen beheerder aangemaakt: zet ADMIN_PASSWORD (minstens 12 tekens) in backend/.env.');
  }
}

// Insert default content sections
const defaultSections = [
  { section_key: 'hero_title', title: 'Waar precisie persoonlijke aandacht ontmoet', subtitle: '', content: 'Drie decennia ervaring in Europees, Aziatisch en Black hair.' },
  { section_key: 'about_text', title: 'Meer Dan Alleen Een Knipbeurt', subtitle: '30+ jaar ervaring', content: 'Met meer dan 30 jaar ervaring in kappersland, combineert Barber Iwan vakmanschap met persoonlijke aandacht. Gespecialiseerd in Europees, Aziatisch en Black hair. Elke klant is uniek, elk kapsel een meesterwerk.' },
  { section_key: 'quote_text', title: '', subtitle: '', content: 'Een kapsel is niet zomaar haar. Het is je identiteit, je uitstraling, je vertrouwen.' },
];

for (const section of defaultSections) {
  const existing = db.prepare('SELECT * FROM content_sections WHERE section_key = ?').get(section.section_key);
  if (!existing) {
    db.prepare('INSERT INTO content_sections (section_key, title, subtitle, content) VALUES (?, ?, ?, ?)')
      .run(section.section_key, section.title, section.subtitle, section.content);
  }
}

// Insert default settings
const defaultSettings = [
  { setting_key: 'phone', setting_value: '06-27 40 36 07' },
  { setting_key: 'email', setting_value: 'info@barberiwan.nl' },
  { setting_key: 'address', setting_value: 'Almere' },
  { setting_key: 'instagram', setting_value: 'https://www.instagram.com/barberiwan/' },
  { setting_key: 'opening_hours_tue_fri', setting_value: 'Dinsdag - Vrijdag: 09:00 - 17:00' },
  { setting_key: 'opening_hours_sat', setting_value: 'Zaterdag: 09:00 - 17:00' },
  { setting_key: 'opening_hours_sun_mon', setting_value: 'Zondag & Maandag: Gesloten' },
];

for (const setting of defaultSettings) {
  const existing = db.prepare('SELECT * FROM site_settings WHERE setting_key = ?').get(setting.setting_key);
  if (!existing) {
    db.prepare('INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?)')
      .run(setting.setting_key, setting.setting_value);
  }
}

export default db;
