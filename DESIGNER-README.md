# Barber Iwan Website - Technische Documentatie

## Overzicht
High-end barbershop website voor Barber Iwan (Almere) met ingebouwd CMS.
- **Frontend:** React 19 + TypeScript + Tailwind CSS + GSAP
- **Backend:** Node.js + Express + SQLite (better-sqlite3)
- **CMS:** Admin panel op `/admin` voor content beheer

---

## Vereisten
- Node.js 20+
- NPM

---

## Snelstart (Lokaal)

```bash
# 1. Pak uit en ga naar de map
cd app

# 2. Installeer dependencies
npm install

# 3. Start de backend server
npm run server

# 4. Start de frontend (in nieuw terminal venster)
npm run dev
```

De website draait dan op:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001

---

## Productie Deployment

### Stap 1: Bouwen
```bash
npm install
npm run build
```
Dit maakt een `dist/` map met de gecompileerde frontend.

### Stap 2: Environment Variables
Maak een `.env` bestand in de root:
```
VITE_API_URL=https://jouwdomein.nl/api
JWT_SECRET=een-sterke-geheime-sleutel-minstens-32-karakters
PORT=3001
```

### Stap 3: Upload naar server
Upload de volgende mappen/bestanden:
- `dist/` - Frontend build
- `backend/` - Backend code
- `package.json` - Dependencies
- `.env` - Environment variables

### Stap 4: Start backend op server
```bash
npm install --production
npm run server
```

### Stap 5: Configureer webserver (Nginx)
```nginx
server {
    listen 80;
    server_name barberiwan.nl www.barberiwan.nl;

    # Frontend - statische bestanden
    location / {
        root /var/www/barberiwan/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Uploads
    location /uploads/ {
        alias /var/www/barberiwan/backend/uploads/;
    }
}
```

---

## Bestandsstructuur

```
app/
├── dist/                  # Gecompileerde frontend (na build)
├── public/                # Statische assets (foto's, logo, sitemap)
│   ├── logo.png
│   ├── hero-barber.jpg
│   ├── ig-1.jpg t/m ig-6.jpg      # Instagram foto's
│   ├── carousel-1/2/3.jpg         # Carousel foto's
│   ├── sitemap.xml
│   └── robots.txt
├── src/
│   ├── App.tsx            # Hoofdpagina
│   ├── Terms.tsx          # Algemene Voorwaarden
│   ├── main.tsx           # Router config
│   ├── index.css          # Styling + animaties
│   ├── services/api.ts    # API client
│   └── admin/             # CMS admin panel
│       ├── AdminApp.tsx
│       ├── AdminLogin.tsx
│       ├── Dashboard.tsx
│       ├── ContentManager.tsx
│       ├── GalleryManager.tsx
│       ├── InstagramManager.tsx
│       └── SettingsManager.tsx
├── backend/
│   ├── src/
│   │   ├── server.ts      # Express server
│   │   └── database.ts    # SQLite database setup
│   ├── database/          # Database bestand (auto-created)
│   └── uploads/           # Geuploade foto's (auto-created)
├── index.html             # SEO meta tags + structured data
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

---

## Belangrijke Pagina's

| Route | Beschrijving |
|-------|-------------|
| `/` | Homepage (Hero, Over, Gallery, Agenda, Contact) |
| `/#/terms` | Algemene Voorwaarden |
| `/#/admin` | CMS Login |
| `/#/admin/dashboard` | CMS Dashboard |
| `/#/admin/content` | Teksten bewerken |
| `/#/admin/gallery` | Galerij foto's beheren |
| `/#/admin/instagram` | Instagram feed beheren |
| `/#/admin/settings` | Contactgegevens + openingstijden |

---

## API Endpoints

### Auth
- `POST /api/auth/login` - Inloggen (body: username, password)
- `POST /api/auth/change-password` - Wachtwoord wijzigen

### Content
- `GET /api/content` - Alle content secties
- `PUT /api/content/:key` - Update content sectie

### Gallery
- `GET /api/gallery` - Alle galerij foto's
- `POST /api/gallery` - Upload nieuwe foto
- `DELETE /api/:id` - Verwijder foto

### Instagram
- `GET /api/instagram` - Alle Instagram items
- `POST /api/instagram` - Upload nieuw item
- `DELETE /api/instagram/:id` - Verwijder item

### Settings
- `GET /api/settings` - Alle instellingen
- `PUT /api/settings/:key` - Update instelling

### Dashboard
- `GET /api/admin/stats` - Statistieken

---

## Database (SQLite)

Automatisch aangemaakt bij eerste start. Bevat tabellen:
- `users` - Admin gebruikers
- `content_sections` - Bewerkbare teksten
- `gallery_images` - Galerij foto's
- `instagram_feed` - Instagram items
- `site_settings` - Contactgegevens, openingstijden

**Standaard login:**
- Username: `admin`
- Wachtwoord: `admin123`

**Direct wijzigen na eerste keer inloggen!**

---

## SEO

De website is volledig geoptimaliseerd:
- Meta tags (title, description, keywords)
- Open Graph tags (voor social media)
- Sitemap.xml (7 pagina's)
- Robots.txt
- Schema.org structured data (9 types)
- Canonical URLs
- PWA manifest.json

---

## Contact

Bij vragen over deze codebase, raadpleeg:
- `info.md` - Initiële setup instructies
- `README.md` - Algemene project info
